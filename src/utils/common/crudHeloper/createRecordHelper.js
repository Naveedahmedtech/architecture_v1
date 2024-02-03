const { logger } = require("../../../config/logger/logger.config");
const { ERROR_MSGS, TABLES } = require("../../../constants/common");
const { createOne } = require("../../dbUtils/crud/createOne");
const { responseHandler } = require("../apiResponseHandler");
const { uploadToCloudinary } = require("../upload");

const buildDataObject = async (req, tableName, fileColumnName) => {
  let data = {};

  // Loop over each property in req.body
  for (const [key, value] of Object.entries(req.body)) {
    // Add each property to the data object
    data[key] = value;
  }

  return data;
};

const createRecord = async (
  req,
  res,
  data,
  tableName,
  returnFields = "*",
  joins = []
) => {
  return await createOne(req, res, {
    tableName,
    data,
    returnFields,
    joins,
  });
};

const sendSuccessResponse = (req, res, message, record) => {
  return responseHandler(req, res, 201, true, message, record);
};

const handleAddError = (req, res, error) => {
  if (error.code === "ALREADY_EXISTS") {
    return responseHandler(req, res, 409, false, error.message);
  }
  if (error.code === "DUPLICATE") {
    logger.error({ code: "duplicate" });
    return responseHandler(req, res, 409, false, error.message);
  }
  if (error.code === "NOT_FOUND") {
    logger.error({
      code: error.code,
      message: error.message,
      detail: error.originalError,
    });
    return responseHandler(
      req,
      res,
      404,
      false,
      error.message,
      null,
      error.originalError
    );
  }
  logger.error({ error: error?.message });
  return responseHandler(
    req,
    res,
    500,
    false,
    ERROR_MSGS.INTERNAL_SERVER_ERROR
  );
};

module.exports = {
  createRecord,
  buildDataObject,
  sendSuccessResponse,
  handleAddError,
};
