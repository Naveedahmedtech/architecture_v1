const { CustomError } = require("../../common/customErrorClass");
const { selectQuery } = require("../helper/dbOperations");

exports.getOne = async (
  req,
  res,
  {
    tableName,
    fields = "*",
    joins = [],
    filters = [],
    additionalOptions = {},
    sortField = null,
    sortOrder = "asc",
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

    return records[0];
  } catch (error) {
    if (error.code === "NOT_FOUND") {
      throw new CustomError("NOT_FOUND", error.message, error);
    } else {
      throw error;
    }
  }
};
