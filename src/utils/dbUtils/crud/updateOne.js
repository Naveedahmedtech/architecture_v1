const pool = require("../../../config/db/db.connect");
const { responseHandler } = require("../../common/apiResponseHandler");
const { updateRecord, selectQuery } = require("../helper/dbOperations");

exports.updateOne = async (
  req,
  res,
  {
    tableName,
    data,
    filters = [],
    returnFields = "json_build_object('id', id) as result",
    joins = [],
    notFoundMessage = "Record not found",
    successMessage = "Record updated successfully",
  }
) => {
  try {
    const updatedRecord = await updateRecord(pool, tableName, data, filters);

    const records = await selectQuery(pool, {
      tableName: tableName,
      fields: returnFields,
      joins: joins,
      filters: [
        { field: `${tableName}.id`, operator: "=", value: updatedRecord.id },
      ],
    });

    if (records.length === 0) {
      return responseHandler(res, 404, false, "Updated record not found");
    }

    return responseHandler(res, 200, true, successMessage, records[0]);
  } catch (error) {
    switch (error.message) {
      case "RecordNotFound":
        return responseHandler(res, 404, false, "Record not found");
      case "SelectedRecordNotFound":
        return responseHandler(res, 404, false, "Selected Record not found");
      case "UpdateDataMissing":
        return responseHandler(res, 400, false, "No update data provided");
      case "UpdateFilterMissing":
        return responseHandler(
          res,
          400,
          false,
          "No valid filter provided for update"
        );
      default:
        console.error("Error updating record:", error);
        return responseHandler(res, 500, false, "Internal Server Error");
    }
  }
};
