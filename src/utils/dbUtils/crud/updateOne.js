const pool = require("../../../config/db.connect");
const { responseHandler } = require("../../common/apiResponseHandler");
const { buildWhereClause, buildJoinClause } = require("../helper/queryHelper");

exports.updateOne = async (
  req,
  res,
  {
    tableName,
    data,
    filters = [],
    returnFields = "json_build_object('id', id) as result", // Customize as needed
    joins = [],
    notFoundMessage = "Record not found",
    successMessage = "Record updated successfully",
  }
) => {
  try {
    if (!data || Object.keys(data).length === 0) {
      throw new Error("No update data provided");
    }

    // Construct SET clause for update
    const updates = Object.keys(data)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(", ");
    const values = Object.values(data);

    // Construct WHERE clause based on filters
    const whereClause = buildWhereClause(filters);
    if (!whereClause) {
      throw new Error("No valid filter provided for update");
    }

    // Execute the UPDATE query
    const updateQuery = `UPDATE ${tableName} SET ${updates} ${whereClause} RETURNING id`;
    const updateResult = await pool.query(updateQuery, values);

    if (updateResult.rowCount === 0) {
      return responseHandler(res, 404, false, notFoundMessage);
    }

    // Retrieve and return the updated record
    const updatedRecordId = updateResult.rows[0].id;
    const joinClause = buildJoinClause(joins);
    const retrieveQuery = `SELECT ${returnFields} FROM ${tableName} ${joinClause} WHERE ${tableName}.id = $1`;
    const retrieveResult = await pool.query(retrieveQuery, [updatedRecordId]);

    if (retrieveResult.rowCount === 0) {
      return responseHandler(res, 404, false, "Updated record not found");
    }

    return responseHandler(
      res,
      200,
      true,
      successMessage,
      retrieveResult.rows[0]
    );
  } catch (error) {
    console.error("Error updating record:", error);
    return responseHandler(res, 500, false, "Internal Server Error");
  }
};
