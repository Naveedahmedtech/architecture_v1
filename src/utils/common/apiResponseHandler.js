const { logger } = require("../../config/logger/logger.config");
const { statusCodeMap } = require("./statusCodesHandler");

// Function to handle error responses
const createErrorResponse = (req, status, success, message, details) => {
  let errorResponse = {
    path: req.originalUrl,
    error: {
      status,
      code: statusCodeMap[status] || "UNKNOWN_STATUS",
      success,
      message,
    },
  };

  if (details) {
    errorResponse.error.details = details;
  }

  return errorResponse;
};

// Function to handle success responses
const createSuccessResponse = (req, status, success, message, result) => {
  return {
    path: req.originalUrl,
    data: {
      status,
      code: statusCodeMap[status] || "OK",
      success: success,
      message,
      result,
    },
  };
};

const responseHandler = (
  req,
  res,
  status,
  success = null,
  message = null,
  result = null,
  details = null
) => {
  const isError = status >= 400;

  const response = isError
    ? createErrorResponse(req, status, success, message)
    : createSuccessResponse(req, status, success, message, result);

  if (isError) {
    logger.error(`Error response: ${JSON.stringify(response)}`);
  }

  return res.status(status).json(response);
};

module.exports = {
  responseHandler,
};
