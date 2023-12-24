const pool = require("../../../config/db/db.connect");
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
    const count = await countRecords(pool, tableName, filters);

    if (count === 0) {
      return responseHandler(res, 404, false, notFoundMessage);
    }

    const deletedRecords = await deleteRecords(pool, tableName, filters, true);

    return responseHandler(res, 200, true, successMessage, {
      deletedCount: count, 
      deletedRecords: deletedRecords,
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
      default:
        console.error("Error deleting records:", error);
        return responseHandler(res, 500, false, "Internal Server Error");
    }
  }
};
