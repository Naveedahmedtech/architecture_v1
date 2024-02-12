const { logger } = require("../../../config/logger/logger.config");
const { CustomError } = require("../../common/customErrorClass");
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

    return records[0];
  } catch (error) {
    switch (error.code) {
      case "DUPLICATE":
        throw new CustomError("DUPLICATE", error.message, error);
      default:
        logger.error({ message: "Error updating a new record:", error });
        throw error;
    }
  }
};
