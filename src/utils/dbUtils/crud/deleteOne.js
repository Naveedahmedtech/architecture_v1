const { CustomError } = require("../../common/customErrorClass");
const { deleteRecords } = require("../helper/dbOperations");

exports.deleteOne = async (
  req,
  res,
  {
    tableName,
    filters = [],
  }
) => {
  try {
    const deletedRecords = await deleteRecords(tableName, filters);

    return deletedRecords[0];
  } catch (error) {
    if (error.code === "NOT_FOUND") {
        throw new CustomError("NOT_FOUND", error.message, error);
    } else {
      throw error;
    }
  }
};
