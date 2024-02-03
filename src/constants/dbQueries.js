const { logger } = require("../config/logger/logger.config");
const { TABLES } = require("./common");

// constant tables
const CATEGORY = TABLES.CATEGORY;
const SUB_CATEGORY = TABLES.SUB_CATEGORY;
const TAGS = TABLES.TAGS;
const PRODUCTS = TABLES.PRODUCTS;
const SELECTED_TAGS = TABLES.SELECTED_TAGS;
const DEAL_CATEGORY = TABLES.DEAL_CATEGORY;
const DEALS = TABLES.DEALS;
const PRODUCTS_HISTORY = TABLES.PRODUCTS_HISTORY;
const DEALS_HISTORY = TABLES.DEALS_HISTORY;

const SUB_CATEGORY_QUERY = {
  returnFields: ` 
      ${SUB_CATEGORY}.id,
      ${SUB_CATEGORY}.name,
    ${SUB_CATEGORY}.image,
    json_build_object(
      'id', ${CATEGORY}.id,
      'name', ${CATEGORY}.name
      ) as category_details,
      ${SUB_CATEGORY}.created_at,
      ${SUB_CATEGORY}.updated_at
`,
  joins: [
    {
      table: CATEGORY,
      condition: `${SUB_CATEGORY}.category_id = ${CATEGORY}.id`,
    },
  ],
};

const PRODUCT_QUERY = {
  tagReturnFields: `
    ${SELECTED_TAGS}.id,
    json_build_object(
      'id', ${TAGS}.id,
      'name', ${TAGS}.name,
      'color_code', ${TAGS}.color_code,
      'color_name', ${TAGS}.color_name
    ) as tag_details,
    ${SELECTED_TAGS}.created_at,
    ${SELECTED_TAGS}.updated_at
`,
  tagJoins: [
    {
      table: TAGS,
      condition: `${SELECTED_TAGS}.tags_id = ${TAGS}.id`,
    },
  ],
  productReturnFields: ` 
    ${PRODUCTS}.id,
    ${PRODUCTS}.name,
    ${PRODUCTS}.description,
    ${PRODUCTS}.price,
    ${PRODUCTS}.discount,
    ${PRODUCTS}.is_in_stock,
    ${PRODUCTS}.image,
    json_build_object(
      'id', ${SUB_CATEGORY}.id,
      'name', ${SUB_CATEGORY}.name
    ) as sub_category_details,
    ${PRODUCTS}.created_at,
    ${PRODUCTS}.updated_at
  `,
  productJoins: [
    {
      table: SUB_CATEGORY,
      condition: `${PRODUCTS}.sub_category_id = ${SUB_CATEGORY}.id`,
    },
  ],
  getProductReturnFields: `
  ${PRODUCTS}.id AS id,
  ${PRODUCTS}.name AS name,
  ${PRODUCTS}.description AS description,
  ${PRODUCTS}.price AS price,
  ${PRODUCTS}.discount AS discount,
  ${PRODUCTS}.image AS image,
  ${PRODUCTS}.is_in_stock AS is_in_stock,
  json_build_object(
    'id', ${SUB_CATEGORY}.id,
    'name', ${SUB_CATEGORY}.name
  ) as sub_category_details,
  ${PRODUCTS}.created_at AS created_at,
  ${PRODUCTS}.updated_at AS updated_at,
  json_agg(
    json_build_object(
      'id', ${SELECTED_TAGS}.id,
      'product_id', ${SELECTED_TAGS}.product_id,
      'deal_id', ${SELECTED_TAGS}.deal_id,
      'tag_details', json_build_object(
        'id', ${TAGS}.id,
        'name', ${TAGS}.name,
        'color_code', ${TAGS}.color_code,
        'color_name', ${TAGS}.color_name
      ),
      'created_at', ${SELECTED_TAGS}.created_at,
      'updated_at', ${SELECTED_TAGS}.updated_at
    )
  ) FILTER (WHERE ${SELECTED_TAGS}.id IS NOT NULL) as selected_tags
  `,
  getProductJoins: [
    {
      table: SUB_CATEGORY,
      condition: `${PRODUCTS}.sub_category_id = ${SUB_CATEGORY}.id`,
    },
    {
      table: SELECTED_TAGS,
      condition: `${PRODUCTS}.id = ${SELECTED_TAGS}.product_id`,
      type: "LEFT JOIN",
    },
    {
      table: TAGS,
      condition: `${SELECTED_TAGS}.tags_id = ${TAGS}.id`,
      type: "LEFT JOIN",
    },
  ],
  groupBy: {
    groupBy: `${PRODUCTS}.id, ${PRODUCTS}.name, ${PRODUCTS}.description, ${PRODUCTS}.price, ${PRODUCTS}.discount, ${PRODUCTS}.image, ${PRODUCTS}.is_in_stock, ${PRODUCTS}.created_at, ${PRODUCTS}.updated_at, ${SUB_CATEGORY}.id, ${SUB_CATEGORY}.name
  `,
  },
};

const DEAL_QUERY = {
  tagReturnFields: `
    ${SELECTED_TAGS}.id,
    ${SELECTED_TAGS}.deal_id,
    json_build_object(
      'id', ${TAGS}.id,
      'name', ${TAGS}.name,
      'color_code', ${TAGS}.color_code,
      'color_name', ${TAGS}.color_name
    ) as tag_details,
    ${SELECTED_TAGS}.created_at,
    ${SELECTED_TAGS}.updated_at
`,
  tagJoins: [
    {
      table: TAGS,
      condition: `${SELECTED_TAGS}.tags_id = ${TAGS}.id`,
    },
  ],
  productReturnFields: ` 
    ${DEALS}.id,
    ${DEALS}.name,
    ${DEALS}.description,
    ${DEALS}.price,
    ${DEALS}.discount,
    ${DEALS}.is_in_stock,
    ${DEALS}.image,
    json_build_object(
      'id', ${DEAL_CATEGORY}.id,
      'name', ${DEAL_CATEGORY}.name
    ) as deal_category_details,
    ${DEALS}.created_at,
    ${DEALS}.updated_at
  `,
  productJoins: [
    {
      table: DEAL_CATEGORY,
      condition: `${DEALS}.deal_category_id = ${DEAL_CATEGORY}.id`,
    },
  ],
  getProductReturnFields: `
  ${DEALS}.id,
  ${DEALS}.name,
  ${DEALS}.description,
  ${DEALS}.price,
  ${DEALS}.discount,
  ${DEALS}.image,
  ${DEALS}.is_in_stock,
  json_build_object(
    'id', ${DEAL_CATEGORY}.id,
    'name', ${DEAL_CATEGORY}.name
  ) as deal_category_details,
  ${DEALS}.created_at,
  ${DEALS}.updated_at,
  COALESCE(json_agg(
    json_build_object(
      'id', ${SELECTED_TAGS}.id,
      'product_id', ${SELECTED_TAGS}.product_id,
      'deal_id', ${SELECTED_TAGS}.deal_id,
      'tag_details', json_build_object(
        'id', ${TAGS}.id,
        'name', ${TAGS}.name,
        'color_code', ${TAGS}.color_code,
        'color_name', ${TAGS}.color_name
      ),
      'created_at', ${SELECTED_TAGS}.created_at,
      'updated_at', ${SELECTED_TAGS}.updated_at
    )
  ) FILTER (WHERE ${SELECTED_TAGS}.id IS NOT NULL), '[]') as selected_tags
  `,
  getProductJoins: [
    {
      table: DEAL_CATEGORY,
      condition: `${DEALS}.deal_category_id = ${DEAL_CATEGORY}.id`,
      type: "LEFT JOIN",
    },
    {
      table: SELECTED_TAGS,
      condition: `${DEALS}.id = ${SELECTED_TAGS}.deal_id`,
      type: "LEFT JOIN",
    },
    {
      table: TAGS,
      condition: `${SELECTED_TAGS}.tags_id = ${TAGS}.id`,
      type: "LEFT JOIN",
    },
  ],
  groupBy: {
    groupBy: `${DEALS}.id, ${DEALS}.name, ${DEALS}.description, ${DEALS}.price, ${DEALS}.discount, ${DEALS}.image, ${DEALS}.is_in_stock, ${DEALS}.created_at, ${DEALS}.updated_at, ${DEAL_CATEGORY}.id, ${DEAL_CATEGORY}.name, ${SELECTED_TAGS}.deal_id
  `,
  },
};

const HISTORY_QUERY = {
  productFields: `
    ${PRODUCTS_HISTORY}.id,
    ${PRODUCTS_HISTORY}.product_id,
    ${PRODUCTS_HISTORY}.name,
    ${PRODUCTS_HISTORY}.description,
    ${PRODUCTS_HISTORY}.price,
    ${PRODUCTS_HISTORY}.discount,
    ${PRODUCTS_HISTORY}.is_in_stock,
    ${PRODUCTS_HISTORY}.image,
    ${PRODUCTS_HISTORY}.change_type,
    json_build_object(
      'id', ${SUB_CATEGORY}.id,
      'name', ${SUB_CATEGORY}.name
      ) as sub_category_details,
      ${PRODUCTS_HISTORY}.created_at,
      ${PRODUCTS_HISTORY}.updated_at,
      ${PRODUCTS_HISTORY}.change_timestamp
  `,
  productJoins: [
    {
      table: SUB_CATEGORY,
      condition: `${PRODUCTS_HISTORY}.sub_category_id = ${SUB_CATEGORY}.id`,
    },
  ],
  dealFields: `
    ${DEALS_HISTORY}.id,
    ${DEALS_HISTORY}.deal_id,
    ${DEALS_HISTORY}.name,
    ${DEALS_HISTORY}.description,
    ${DEALS_HISTORY}.price,
    ${DEALS_HISTORY}.discount,
    ${DEALS_HISTORY}.is_in_stock,
    ${DEALS_HISTORY}.image,
    ${DEALS_HISTORY}.change_type,
    json_build_object(
      'id', ${DEAL_CATEGORY}.id,
      'name', ${DEAL_CATEGORY}.name
      ) as deal_category_details,
      ${DEALS_HISTORY}.created_at,
      ${DEALS_HISTORY}.updated_at,
      ${DEALS_HISTORY}.change_timestamp
  `,
  dealJoins: [
    {
      table: DEAL_CATEGORY,
      condition: `${DEALS_HISTORY}.deal_category_id = ${DEAL_CATEGORY}.id`,
    },
  ],
};

module.exports = {
  SUB_CATEGORY_QUERY,
  PRODUCT_QUERY,
  DEAL_QUERY,
  HISTORY_QUERY,
};
