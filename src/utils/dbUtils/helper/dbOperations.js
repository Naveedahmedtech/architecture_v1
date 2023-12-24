const { buildWhereClause, buildJoinClause, buildGroupByClause, buildAggregateClause, getSortClause } = require("./queryHelper");

const insertRecord = async (tableName, data, pool) => {
  if (!data || Object.keys(data).length === 0) {
    throw new Error("InsertDataMissing");
  }

  const fields = Object.keys(data).join(", ");
  const values = Object.values(data);
  const valuePlaceholders = values
    .map((_, index) => `$${index + 1}`)
    .join(", ");
  const insertQuery = `INSERT INTO ${tableName} (${fields}) VALUES (${valuePlaceholders}) RETURNING id`;

  try {
    const insertResult = await pool.query(insertQuery, values);

    if (insertResult.rowCount === 0) {
      throw new Error("InsertOperationFailed");
    }

    return insertResult.rows[0].id;
  } catch (error) {
    throw new Error("InsertOperationFailed");
  }
};

const updateRecord = async (pool, tableName, data, filters) => {
  if (!data || Object.keys(data).length === 0) {
    throw new Error("UpdateDataMissing");
  }
  if (!filters || filters.length === 0) {
    throw new Error("UpdateFilterMissing");
  }

  const updates = Object.keys(data)
    .map((key, index) => `${key} = $${index + 1}`)
    .join(", ");
  const values = Object.values(data);

  const whereClause = buildWhereClause(filters);
  const updateQuery = `UPDATE ${tableName} SET ${updates} ${whereClause} RETURNING *`;
  const updateResult = await pool.query(updateQuery, values);

  if (updateResult.rowCount === 0) {
    throw new Error("RecordNotFound");
  }

  return updateResult.rows[0];
};

const selectQuery = async (
  pool,
  {
    tableName,
    fields = "*",
    joins = [],
    filters = [],
    sortField,
    sortOrder,
    limit,
    offset,
    aggregates = [],
    groupByOptions = {},
  }
) => {
  try {
    let query = `SELECT ${fields} FROM ${tableName}`;
    const joinClause = buildJoinClause(joins);
    query += ` ${joinClause}`;

    const whereClause = buildWhereClause(filters);
    query += ` ${whereClause}`;

    const groupByClause = buildGroupByClause(groupByOptions);
    query += ` ${groupByClause}`;

    const aggregateClause = buildAggregateClause(aggregates);
    if (aggregateClause) {
      query += `, ${aggregateClause}`;
    }

    if (!sortField) {
      sortField = `${tableName}.id`;
    } else if (joins.length > 0 && sortField === "id") {
      sortField = `${joins[0].table}.id`;
    }

    const sortClause = getSortClause(sortField, sortOrder);

    query += ` ${sortClause}`;

    if (limit) {
      query += ` LIMIT ${limit}`;
    }
    if (offset) {
      query += ` OFFSET ${offset}`;
    }

    const result = await pool.query(query);
    if (result.rows.length === 0) {
      throw new Error("SelectedRecordNotFound");
    }
    return result.rows;
  } catch (error) {
    console.error(`Error executing query: ${error.message}`);
    throw error;
  }
};


const deleteRecords = async (
  pool,
  tableName,
  filters = [],
  returnDeleted = false
) => {
  try {
    let deleteQuery = `DELETE FROM ${tableName}`;

    // Only add WHERE clause if filters are provided
    if (filters.length > 0) {
      const whereClause = buildWhereClause(filters);
      if (!whereClause) {
        throw new Error("DeleteFilterMissing");
      }
      deleteQuery += ` ${whereClause}`;
    }

    if (returnDeleted) {
      deleteQuery += " RETURNING *";
    }

    const result = await pool.query(deleteQuery);
    
    if (filters.length > 0 && result.rowCount === 0) {
      throw new Error("RecordNotFound");
    }

    return returnDeleted ? result.rows : [];
  } catch (error) {
    console.error(`Error deleting records from ${tableName}: ${error.message}`);
    throw error;
  }
};


const countRecords = async (pool, tableName, filters = [], joins = []) => {
  try {
    let query = `SELECT COUNT(*) FROM ${tableName}`;

    const joinClause = joins
      .map((join) => `JOIN ${join.table} ON ${join.condition}`)
      .join(" ");
    if (joinClause) {
      query += ` ${joinClause}`;
    }

    const whereClause = filters
      .map((filter) => `${filter.field} ${filter.operator} ${filter.value}`)
      .join(" AND ");
    if (whereClause) {
      query += ` WHERE ${whereClause}`;
    }

    const result = await pool.query(query);
    return parseInt(result.rows[0].count, 10);
  } catch (error) {
    console.error(`Error counting records in ${tableName}: ${error.message}`);
    throw error;
  }
};

module.exports = {
  insertRecord,
  updateRecord,
  selectQuery,
  countRecords,
  deleteRecords,
};
