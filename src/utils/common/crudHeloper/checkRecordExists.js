const { logger } = require("../../../config/logger/logger.config");
const { checkRecord } = require("../../dbUtils/helper/validationHelper");

// checking category record exists ..
const checkRecordExists = async (req, tableName, fieldName) => {
  const id = req.body[fieldName];
  const record = await checkRecord(tableName, [
    { field: "id", operator: "=", value: id },
  ]);

  return record;
};

const checkSubCategoryAndTagsExist = async (
  parseIntIds,
  subCategoryId,
  tagsTable,
  subCategoryTable
) => {
  // checking sub category exists
  const isSubCategoryExists = await checkRecord(subCategoryTable, [
    { field: "id", operator: "=", value: subCategoryId },
  ]);
  // checking tags exists
  let isTagExists = "hello";
  if (parseIntIds) {
    for (const tagId of parseIntIds) {
      isTagExists = await checkRecord(tagsTable, [
        { field: "id", operator: "=", value: tagId },
      ]);
    }
  }

  return { isTagExists, isSubCategoryExists };
};

module.exports = {
  checkRecordExists,
  checkSubCategoryAndTagsExist,
};
