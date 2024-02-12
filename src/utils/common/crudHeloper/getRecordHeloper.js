const { getOne } = require("../../dbUtils/crud/getOne");
const { getAll } = require("../../dbUtils/crud/getAll");
const { responseHandler } = require("../apiResponseHandler");
const { logger } = require("../../../config/logger/logger.config");
const { ERROR_MSGS } = require("../../../constants/common");

const getOneRecord = async (
  req,
  res,
  tableName,
  id,
  fields = "*",
  joins = [],
  groupBy = {}
) => {
  return await getOne(req, res, {
    tableName,
    fields,
    joins: joins,
    filters: [
      {
        field: `${tableName}.id`,
        operator: "=",
        value: id,
      },
    ],
    additionalOptions: groupBy,
  });
};
const getAllRecords = async (
  req,
  res,
  tableName,
  fields = "*",
  joins = [],
  groupBy = {},
  filters = []
) => {
  return await getAll(req, res, {
    tableName,
    fields,
    joins: joins,
    filters: filters,
    additionalOptions: groupBy,
  });
};

// type : get one or get all
const handleGetOneError = (req, res, error, tableName, type = "ALL") => {
  if (error.code === "NOT_FOUND") {
    type === "ONE"
      ? responseHandler(
          req,
          res,
          404,
          false,
          `Record not found in ${tableName}`
        )
      : responseHandler(
          req,
          res,
          200,
          true,
          `Record not found in ${tableName}`,
          []
        );
  } else {
    logger.error({ message: "ERROR", error: error.message });
    return responseHandler(
      req,
      res,
      500,
      false,
      ERROR_MSGS.INTERNAL_SERVER_ERROR
    );
  }
};

const handleGetAllError = (module.exports = {
  getOneRecord,
  getAllRecords,
  handleGetOneError,
});
