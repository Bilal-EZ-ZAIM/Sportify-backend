const jwt = require("jsonwebtoken");
const UserModel = require("../model/user.model");

const verifyToken = async (req, res, next) => {
  // 1 check Token
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        status: "fail",
        message: "You are not login , Please login to get access this route.",
      });
    }

    // console.log(decodeToken);

    // 2 virefiy Token

    // invalid signature
    const decodeToken = jwt.verify(token, process.env.JWT_SCREPT_KEY);

    if (!decodeToken) {
      throw "You are not login , Please login to get access this route";
    }

    const currentUser = await UserModel.findById(decodeToken.id).select([
      "passwordChangedAt",
      "role",
      "name",
      "email",
      "password",
    ]);

    if (!currentUser) {
      return res.status(401).json({
        status: "fail",
        message: "The user belonging to this token no longer exists.",
      });
    }

    if (currentUser.passwordChangedAt) {
      const passwordChangedTimestamp = parseInt(
        currentUser.passwordChangedAt.getTime() / 1000,
        10
      );

      if (passwordChangedTimestamp > decodeToken.iat) {
        return res.status(401).json({
          status: "fail",
          message:
            "Your password has been recently updated. Please re-authenticate.",
        });
      }
    }

    req.user = currentUser;

    next();
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
        message: "Invalid token. Please log in again",
      });
    }
    return res.status(500).json({ error });
  }
};

module.exports = verifyToken;
