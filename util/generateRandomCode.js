function generateRandomCode(length = 4) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomCode = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomCode += characters[randomIndex];
  }
  return randomCode;
}


module.exports = {generateRandomCode };
