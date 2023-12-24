const pool = require("../../../config/db/db.connect");
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
    const deletedRecords = await deleteRecords(pool, tableName, filters, true);

    return responseHandler(res, 200, true, successMessage, {
      deletedRecord: deletedRecords[0],
    });
  } catch (error) {
    switch (error.message) {
      case "DeleteFilterMissing":
        return responseHandler(
          res,
          400,
          false,
          "No valid filter provided for deletion"
        );
      case "RecordNotFound":
        return responseHandler(res, 404, false, notFoundMessage);
      default:
        console.error("Error deleting record:", error);
        return responseHandler(res, 500, false, "Internal Server Error");
    }
  }
};
