const { TABLES } = require("../../../../constants/common");
const {
  responseHandler,
} = require("../../../../utils/common/apiResponseHandler");
const {
  buildDataObject,
  createRecord,
  handleAddError,
  sendSuccessResponse,
} = require("../../../../utils/common/crudHeloper/createRecordHelper");
const {
  deleteRecord,
  handleDeleteError,
  deleteALlRecord,
} = require("../../../../utils/common/crudHeloper/deleteRecordHelper");
const {
  handleGetOneError,
  getOneRecord,
  getAllRecords,
} = require("../../../../utils/common/crudHeloper/getRecordHeloper");
const {
  buildUpdateDataObject,
  handleUpdateError,
  updateRecord,
  sendUpdateSuccessResponse,
} = require("../../../../utils/common/crudHeloper/updateRecordHandler");
const {
  checkRecord,
} = require("../../../../utils/dbUtils/helper/validationHelper");

const TABLE_NAME = TABLES.API_KEYS;
exports.add = async (req, res) => {
  try {
    const data = await buildDataObject(req, TABLE_NAME);
    const createdRecord = await createRecord(req, res, data, TABLE_NAME);
    return sendSuccessResponse(
      req,
      res,
      "created record successfully",
      createdRecord
    );
  } catch (error) {
    handleAddError(req, res, error);
  }
};

exports.update = async (req, res) => {
  try {
    const { data, id } = await buildUpdateDataObject(req);
    if (id) {
       await checkRecord(TABLE_NAME, [
        { field: "id", operator: "=", value: id },
      ]);
      const updatedRecord = await updateRecord(req, res, data, id, TABLE_NAME);
      return sendUpdateSuccessResponse(
        req,
        res,
        "Record updated successfully",
        updatedRecord
      );
    }
  } catch (error) {
    handleUpdateError(req, res, error, TABLE_NAME);
  }
};

exports.get = async (req, res) => {
  const id = parseInt(req.params.id, 10);

  try {
    const result = await getOneRecord(req, res, TABLE_NAME, id);
    return sendUpdateSuccessResponse(
      req,
      res,
      "Record retrieve successfully",
      result
    );
  } catch (error) {
    handleGetOneError(req, res, error, TABLE_NAME, "ONE");
  }
};

exports.getAll = async (req, res) => {
  let result;
  try {
    result = await getAllRecords(req, res, TABLE_NAME, "*");
    return sendUpdateSuccessResponse(req, res, "Record retrieve successfully", {
      pagination: result?.paginationInfo,
      data: result?.data,
    });
  } catch (error) {
    handleGetOneError(req, res, error, TABLE_NAME, "*");
  }
};

exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedRecord = await deleteRecord(req, res, TABLE_NAME, id);
    return sendUpdateSuccessResponse(
      req,
      res,
      "Record deleted successfully",
      deletedRecord
    );
  } catch (error) {
    handleDeleteError(req, res, error, TABLE_NAME, "*");
  }
};

exports.deleteAll = async (req, res) => {
  try {
    const result = await deleteALlRecord(req, res, TABLE_NAME);
    return responseHandler(req, res, 200, true, "Record Delete Successfully", {
      deletedCount: result.deletedCount,
      deletedRecords: result.deletedRecords,
    });
  } catch (error) {
    handleDeleteError(req, res, error, TABLE_NAME, "*");
  }
};
