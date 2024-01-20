const { logger } = require("../../../config/logger/logger.config");
const { ERROR_MSGS, TABLES } = require("../../../constants/common");
const { updateOne } = require("../../dbUtils/crud/updateOne");
const { responseHandler } = require("../apiResponseHandler");
const { CustomError } = require("../customErrorClass");
const { uploadToCloudinary, updateOnCloudinary } = require("../upload");

const buildUpdateDataObject = async (req) => {
  const { id, ...otherFields } = req.body;
  let data = {};

  for (const [key, value] of Object.entries(otherFields)) {
    if (value != null) {
      data[key] = value;
    }
  }

  if (Object.keys(data).length === 0) {
    logger.error({
      message: "NOT_MODIFIED entry error",
      error: "No such entry",
    });
    throw new CustomError(
      "NOT_MODIFIED",
      "No data provided",
      "Nothing provided to update the data"
    );
  }

  return { id, data };
};



const uploadImage = async (record, file, data, tableName, fileColumnName) => {
  const icon = record[fileColumnName]; // Use bracket notation
  logger.info({ message: "Checking existing record", record: record });

  if (record && file) {
    if (!icon) {
      logger.info("Uploading icon");
      const uploadedImage = await uploadToCloudinary(file.path, tableName);
      data[fileColumnName] = uploadedImage; // Use bracket notation
    } else {
      logger.info("Updating icon");
      const publicId = icon.public_id;
      const updatedImage = await updateOnCloudinary(file.path, publicId);
      data[fileColumnName] = updatedImage; // Use bracket notation
    }
  }
};


const updateRecord = async (req, res, data, id, tableName) => {
  return await updateOne(req, res, {
    tableName,
    data,
    filters: [{ field: "id", operator: "=", value: id }],
    returnFields: "*",
  });
};

const sendUpdateSuccessResponse = (req, res, message, record) => {
  return responseHandler(
    req,
    res,
    200,
    true,
    message,
    record
  );
};

const handleUpdateError = (req, res, error, tableName) => {
  if (error.code === "NOT_FOUND") {
    return responseHandler(
      req,
      res,
      404,
      false,
      `Record not found in ${tableName}`
    );
  }
  if (error instanceof CustomError && error.code === "NOT_MODIFIED") {
    return responseHandler(
      req,
      res,
      200,
      true,
      error.message,
      error.originalError
    );
  }
  if (error.code === "DUPLICATE") {
    return responseHandler(req, res, 409, false, error.message);
  } else {
    logger.error({ message: "Internal server error", error: error.code });
    return responseHandler(
      req,
      res,
      500,
      false,
      ERROR_MSGS.INTERNAL_SERVER_ERROR
    );
  }
};

module.exports = {
  buildUpdateDataObject,
  updateRecord,
  sendUpdateSuccessResponse,
  handleUpdateError,
  uploadImage,
};
