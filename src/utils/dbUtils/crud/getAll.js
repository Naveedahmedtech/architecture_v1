const { ERROR_MSGS } = require("../../../constants/common");
const { responseHandler } = require("../../common/apiResponseHandler");
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
  let paginationInfo;
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

    const totalRows = await countRecords(tableName, filters, joins);
    const totalPages = Math.ceil(totalRows / limit);
    const hasNextPage = page < totalPages;

    paginationInfo = getPaginationInfo(totalRows, page, limit);
    paginationInfo.hasNextPage = hasNextPage;

    // return responseHandler(
    //   req,
    //   res,
    //   200,
    //   true,
    //   `${tableName} records retrieved successfully!`,
    //   {
    //     paginationInfo,
    //     data: records,
    //   }
    // );
    return {
      paginationInfo,
      data: records,
    };
  } catch (error) {
    if (error.code === "NOT_FOUND") {
      // return responseHandler(req, res, 200, true, ERROR_MSGS.RECORD_NOT_FOUND, {
      //   paginationInfo,
      //   data: [],
      // });
      throw new CustomError("NOT_FOUND", error.message, error);
    } else {
      console.error("Error fetching records:", error);
      throw error;
    }
  }
};
