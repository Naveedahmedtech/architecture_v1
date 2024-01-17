const { ERROR_MSGS } = require("../../../constants/common");
const { responseHandler } = require("../../common/apiResponseHandler");
const { deleteRecords } = require("../helper/dbOperations");

exports.deleteOne = async (
  req,
  res,
  {
    tableName,
    filters = [],
    successMessage = "Record deleted successfully",
    notFoundMessage = "Record not found",
  }
) => {
  try {
    const deletedRecords = await deleteRecords(tableName, filters);

    return responseHandler(req, res, 200, true, successMessage, {
      deletedRecord: deletedRecords[0],
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
