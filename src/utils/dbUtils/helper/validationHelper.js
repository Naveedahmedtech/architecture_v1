const pool = require("../../../config/db/db.connect");
const { logger } = require("../../../config/logger/logger.config");
const { CustomError } = require("../../common/customErrorClass");

const checkRecord = async (tableName, filters) => {
  try {
    let queryText = `SELECT * FROM ${tableName}`;
    let queryValues = [];

    if (filters && filters.length > 0) {
      const filterClauses = filters.map((filter, index) => {
        queryValues.push(filter.value);
        return `${filter.field} ${filter.operator} $${index + 1}`;
      });

      queryText += ` WHERE ${filterClauses.join(" AND ")}`;
    }

    const result = await pool.query(queryText, queryValues);

    if (result.rows.length === 0) {
      throw new CustomError(
        "NOT_FOUND",
        `Record not found in ${tableName}`,
        `Please make sure that the record exists in the ${tableName} before proceeding`
      );
    }

    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

const recordExists = async (tableName, filters) => {
  try {
    let queryText = `SELECT EXISTS(SELECT * FROM ${tableName}`;
    let queryValues = [];

    if (Array.isArray(filters) && filters.length > 0) {
      const filterClauses = filters.map((filter, index) => {
        queryValues.push(filter.value);
        return `${filter.field} ${filter.operator} $${index + 1}`;
      });

      queryText += ` WHERE ${filterClauses.join(" AND ")}`;
    }

    queryText += ")";

    const result = await pool.query(queryText, queryValues);
    if (result.rows[0].exists) {
      throw new CustomError(
        "ALREADY_EXISTS",
        `User already exists in ${tableName}`,
        `Please make sure that the record exists in the ${tableName} before proceeding..`
      );
    }
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

module.exports = {
  checkRecord,
  recordExists,
};
