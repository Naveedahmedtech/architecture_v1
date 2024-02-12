const { CustomError } = require("../../common/customErrorClass");
const { deleteRecords, countRecords } = require("../helper/dbOperations");

exports.deleteAll = async (
  req,
  res,
  {
    tableName,
    filters = [],
  }
) => {
  try {
    const count = await countRecords(tableName, filters);

    const deletedRecords = await deleteRecords(tableName, filters);

    return {
      deletedCount: count,
      deletedRecords: deletedRecords,
    };
  } catch (error) {
    if (error.code === "NOT_FOUND") {
      throw new CustomError("NOT_FOUND", error.message, error);
    } else {
      console.error("Error fetching records:", error);
      throw error;
    }
  }
};
