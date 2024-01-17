const { ERROR_MSGS } = require("../../../constants/common");
const { responseHandler } = require("../../common/apiResponseHandler");
const { updateRecord, selectQuery } = require("../helper/dbOperations");

exports.updateOne = async (
  req,
  res,
  {
    tableName,
    data,
    filters = [],
    returnFields = "*",
    joins = [],
    notFoundMessage = "Updated record not found",
    successMessage = "Record updated successfully",
  }
) => {
  try {
    const updatedRecord = await updateRecord(tableName, data, filters);

    const records = await selectQuery({
      tableName: tableName,
      fields: returnFields,
      joins: joins,
      filters: [
        { field: `${tableName}.id`, operator: "=", value: updatedRecord.id },
      ],
    });

    // if (records.length === 0) {
    //   return responseHandler(req, res, 404, false, notFoundMessage);
    // }

    return responseHandler(req, res, 200, true, successMessage, records[0]);
  } catch (error) {
    switch (error.message) {
      case "RecordNotFound":
        throw new Error("RecordNotFound");
      case "SelectedRecordNotFound":
        throw new Error("SelectedRecordNotFound");
      case "UpdateDataMissing":
        throw new Error("UpdateDataMissing");
      case "UpdateFilterMissing":
        throw new Error("UpdateFilterMissing");

      case "UpdateDatabaseQueryError":
        throw new Error("UpdateDatabaseQueryError");
      default:
        throw new Error(ERROR_MSGS.INTERNAL_SERVER_ERROR);
    }
  }
};
