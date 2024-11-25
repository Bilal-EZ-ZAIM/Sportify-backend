const jwt = require("jsonwebtoken");
const user = require("../model/user.model");

const verifyCodeToken = async (req, res, next) => {
  // 1 check Token
  try {
    let token = req.params.token;
    const code = req.body.code;

    // Vérifier si le token est présent
    if (!token) {
      return res.status(401).json({
        status: "fail",
        message:
          "Vous n'êtes pas connecté, veuillez vous connecter pour accéder à cette route.",
      });
    }

    // Décoder le token JWT
    const decodeToken = jwt.verify(token, process.env.JWT_SCREPT_KEY);

    // Vérifier si le token est valide
    if (!decodeToken) {
      return res.status(401).json({
        status: "fail",
        message:
          "Token invalide. Veuillez vous reconnecter pour accéder à cette route.",
      });
    }

    // Trouver l'utilisateur associé au token
    const currentUser = await user.findById(decodeToken.id);

    // Vérifier si l'utilisateur existe toujours
    if (!currentUser) {
      return res.status(401).json({
        status: "fail",
        message: "L'utilisateur associé à ce token n'existe plus.",
      });
    }

    // Vérifier si le code fourni correspond à celui dans le token
    if (decodeToken.code !== code) {
      return res.status(400).json({
        status: "fail",
        message: "Le code de vérification est incorrect.",
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
        message:
          "Le temps imparti a expiré. Veuillez demander un nouveau code.",
      });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        status: "fail",
        message: "Token invalide. Veuillez vous reconnecter.",
      });
    }
    // Gestion des erreurs générales
    return res.status(500).json({
      status: "error",
      message: "Une erreur est survenue. Veuillez réessayer plus tard.",
      error: error.message,
    });
  }
};

module.exports = verifyCodeToken;
