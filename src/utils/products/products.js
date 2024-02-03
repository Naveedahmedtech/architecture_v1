const { logger } = require("../../config/logger/logger.config");
const { uploadToCloudinary } = require("../common/upload");
const { createOne } = require("../dbUtils/crud/createOne");

const TABLE_NAME = "products";
const SELECTED_TAGS_TABLE = "selected_tags";
const JOIN_TABLE_TAGS = "tags";
const JOIN_TABLE_SUB_CATEGORY = "sub_categories";

const extractProductData = async (req) => {
  const {
    name,
    description,
    price,
    discount,
    is_in_stock,
    sub_category_id,
    tags_ids,
  } = req.body;
  let parsedTagsIds = parseTagsIds(tags_ids);
  const image = req.file ? await uploadImage(req.file) : null;

  return {
    name,
    description,
    price,
    discount,
    is_in_stock,
    sub_category_id,
    image,
    parsedTagsIds,
  };
};

const createProduct = async (req, res, data) => {
  return await createOne(req, res, {
    tableName: TABLE_NAME,
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      discount: data.discount,
      is_in_stock: data.is_in_stock,
      sub_category_id: data.sub_category_id,
      image: data.image,
    },
    returnFields: ` 
    json_build_object(
      'id', ${TABLE_NAME}.id,
      'name', ${TABLE_NAME}.name,
      'description', ${TABLE_NAME}.description,
      'price', ${TABLE_NAME}.price,
      'discount', ${TABLE_NAME}.discount,
      'is_in_stock', ${TABLE_NAME}.is_in_stock,
    'image', ${TABLE_NAME}.image,
    'sub_category_details', json_build_object(
      'id', ${JOIN_TABLE_SUB_CATEGORY}.id,
      'name', ${JOIN_TABLE_SUB_CATEGORY}.name
      ),
      'created_at', ${TABLE_NAME}.created_at,
      'updated_at', ${TABLE_NAME}.updated_at
    ) as product
`,
    joins: [
      {
        table: JOIN_TABLE_SUB_CATEGORY,
        condition: `${TABLE_NAME}.sub_category_id = ${JOIN_TABLE_SUB_CATEGORY}.id`,
      },
    ],
  });
};

const insertTags = async (productData, productId) => {
  let results = [];
  for (const tagId of productData.parsedTagsIds) {
    try {
      const tagData = { tags_id: tagId, product_id: productId };
      const result = await createOne(req, res, {
        tableName: SELECTED_TAGS_TABLE,
        data: tagData,
        returnFields: "*",
      });
      results.push(result);
    } catch (error) {
      logger.error({ error: error.message });
    }
  }
  return results;
};

const parseTagsIds = async (tags_ids) => {
  if (typeof tags_ids === "string") {
    try {
      return JSON.parse(tags_ids);
    } catch {
      return tags_ids.split(",").map(Number);
    }
  }
  return tags_ids;
};

const uploadImage = async (file) => {
  return await uploadToCloudinary(file.path, null, TABLE_NAME);
};

module.exports = {
  extractProductData,
  createProduct,
  insertTags,
  parseTagsIds,
  uploadImage,
};
