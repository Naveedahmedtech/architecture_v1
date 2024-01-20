const { logger } = require("../../../config/logger/logger.config");
const { ERROR_MSGS } = require("../../../constants/common");
const { deleteAll } = require("../../dbUtils/crud/deleteAll");
const { deleteOne } = require("../../dbUtils/crud/deleteOne");
const {
  getPublicIdsToDelete,
} = require("../../dbUtils/helper/dbFunctionHelper");
const { checkRecord } = require("../../dbUtils/helper/validationHelper");
const { responseHandler } = require("../apiResponseHandler");
const { deleteFromCloudinary } = require("../upload");

const deleteCloudImage = async (tableName, id) => {
  const record = await checkRecord(tableName, [
    { field: "id", operator: "=", value: id },
  ]);
  const image = await record.image;
  if (image) {
    const publicId = image.public_id;
    await deleteFromCloudinary(publicId);
    logger.info("eleted successfully!");
  }
};

const deleteAllCloudImages = async (tableName, columnName) => {
  const publicIds = await getPublicIdsToDelete(tableName, columnName);
  if (publicIds.length > 0) {
    const deletionPromises = publicIds.map(
      async (publicId) => await deleteFromCloudinary(publicId)
    );
    await Promise.all(deletionPromises);
  }
};

const deleteRecord = async (req, res, tableName, id) => {
  return await deleteOne(req, res, {
    tableName,
    filters: [
      {
        field: "id",
        operator: "=",
        value: id,
      },
    ],
  });
};

const deleteALlRecord = async (req, res, tableName, filters = []) => {
  return await deleteAll(req, res, {
    tableName,
    filters,
  });
};

const handleDeleteError = (req, res, error, tableName) => {
  if (error.code === "NOT_FOUND") {
    return responseHandler(
      req,
      res,
      404,
      false,
      `Record not found in ${tableName}`
    );
  } else {
    logger.error({ message: "ERROR", error: error.message });
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
  deleteCloudImage,
  deleteRecord,
  handleDeleteError,
  deleteAllCloudImages,
  deleteALlRecord,
};
