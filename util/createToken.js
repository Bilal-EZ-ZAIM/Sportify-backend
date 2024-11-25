const jwt = require("jsonwebtoken");
const CreateToken = (peylod, expires) => {
  const token = jwt.sign(peylod, process.env.JWT_SCREPT_KEY, {
    expiresIn: expires || "90d",
  });
  return token;
};

module.exports = CreateToken;
