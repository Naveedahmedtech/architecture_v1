// Constants for JWT and cookie settings

// JWT secret key from environment variables
exports.JWT_SECRET = process.env.JWT_SECRET;

// Expiry times
exports.ACCESS_TOKEN_EXPIRY_SECONDS = 3600; // 1 hour in seconds
exports.REFRESH_TOKEN_EXPIRY_DAYS = 180 * 24 * 60 * 60; // 180 days

// Calculate max age in milliseconds for cookies
exports.MAX_AGE_ACCESS_TOKEN = exports.ACCESS_TOKEN_EXPIRY_SECONDS * 1000; // Convert seconds to milliseconds
exports.MAX_AGE_REFRESH_TOKEN =
  exports.REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000; // Convert days to milliseconds
