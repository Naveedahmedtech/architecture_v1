const ERROR_MSGS = {
  INTERNAL_SERVER_ERROR: "Internal Server Error",
  RECORD_NOT_FOUND: "Record Not Found",
  ALREADY_EXISTS: "Record Already Exists",
  MISSING_DATA: "Missing Data for updating",
  MISSING_FILER_DATA: "Missing filter data for updating",
  BAD_REQUEST: "Bad Request",
  DUPLICATE: "Duplicate Entry",
};

const TABLES = {
  USER: "users",
  CATEGORY: "categories",
  SUB_CATEGORY: "sub_categories",
  PRODUCTS: "products",
  DEAL_CATEGORY: "deal_categories",
  DEALS: "deals",
  TAGS: "tags",
  SELECTED_TAGS: "selected_tags",
  PRODUCTS_HISTORY: "products_history",
  DEALS_HISTORY: "deals_history",
  QUERIES: "queries",
};

module.exports = {
  ERROR_MSGS,
  TABLES,
};
