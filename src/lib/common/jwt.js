const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../constants/auth");

/**
 * Generates a JWT token for a user.
 * @param {Object} payload - The payload to include in the JWT.
 * @param {string} expiresIn - Duration for which the token is valid.
 * @returns {string} - The generated JWT token.
 */
const generateToken = (payload, expiresIn = "1h") => {
  try {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
  } catch (error) {
    console.error("Error generating JWT token:", error);
    throw error;
  }
};

/**
 * Verifies a JWT token and returns the decoded payload.
 * @param {string} token - The JWT token to verify.
 * @returns {Object|null} - The decoded payload or null if verification fails.
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error("JWT Verification Error:", error);
    throw error;
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
