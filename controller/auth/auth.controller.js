const User = require("../../model/user.model");
const CreateToken = require("../../util/createToken");
const HashPassword = require("../../util/HashPassword");
const slug = require("slug");
const envoyerEmail = require("../../util/mail");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const { generateRandomCode } = require("../../util/generateRandomCode");

const regester = async (req, res) => {
  const data = req.body;

  try {
    data.role = "client";
    data.slug = slug(data.name);

    if (data.password) {
      data.password = await HashPassword(data.password);
    }

    // data.tokenValidet = { token, expirationTime, secret };

    const user = await User.create(data);

    const token = CreateToken({ id: user._id }, "5m");

    const confirmationLink =
      "http://localhost:8001/api/auth/verifyAcount/" + token;

    await envoyerEmail(
      user.email,
      "verfei accoute",
      confirmationLink,
      null,
      "OTP"
    );

    return res.status(201).json({
      status: "success",
      message:
        "Congratulations! Your account has been created successfully. Please check your email for the verification code to complete your registration.",
      token,
    });
  } catch (error) {
    return res.status(400).json({
      message: "An error occurred during registration",
      error: error.message || "Internal server error",
    });
  }
};

const resendVerification = async (req, res) => {
  try {
    const user = req.user;

    const token = CreateToken({ id: user._id }, "5m");

    const confirmationLink =
      "http://localhost:8001/api/auth/verifyAcount/" + token;

    await envoyerEmail(
      user.email,
      "verfei accoute",
      confirmationLink,
      null,
      "OTP"
    );

    return res.status(201).json({
      status: "success",
      message: "A verification email has been sent to your email address.",

      token,
    });
  } catch (error) {
    return res.status(400).json({
      message: "An error occurred during registration",
      error: error.message || "Internal server error",
    });
  }
};

const verifierAccount = async (req, res) => {
  try {
    let token = req.params.token;

    if (!token) {
      return res.status(401).json({
        status: "fail",
        message: "You are not logged in, please log in to access this route.",
      });
    }

    const decodeToken = jwt.verify(token, process.env.JWT_SCREPT_KEY);

    if (!decodeToken) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid token. Please log in to access this route.",
      });
    }

    const currentUser = await User.findById(decodeToken.id);

    if (!currentUser) {
      return res.status(401).json({
        status: "fail",
        message: "The user belonging to this token no longer exists.",
      });
    }

    currentUser.isVirefier = true;
    await currentUser.save();

    res.status(200).redirect("http://localhost:5173/signin");
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "fail",
        message: "Your token has expired. Please log in again.",
      });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        status: "fail",
        message: "Invalid token. Please log in again.",
      });
    }
    return res.status(500).json({
      status: "error",
      message: "Something went wrong. Please try again later.",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user.isVirefier) {
      return res.status(404).json({
        status: "fail",
        message: "Email Or Password not correct.",
      });
    }

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "Email Or Password not correct.",
      });
    }

    const verifyPassword = await bcryptjs.compare(
      req.body.password,
      user.password
    );

    if (!verifyPassword) {
      return res.status(404).json({
        status: "fail",
        message: "Email Or Password not correct.",
      });
    }

    const code = generateRandomCode();

    const token = CreateToken({ id: user.id, code }, "5m");

    await envoyerEmail(
      user.email,
      "verfei accoute par code",
      (confirmationLink = null),
      code,
      "2FA"
    );

    return res.status(201).json({
      message:
        "You have received an email to verify your account. Please check your inbox and enter the verification code to complete the registration process.",
      token,
    });
  } catch (error) {
    return res.status(404).json({ error });
  }
};

const forgetpassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    // Check if the email exists in the system
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "Email is not found",
      });
    }

    if (!user.isVirefier) {
      return res.status(404).json({
        status: "fail",
        message: "Email Or Password not correct.",
      });
    }

    // Generate a random code
    const code = generateRandomCode();

    // Create a token valid for 5 minutes
    const token = CreateToken({ id: user.id, code }, "5m");

    // Send email with the 2FA code
    await envoyerEmail(
      user.email,
      "forgetpassword",
      (confirmationLink = null),
      code,
      "forgetpassword"
    );

    return res.status(200).json({
      message: "Code to reset password has been sent",
      token,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "An error occurred. Please try again later.",
      error,
    });
  }
};

const resetpassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    // Si tout est valide, retourner une réponse de succès

    const user = req.user;

    const hashedPassword = await HashPassword(newPassword);

    console.log(hashedPassword);

    const userId = req.user._id;
    await User.findByIdAndUpdate(
      userId,
      {
        password: hashedPassword,
        passwordChangedAt: new Date(),
      },
      { new: true }
    );
    const token = CreateToken({ id: user.id });
    res.status(200).json({
      token,
      user,
      status: "success",
      message: "Your password has been successfully updated.",
    });
  } catch (error) {
    // Gestion des erreurs spécifiques liées au token
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "fail",
        message: "The allotted time has expired. Please request a new code",
      });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        status: "fail",
        message: "Invalid token. Please log in again.",
      });
    }
    // Gestion des erreurs générales
    return res.status(500).json({
      status: "error",
      message: "An error has occurred. Please try again later.",
      error: error.message,
    });
  }
};

const updatedpassword = async (req, res) => {
  try {
    const { newPassword, password } = req.body;

    const user = req.user;

    console.log(user);

    const verifyPassword = await bcryptjs.compare(password, user.password);

    if (!verifyPassword) {
      return res.status(404).json({
        status: "fail",
        message: "Password not correct.",
      });
    }

    const hashedPassword = await HashPassword(newPassword);

    const userId = req.user._id;
    await User.findByIdAndUpdate(
      userId,
      {
        password: hashedPassword,
        passwordChangedAt: new Date(),
      },
      { new: true }
    );
    const token = CreateToken({ id: user.id });
    res.status(200).json({
      token,
      user,
      status: "success",
      message: "Your password has been successfully updated.",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "An error has occurred. Please try again later.",
      error: error.message,
    });
  }
};

const verifier2FA = async (req, res) => {
  try {
    let token = req.params.token;
    const code = req.body.code;

    if (!token) {
      return res.status(401).json({
        status: "fail",
        message: "You are not logged in. Please log in to access this route.",
      });
    }

    const decodeToken = jwt.verify(token, process.env.JWT_SCREPT_KEY);

    if (!decodeToken) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid token. Please log in again to access this route.",
      });
    }

    const currentUser = await User.findById(decodeToken.id);

    const tokens = CreateToken({ id: currentUser._id });

    if (!currentUser) {
      return res.status(401).json({
        status: "fail",
        message: "The user associated with this token no longer exists.",
      });
    }

    if (decodeToken.code !== code) {
      return res.status(400).json({
        status: "fail",
        message: "The verification code is incorrect.",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Your authentication was successful.",
      user: currentUser,
      token: tokens,
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(404).json({
        status: "fail",
        message: "The allotted time has expired. Please request a new code.",
      });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        status: "fail",
        message: "Invalid token. Please log in again.",
      });
    }
    return res.status(500).json({
      status: "error",
      message: "An error has occurred. Please try again later.",
      error: error.message,
    });
  }
};

const getUserById = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id);

    return res.status(200).json({
      message: "get user avec success",
      user,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message || "Internal server error",
    });
  }
};

const sendMail = async (req, res) => {
  try {
    const { email, msg } = req.body;

    const mail = await envoyerEmail(email, msg);

    return res.status(201).json({
      msg: "mail en vouye",
    });
  } catch (error) {}
};

const logout = async (req, res) => {
  try {
    const user = req.user;

    await User.findByIdAndUpdate(
      user._id,
      {
        passwordChangedAt: new Date(),
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Successfully logged out.",
    });
  } catch (error) {
    return res.status(500).json({
      error: "An error occurred while logging out. Please try again later.",
    });
  }
};

const loginByToken = async (req, res) => {
  try {
    const currentUser = req.user;

    if (!currentUser) {
      return res.status(401).json({ message: "User not authenticated." });
    }

    return res.status(200).json({
      user: currentUser,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login by token error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  regester,
  getUserById,
  verifierAccount,
  sendMail,
  login,
  verifier2FA,
  forgetpassword,
  updatedpassword,
  resetpassword,
  loginByToken,
  logout,
  resendVerification,
};
