const { ERROR_MSGS } = require("../../../constants/common");
const { responseHandler } = require("../../common/apiResponseHandler");
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
      return responseHandler(req, res, 404, false, notFoundMessage);
    }

    const deletedRecords = await deleteRecords(tableName, filters);

    return responseHandler(req, res, 200, true, successMessage, {
      deletedCount: count,
      deletedRecords: deletedRecords,
    });
  } catch (error) {
    switch (error.message) {
      case "DeleteFilterMissing":
        throw new Error("DeleteFilterMissing");
      case "RecordNotFound":
        throw new Error("RecordNotFound");
      case "DB_ERROR":
        throw new Error(ERROR_MSGS.INTERNAL_SERVER_ERROR);
      default:
        console.error("Error deleting record:", error);
        throw new Error(ERROR_MSGS.INTERNAL_SERVER_ERROR);
    }
  }
};
