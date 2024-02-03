const { logger } = require("../../../config/logger/logger.config");
const { CustomError } = require("../../common/customErrorClass");
const { getPaginationInfo } = require("../../common/pagination");
const { selectQuery, countRecords } = require("../helper/dbOperations");

exports.getAll = async (
  req,
  res,
  {
    tableName,
    fields = "*",
    aggregates = [],
    joins = [],
    filters = [],
    additionalOptions = {},
  }
) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = (page - 1) * limit;
  const sortField = req.query.sortField || "id";
  const sortOrder = req.query.sortOrder || "desc";
  try {
    const records = await selectQuery({
      tableName,
      fields,
      joins,
      filters,
      sortField,
      sortOrder,
      limit,
      offset,
      aggregates,
      groupByOptions: additionalOptions,
    });

    const displayedItemsCount = records?.length;

    const totalRows = await countRecords(tableName, filters, joins);
    const totalPages = Math.ceil(totalRows / limit);
    const hasNextPage = page < totalPages;

    const paginationInfo = getPaginationInfo(
      totalRows,
      page,
      limit,
      displayedItemsCount
    );
    paginationInfo.hasNextPage = hasNextPage;

    return {
      paginationInfo,
      data: records,
    };
  } catch (error) {
    if (error.code === "NOT_FOUND") {
      throw new CustomError("NOT_FOUND", error.message, error);
    } else {
      throw error;
    }
  }
};
