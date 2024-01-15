const pool = require("../../../config/db/db.connect");
const { buildWhereClause, buildJoinClause, buildGroupByClause, buildAggregateClause, getSortClause } = require("./queryHelper");

const insertRecord = async (tableName, data) => {
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
    console.log(error);
    throw new Error("InsertOperationFailed");
  }
};

const updateRecord = async (tableName, data, filters) => {
  try {
    if (!data || Object.keys(data).length === 0) {
      throw new Error("UpdateDataMissing");
    }
    if (!filters || filters.length === 0) {
      throw new Error("UpdateFilterMissing");
    }

    const updates = Object.keys(data)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(", ");
    const dataValues = Object.values(data);

    const { clause: whereClause, values: filterValues } = buildWhereClause(
      filters,
      dataValues.length
    );

    const combinedValues = [...dataValues, ...filterValues];

    const updateQuery = `UPDATE ${tableName} SET ${updates} ${whereClause} RETURNING *`;
    const updateResult = await pool.query(updateQuery, combinedValues);

    if (updateResult.rowCount === 0) {
      throw new Error("RecordNotFound");
    }

    return updateResult.rows[0];
  } catch (error) {
    console.error(`Error updating record in ${tableName}:`, error.message);
    throw new Error("UpdateDatabaseQueryError"); 
  }
};






const selectQuery = async ({
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
}) => {
  try {
    let query = `SELECT ${fields} FROM ${tableName}`;
    const joinClause = buildJoinClause(joins);
    query += ` ${joinClause}`;

    const { clause: whereClause, values: filterValues } =
      buildWhereClause(filters);
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

    // Execute the query with filter values
    const result = await pool.query(query, filterValues);

    return result.rows;
  } catch (error) {
    console.error(`Error executing query: ${error.message}`);
    throw error;
  }
};



const deleteRecords = async (
  tableName,
  filters = [],
  returnDeleted = false
) => {
  try {
    let deleteQuery = `DELETE FROM ${tableName}`;
    let filterValues = [];

    // Only add WHERE clause if filters are provided
    if (filters.length > 0) {
      const { clause: whereClause, values: whereValues } =
        buildWhereClause(filters);
      if (!whereClause) {
        throw new Error("DeleteFilterMissing");
      }
      deleteQuery += ` ${whereClause}`;
      filterValues = whereValues;
    }

    if (returnDeleted) {
      deleteQuery += " RETURNING *";
    }

    // Execute the delete query with filter values
    const result = await pool.query(deleteQuery, filterValues);

    if (filters.length > 0 && result.rowCount === 0) {
      throw new Error("RecordNotFound");
    }

    return returnDeleted ? result.rows : [];
  } catch (error) {
    console.error(`Error deleting records from ${tableName}: ${error.message}`);
    throw error;
  }
};



const countRecords = async (tableName, filters = [], joins = []) => {
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
