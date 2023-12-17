const pool = require("../../../config/db.connect");
const { responseHandler } = require("../../common/apiResponseHandler");
const { buildJoinClause } = require("../helper/queryHelper");

exports.createOne = async (
  req,
  res,
  {
    tableName,
    data,
    returnFields = "*",
    joins = [],
    successMessage = "Record created successfully",
  }
) => {
  try {
    if (!data || Object.keys(data).length === 0) {
      throw new Error("No data provided for the new record");
    }

    const fields = Object.keys(data).join(", ");
    const values = Object.values(data);
    const valuePlaceholders = values
      .map((_, index) => `$${index + 1}`)
      .join(", ");
    const insertQuery = `INSERT INTO ${tableName} (${fields}) VALUES (${valuePlaceholders}) RETURNING id`;
    const insertResult = await pool.query(insertQuery, values);

    if (insertResult.rowCount === 0) {
      return responseHandler(res, 400, false, "Failed to create a new record");
    }

    const joinClause = buildJoinClause(joins);
    const newRecordId = insertResult.rows[0].id;
    const retrieveQuery = `SELECT ${returnFields} FROM ${tableName} ${joinClause} WHERE ${tableName}.id = $1`;
    const retrieveResult = await pool.query(retrieveQuery, [newRecordId]);

    if (retrieveResult.rowCount === 0) {
      return responseHandler(res, 404, false, "Newly created record not found");
    }

    return responseHandler(
      res,
      201,
      true,
      successMessage,
      retrieveResult.rows[0]
    );
  } catch (error) {
    console.error("Error creating a new record:", error);
    return responseHandler(res, 500, false, "Internal Server Error");
  }
};
