const { logger } = require("../../../config/logger/logger.config");
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
    return records[0];
  } catch (error) {
    switch (error.code) {
      case "DUPLICATE":
        throw new CustomError("DUPLICATE", error.message, error);
      default:
        logger.error({ message: "Error creating a new record:", error });
        throw error;
    }
  }
};
