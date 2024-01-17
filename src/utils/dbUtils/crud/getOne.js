const { ERROR_MSGS } = require("../../../constants/common");
const { responseHandler } = require("../../common/apiResponseHandler");
const { selectQuery } = require("../helper/dbOperations");

exports.getOne = async (
  req,
  res,
  {
    tableName,
    fields = "*",
    joins = [],
    filters = [],
    sortField = null,
    sortOrder = "asc",
    notFoundMessage = "Record not found",
    additionalOptions = {},
  }
) => {
  try {
    const records = await selectQuery({
      tableName,
      fields,
      joins,
      filters,
      sortField,
      sortOrder,
      limit: 1,
      aggregates: [],
      groupByOptions: additionalOptions,
    });

    return responseHandler(
      req,
      res,
      200,
      true,
      "Record retrieved successfully",
      records[0]
    );
  } catch (error) {
    switch (error.message) {
      case "SelectedRecordNotFound":
        throw new Error("SelectedRecordNotFound");
      case "DB_Error":
        throw new Error(ERROR_MSGS.INTERNAL_SERVER_ERROR);
      default:
        console.error("Error fetching records:", error);
        throw new Error(ERROR_MSGS.INTERNAL_SERVER_ERROR);
    }
  }
};
