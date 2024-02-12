const pool = require("../../../config/db/db.connect");
const { logger } = require("../../../config/logger/logger.config");
const { CustomError } = require("../../common/customErrorClass");
const {
  buildWhereClause,
  buildJoinClause,
  buildGroupByClause,
  buildAggregateClause,
  getSortClause,
} = require("./queryHelper");

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
    return insertResult.rows[0].id;
  } catch (error) {
    if (error.code === "23505") {
      const fieldNameMatch = /Key \(([^)]+)\)=/.exec(error.detail);
      const fieldName = fieldNameMatch ? fieldNameMatch[1] : "unknown field";
      const errorMessage = `${fieldName} already exists in ${tableName}.`;

      throw new CustomError("DUPLICATE", errorMessage, error);
    }
    logger.error(error);
    throw error;
  }
};

const updateRecord = async (tableName, data, filters) => {
  try {
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

    return updateResult.rows[0];
  } catch (error) {
    if (error.code === "23505") {
      const fieldNameMatch = /Key \(([^)]+)\)=/.exec(error.detail);
      const fieldName = fieldNameMatch ? fieldNameMatch[1] : "unknown field";
      const errorMessage = `${fieldName} already exists in ${tableName}.`;

      throw new CustomError("DUPLICATE", errorMessage, error);
    }
    logger.error(error);
    throw error;
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
    }
    // else if (joins.length > 0 && sortField === "id") {
    //   sortField = `${joins[0].table}.id`;
    // }

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


    if (result.rowCount === 0) {
      throw new CustomError("NOT_FOUND", `Record not found in ${tableName}`);
    }

    return result.rows;
  } catch (error) {
    throw error;
  }
};

const deleteRecords = async (tableName, filters = [], returnDeleted = true) => {
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
      throw new CustomError("NOT_FOUND", `Record not found in ${tableName}`);
    }

    return returnDeleted ? result.rows : [];
  } catch (error) {
    throw error;
  }
};

const countRecords = async (tableName, filters = [], joins = []) => {
  try {
    let query = `SELECT COUNT(*) FROM ${tableName}`;
    const filterValues = [];
    const joinClause = joins
      .map((join) => `JOIN ${join.table} ON ${join.condition}`)
      .join(" ");

    if (joinClause) {
      query += ` ${joinClause}`;
    }

    const whereClause = filters
      .map((filter, index) => {
        filterValues.push(filter.value);
        return `${filter.field} ${filter.operator} $${index + 1}`;
      })
      .join(" AND ");

    if (whereClause) {
      query += ` WHERE ${whereClause}`;
    }


    const result = await pool.query(query, filterValues);
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
