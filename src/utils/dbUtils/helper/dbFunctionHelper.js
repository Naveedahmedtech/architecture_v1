const pool = require("../../../config/db/db.connect");
const { logger } = require("../../../config/logger/logger.config");

const getPublicIdsToDelete = async (tableName, column) => {
  try {
    const query = `SELECT ${column}->>'public_id' as public_id FROM ${tableName}`;
    const result = await pool.query(query);
    const publicIds = result.rows
      .map((row) => row.public_id)
      .filter((id) => id != null);

    return publicIds;
  } catch (error) {
    logger.error({ message: "Error fetching public IDs for deletion:", error });
    throw error;
  }
};

module.exports = {
  getPublicIdsToDelete,
};
