const { ERROR_MSGS } = require("../../../constants/common");
const { responseHandler } = require("../../common/apiResponseHandler");
const { CustomError } = require("../../common/customErrorClass");
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

    return deletedRecords[0];
  } catch (error) {
    if (error.code === "NOT_FOUND") {
      throw new CustomError("NOT_FOUND", error.message, error);
    } else {
      console.error("Error fetching records:", error);
      throw error;
    }
  }
};
