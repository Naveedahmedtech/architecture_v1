const pool = require("../../../config/db/db.connect");

const checkRecord = async (table, field, value) => {
  try {
    const queryText = `SELECT * FROM ${table} WHERE ${field} = $1`;
    const queryValues = [value];
    const result = await pool.query(queryText, queryValues);

    if (result.rows.length === 0) {
      throw new Error("RecordNotFound");
    }

    return result.rows[0];
  } catch (error) {
    console.error(`Error checking record in ${table}:`, error.message);
    throw error;
  }
};

module.exports = checkRecord;
