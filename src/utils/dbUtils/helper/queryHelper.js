const buildJoinClause = (joins) => {
  return joins
    .map((join) => `JOIN ${join.table} ON ${join.condition}`)
    .join(" ");
};

const buildWhereClause = (filters) => {
  if (!filters || filters.length === 0) return "";
  const filterClauses = filters.map(
    (filter) => `${filter.field} ${filter.operator} ${filter.value}`
  );
  return `WHERE ${filterClauses.join(" AND ")}`;
};

const getSortClause = (sortField, sortOrder) => {
  sortOrder =
    sortOrder &&
    (sortOrder.toLowerCase() === "asc" || sortOrder.toLowerCase() === "desc")
      ? sortOrder.toUpperCase()
      : "ASC";

  return sortField ? ` ORDER BY ${sortField} ${sortOrder}` : "";
};

const getPaginationInfo = (totalRows, page, limit) => {
  return {
    totalItems: totalRows,
    totalPages: Math.ceil(totalRows / limit),
    currentPage: page,
  };
};

const buildAggregateClause = (aggregates) => {
  if (!Array.isArray(aggregates) || aggregates.length === 0) return "";

  return aggregates
    .map((agg) => {
      if (!agg.function || !agg.field || !agg.alias) {
        throw new Error("Invalid aggregate object");
      }
      // Potentially more validations here
      return `${agg.function}(${agg.field}) as ${agg.alias}`;
    })
    .join(", ");
};

const buildGroupByClause = (options) => {
  return options.groupBy ? `GROUP BY ${options.groupBy}` : "";
};

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

module.exports = {
  buildJoinClause,
  buildWhereClause,
  getSortClause,
  getPaginationInfo,
  buildAggregateClause,
  buildGroupByClause,
  insertRecord,
  updateRecord,
  selectQuery,
};
