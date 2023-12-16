const pool = require("../../config/db.connect");
const { responseHandler } = require("../common/apiResponseHandler");
const {
  buildJoinClause,
  buildWhereClause,
  getSortClause,
  getPaginationInfo,
  buildAggregateClause,
  buildGroupByClause,
} = require("./helper/queryHelper");



exports.getAll = async (
  req,
  res,
  {
    tableName,
    fields = "*",
    aggregates = [],
    joins = [],
    filters = [],
    defaultSortField = "id",
    additionalOptions = {},
  }
) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const sortField = req.query.sortField || defaultSortField;
  const sortOrder = req.query.sortOrder || "desc";

  // Ensure selectedFields is always an array
  let selectedFields = req.query.fields ? req.query.fields.split(",") : fields;
  if (typeof fields === "string") {
    selectedFields = fields.split(",");
  }

  const aggregateClause = buildAggregateClause(aggregates);

  try {
    const joinClause = buildJoinClause(joins);
    const whereClause = buildWhereClause(filters);
    const sortClause = getSortClause(sortField, sortOrder, defaultSortField);
    const groupByClause = buildGroupByClause(additionalOptions);

    const baseFields =
      selectedFields.join(", ") +
      (aggregateClause ? `, ${aggregateClause}` : "");
    const baseQuery = `SELECT ${baseFields} FROM ${tableName} ${joinClause} ${whereClause} ${groupByClause} ${sortClause}`;
    const countQuery = `SELECT COUNT(*) FROM ${tableName} ${joinClause} ${whereClause}`;

    const totalResult = await pool.query(countQuery);
    const totalRows = parseInt(totalResult.rows[0].count, 10);
    
    let finalQuery = baseQuery;
    console.log(finalQuery); // Log the final query for debugging
    let queryParams = [];
    if (page > 0 && limit > 0) {
      finalQuery += ` LIMIT $1 OFFSET $2`;
      queryParams = [limit, (page - 1) * limit];
    }

    const result = await pool.query(finalQuery, queryParams);

    if (result.rowCount === 0) {
      return responseHandler(res, 404, false, "No records found");
    }

    return responseHandler(
      res,
      200,
      true,
      `${tableName} records retrieved successfully!`,
      {
        paginationInfo: getPaginationInfo(totalRows, page, limit),
        data: result.rows,
      }
    );
  } catch (error) {
    console.error(error);
    return responseHandler(res, 500, false, "Internal Server Error");
  }
};
