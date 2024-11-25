const bcryptjs = require("bcryptjs");

/**
 * Hashes a password using bcrypt.
 * @param {string} password - The password to hash.
 * @returns {Promise<string>} - The hashed password.
 * @throws {Error} - Throws an error if hashing fails.
 */
const HashPassword = async (password) => {
  try {
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    return hashedPassword; 
  } catch (error) {
    console.error("Error hashing password:", error);
    throw new Error("Error hashing password"); // Throw an error for handling in the calling function
  }
};

module.exports = HashPassword;
