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

const getSortClause = (
  sortField,
  sortOrder,
  defaultSortField,
  validSortFields
) => {
  // Check if sortField is valid and provided, otherwise use default
  sortField =
    sortField && validSortFields?.includes(sortField)
      ? sortField
      : defaultSortField;

  // Check if sortOrder is provided and valid, otherwise default to "ASC"
  sortOrder =
    sortOrder &&
    (sortOrder.toLowerCase() === "asc" || sortOrder.toLowerCase() === "desc")
      ? sortOrder.toUpperCase()
      : "ASC";

  // If no valid sortField is provided, we can return an empty string to skip sorting
  if (!sortField) {
    return "";
  }

  return ` ORDER BY ${sortField} ${sortOrder}`;
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

module.exports = {
  buildJoinClause,
  buildWhereClause,
  getSortClause,
  getPaginationInfo,
  buildAggregateClause,
  buildGroupByClause,
};
