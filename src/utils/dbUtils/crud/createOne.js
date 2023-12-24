const pool = require("../../../config/db/db.connect");
const { responseHandler } = require("../../common/apiResponseHandler");
const { buildJoinClause, insertRecord, selectQuery } = require("../helper/queryHelper");


exports.createOne = async (
  req,
  res,
  {
    tableName,
    data,
    returnFields = "*",
    joins = [],
    successMessage = "Record created successfully",
    sortField,
    sortOrder,
    aggregates = [],
    groupByOptions = {},
  }
) => {
  try {
    const newRecordId = await insertRecord(tableName, data, pool);

    const records = await selectQuery(pool, {
      tableName: tableName,
      fields: returnFields, 
      joins: joins,
      filters: [
        { field: `${tableName}.id`, operator: "=", value: newRecordId },
      ],
      sortField,
      sortOrder,
      aggregates,
      groupByOptions,
    });

    if (records.length === 0) {
      return responseHandler(res, 404, false, "Newly created record not found");
    }

    return responseHandler(
      res,
      201,
      true,
      successMessage,
      records
    );

  } catch (error) {
    switch (error.message) {
      case "InsertDataMissing":
        return responseHandler(
          res,
          400,
          false,
          "No data provided for the new record"
        );
      case "InsertOperationFailed":
        return responseHandler(
          res,
          400,
          false,
          "Failed to create a new record"
        );
      default:
        console.error("Error creating a new record:", error);
        return responseHandler(res, 500, false, "Internal Server Error");
    }
  }
};
