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
    if (error.code === "NOT_FOUND") {
      return responseHandler(req, res, 404, false, error.message);
    } else {
      console.error("Error fetching records:", error);
      return responseHandler(
        req,
        res,
        500,
        false,
        ERROR_MSGS.INTERNAL_SERVER_ERROR
      );
    }
  }
};
