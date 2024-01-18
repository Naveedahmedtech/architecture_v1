const { logger } = require("../../../config/logger/logger.config");
const { responseHandler } = require("../../common/apiResponseHandler");
const { CustomError } = require("../../common/customErrorClass");
const { insertRecord, selectQuery } = require("../helper/dbOperations");

exports.createOne = async (
  req,
  res,
  {
    tableName,
    data,
    returnFields = "*",
    excludeFields = [],
    joins = [],
    successMessage = "Record created successfully",
    sortField,
    sortOrder,
    aggregates = [],
    groupByOptions = {},
  }
) => {
  try {
    const newRecordId = await insertRecord(tableName, data);

    const records = await selectQuery({
      tableName: tableName,
      fields: returnFields,
      joins: joins,
      filters: [
        { field: `${tableName}.id`, operator: "=", value: newRecordId },
      ],
      sortField,
      sortOrder,
      aggregates,
      groupByOptions,
      excludeFields,
    });

    return responseHandler(req, res, 201, true, successMessage, records);
  } catch (error) {
    switch (error.code) {
      case "DUPLICATE":
        logger.error({
          message: "Duplicate entry error",
          error: error.message,
        });
        return responseHandler(req, res, 409, false, error.message);
      case "InsertDataMissing":
        logger.error({
          message: "Inserting Data missing:",
          error: error.message,
        });
        return responseHandler(req, res, 400, false, error.message);
      case "DB_ERROR":
        logger.error({
          message: "Failed to insert the record",
          error: error.message,
        });
        return responseHandler(req, res, 400, false, error.message);
      default:
        logger.error({ message: "Error creating a new record:", error });
        return responseHandler(req, res, 500, false, "Internal Server Error");
    }
  }
};
