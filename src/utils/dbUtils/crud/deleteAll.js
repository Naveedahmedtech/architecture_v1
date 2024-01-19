const { ERROR_MSGS } = require("../../../constants/common");
const { responseHandler } = require("../../common/apiResponseHandler");
const { CustomError } = require("../../common/customErrorClass");
const { deleteRecords, countRecords } = require("../helper/dbOperations");

exports.deleteAll = async (
  req,
  res,
  {
    tableName,
    filters = [],
    successMessage = "Records deleted successfully",
    notFoundMessage = "No matching records found to delete",
  }
) => {
  try {
    const count = await countRecords(tableName, filters);

    if (count === 0) {
      return responseHandler(req, res, 200, true, "No Records found to delete");
    }

    const deletedRecords = await deleteRecords(tableName, filters);

    return {
      deletedCount: count,
      deletedRecords: deletedRecords,
    };
  } catch (error) {
    if (error.code === "NOT_FOUND") {
      // return responseHandler(req, res, 200, true, "No Records found to delete");
      throw new CustomError("NOT_FOUND", "No Records found to delete");
    } else {
      console.error("Error fetching records:", error);
      throw error;
    }
  }
};
