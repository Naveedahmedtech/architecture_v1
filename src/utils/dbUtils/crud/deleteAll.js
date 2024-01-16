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
      return responseHandler(res, 404, true, notFoundMessage);
    }

    const deletedRecords = await deleteRecords(tableName, filters, true);

    return responseHandler(res, 200, false, successMessage, {
      deletedCount: count, 
      deletedRecords: deletedRecords,
    });
  } catch (error) {
    switch (error.message) {
      case "DeleteFilterMissing":
        return responseHandler(
          res,
          400,
          true,
          "No valid filter provided for deletion"
        );
      default:
        console.error("Error deleting records:", error);
        return responseHandler(res, 500, true, "Internal Server Error");
    }
  }
};
