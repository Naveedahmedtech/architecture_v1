const pool = require("../../../config/db/db.connect");
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
    const records = await selectQuery(pool, {
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
      res,
      200,
      true,
      "Record retrieved successfully",
      records[0]
    );
  } catch (error) {
    switch (error.message) {
      case "SelectedRecordNotFound":
        return responseHandler(res, 404, false, "No records found");
      default:
        console.error("Error fetching records:", error);
        return responseHandler(res, 500, false, "Internal Server Error");
    }
  }
};
