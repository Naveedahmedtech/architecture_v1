const { logger } = require("../../../config/logger/logger.config");
const { ERROR_MSGS } = require("../../../constants/common");
const { responseHandler } = require("../../common/apiResponseHandler");
const { updateRecord, selectQuery } = require("../helper/dbOperations");

exports.updateOne = async (
  req,
  res,
  {
    tableName,
    data,
    filters = [],
    returnFields = "*",
    joins = [],
    notFoundMessage = "Updated record not found",
    successMessage = "Record updated successfully",
  }
) => {
  try {
    const updatedRecord = await updateRecord(tableName, data, filters);

    const records = await selectQuery({
      tableName: tableName,
      fields: returnFields,
      joins: joins,
      filters: [
        { field: `${tableName}.id`, operator: "=", value: updatedRecord.id },
      ],
    });

    return responseHandler(req, res, 200, true, successMessage, records[0]);
  } catch (error) {
    switch (error.code) {
      case "DUPLICATE":
        logger.error({
          message: "Duplicate entry error",
          error: error.message,
        });
        return responseHandler(req, res, 409, false, error.message);
      default:
        logger.error({ message: "Error updating a new record:", error });
        return responseHandler(req, res, 500, false, "Internal Server Error");
    }
  }
};
