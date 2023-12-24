const pool = require("../../../config/db/db.connect");
const { responseHandler } = require("../../common/apiResponseHandler");
const {
  buildJoinClause,
  buildWhereClause,
  getSortClause,
  buildGroupByClause,
} = require("../helper/queryHelper");

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
    const selectedFields =
      typeof fields === "string" ? fields : fields.join(", ");
    const joinClause = buildJoinClause(joins);
    const whereClause = buildWhereClause(filters);
    const sortClause = sortField ? getSortClause(sortField, sortOrder, "") : "";

    const groupByClause = buildGroupByClause(additionalOptions);

    const finalQuery = `SELECT ${selectedFields} FROM ${tableName} ${joinClause} ${whereClause} ${sortClause} LIMIT 1`;
    console.log(finalQuery); // Debugging

    const result = await pool.query(finalQuery);

    if (result.rowCount === 0) {
      return responseHandler(res, 404, false, notFoundMessage);
    }

    return responseHandler(
      res,
      200,
      true,
      "Record retrieved successfully",
      result.rows[0]
    );
  } catch (error) {
    console.error("Error retrieving record:", error);
    return responseHandler(res, 500, false, "Internal Server Error");
  }
};
