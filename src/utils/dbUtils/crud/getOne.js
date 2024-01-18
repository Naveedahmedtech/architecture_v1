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
    if (error.code === "NOT_FOUND") {
      return responseHandler(
        req,
        res,
        404,
        false,
        `Record not found in ${tableName}`
      );
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
