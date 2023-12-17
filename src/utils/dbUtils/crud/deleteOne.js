const pool = require("../../../config/db.connect");
const { responseHandler } = require("../../common/apiResponseHandler");
const { buildWhereClause } = require("../helper/queryHelper");

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
    // Construct WHERE clause based on filters
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
      deletedRecord: result.rows[0],
    });
  } catch (error) {
    console.error("Error deleting record:", error);
    return responseHandler(res, 500, false, "Internal Server Error");
  }
};
