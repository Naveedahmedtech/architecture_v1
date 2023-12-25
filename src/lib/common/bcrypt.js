const bcryptjs = require("bcryptjs");

/**
 * Hashes a password using bcryptjs.
 * @param {string} password - The password to hash.
 * @returns {Promise<string>} - A promise that resolves to the hashed password.
 */
const hashPassword = async (password) => {
  const salt = await bcryptjs.genSalt(10);
  return bcryptjs.hash(password, salt);
};

/**
 * Verifies a password against a hashed password.
 * @param {string} password - The plain text password to verify.
 * @param {string} hashedPassword - The hashed password to compare against.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating if the password is correct.
 */
const verifyPassword = async (password, hashedPassword) => {
  return bcryptjs.compare(password, hashedPassword);
};

module.exports = {
  hashPassword,
  verifyPassword,
};
