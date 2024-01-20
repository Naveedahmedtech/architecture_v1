const { getOne } = require("../../dbUtils/crud/getOne");
const { getAll } = require("../../dbUtils/crud/getAll");
const { responseHandler } = require("../apiResponseHandler");
const { logger } = require("../../../config/logger/logger.config");

const getOneRecord = async (req, res, tableName, fields, id, joins = []) => {
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
  });
};
const getAllRecords = async (req, res, tableName, fields, joins = []) => {
  return await getAll(req, res, {
    tableName,
    fields,
    joins: joins,
  });
};

const handleGetOneError = (req, res, error, tableName) => {
  if (error.code === "NOT_FOUND") {
    return responseHandler(
      req,
      res,
      404,
      false,
      `Record not found in ${tableName}`
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

module.exports = {
  getOneRecord,
  getAllRecords,
  handleGetOneError,
};
