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
  const sortField = req.query.sortField || 'id'; 
  const sortOrder = req.query.sortOrder 
  || 'desc';
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

    return responseHandler(
      res,
      200,
      true,
      `${tableName} records retrieved successfully!`,
      {
        paginationInfo: getPaginationInfo(totalRows, page, limit),
        data: records,
      }
    );
  } catch (error) {
    switch (error.message) {
      case "SelectedRecordNotFound":
        return responseHandler(res, 404, false, "No records found");
      default:
        console.error("Error fetching records:", error);
        return responseHandler(res, 500, false, "Internal Server Error");
    }
  }
};
