const pool = require("../../../config/db/db.connect");
const { responseHandler } = require("../../common/apiResponseHandler");
const { buildWhereClause } = require("../helper/queryHelper");

exports.deleteAll = async (
  req,
  res,
  {
    tableName,
    filters = [],
    successMessage = "Records deleted successfully",
    notFoundMessage = "No matching records found to delete",
  }
) => {
  try {
    const whereClause = buildWhereClause(filters);

    if (!whereClause) {
      throw new Error("No valid filter provided for deletion");
    }

    const deleteQuery = `DELETE FROM ${tableName} ${whereClause} RETURNING *`;

    const result = await pool.query(deleteQuery);

    if (result.rowCount === 0) {
      return responseHandler(res, 404, false, notFoundMessage);
    }

    return responseHandler(res, 200, true, successMessage, {
      deletedRecords: result.rows,
      count: result.rowCount,
    });
  } catch (error) {
    console.error("Error deleting records:", error);
    return responseHandler(res, 500, false, "Internal Server Error");
  }
};
