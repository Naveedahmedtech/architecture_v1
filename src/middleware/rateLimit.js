// Import the express-rate-limit package to enable rate limiting capabilities.
const rateLimit = require("express-rate-limit");
const { logger } = require("../config/logger/logger.config");
const { responseHandler } = require("../utils/common/apiResponseHandler");

// Configure the API rate limiting middleware using the express-rate-limit package.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Time window in milliseconds - here, set to 15 minutes.
  max: 100, // Maximum number of requests that a single IP address can make during the window period.

  // Custom handler for when a client exceeds the rate limit.
  // This function uses the application's standard logging and response handling utilities
  // to log a warning and send a standardized error response to the client.
  handler: (req, res) => {
    // Includes the offending IP address for audit and potential further action.
    logger.warn(`Rate limit exceeded for ${req.ip}`);

    // Use the standardized response handler to send a 429 Too Many Requests response.
    // This informs the client that they have exceeded the rate limit and should try again later.
    responseHandler(
      req,
      res,
      429,
      false,
      "Too many requests, please try again later."
    );
  },
});

module.exports = apiLimiter;
