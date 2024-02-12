const { ERROR_MSGS, TABLES } = require("../constants/common");
const { responseHandler } = require("../utils/common/apiResponseHandler");
const {
  handleUpdateError,
} = require("../utils/common/crudHeloper/updateRecordHandler");
const { checkRecord } = require("../utils/dbUtils/helper/validationHelper");

const TABLE_NAME = TABLES.API_KEYS;

const verifyApiKey = async (req, res, next) => {
  try {
    const apiKey = req.header("X-API-KEY");
    if (!apiKey) {
      return responseHandler(req, res, 403, false, "API key is required");
    }
    const record = await checkRecord(TABLE_NAME, [
      { field: "key", operator: "=", value: apiKey },
    ]);

    // It's also good to check if record is not null before comparing apiKey
    if (!record || apiKey !== record.key) {
      return responseHandler(req, res, 401, false, "Invalid API key");
    }

    next();
  } catch (error) {
    if (error.code === "NOT_FOUND") {
      return responseHandler(
        req,
        res,
        401,
        false,
        "Invalid API key",
        null,
        "Make sure you have a valid API key"
      );
    } else {
      logger.error({ message: "Internal server error", error: error.message });
      return responseHandler(
        req,
        res,
        500,
        false,
        ERROR_MSGS.INTERNAL_SERVER_ERROR
      );
    }
  }
};


module.exports = {
  verifyApiKey,
};
