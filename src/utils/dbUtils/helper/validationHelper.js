const pool = require("../../../config/db/db.connect");

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
      throw new Error("RecordNotFound");
    }

    return result.rows[0];
  } catch (error) {
    console.error(`Error checking record in ${tableName}:`, error.message);
    throw error;
  }
};


const recordExists = async (tableName, filters) => {
  try {
    let queryText = `SELECT EXISTS(SELECT 1 FROM ${tableName}`;
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
    return result.rows[0].exists;
  } catch (error) {
    console.error(
      `Error executing exists check in ${tableName}:`,
      error.message
    );
    throw new Error("DatabaseQueryError");
  }
}; 



module.exports = {
  checkRecord,
  recordExists
};
