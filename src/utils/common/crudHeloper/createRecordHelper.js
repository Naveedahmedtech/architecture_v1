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

  // Handle file upload separately if a file is present in the request
  if (req.file) {
    // Use the fileColumnName variable to set the property name
    data[fileColumnName] = await uploadToCloudinary(req.file.path, tableName);
  }

  return data;
};



const createRecord = async (req, res, data, tableName) => {
  return await createOne(req, res, {
    tableName,
    data,
    returnFields: "*",
  });
};

const sendSuccessResponse = (req, res, message,  record) => {
  return responseHandler(req, res, 201, true, message, record);
};

const handleAddError = (req, res, error) => {
  if (error.code === "DUPLICATE") {
    return responseHandler(req, res, 409, false, error.message);
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
