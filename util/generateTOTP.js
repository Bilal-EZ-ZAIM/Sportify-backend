const speakeasy = require("speakeasy");

const generateTOTP = (expiryMinutes = 5) => {
  try {
    const secret = speakeasy.generateSecret({ length: 20 });

    const token = speakeasy.totp({
      secret: secret.base32,
      encoding: "base32",
    });

    const expirationTime = Date.now() + expiryMinutes * 60 * 1000; 

    return { token, expirationTime, secret: secret.base32 }; 
  } catch (error) {
    console.error("Erreur lors de la génération de la clé secrète :", error);
    throw new Error("Échec de la génération de la clé secrète");
  }
};

const verifyTOTP = (secret, token, expiryTime) => {
  console.log( "  scrett = " + secret);

  
  if (Date.now() > expiryTime) {
    console.error("Le code TOTP a expiré");
    return false;
  }

  const verified = speakeasy.totp.verify({
    secret: secret,
    encoding: "base32",
    token: token,
  });

  if (verified) {
    console.log("Le code TOTP est valide");
  } else {
    console.error("Le code TOTP est invalide");
  }

  return verified;
};


module.exports = {
  generateTOTP,
  verifyTOTP,
};
