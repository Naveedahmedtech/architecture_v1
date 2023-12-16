const { responseHandler } = require("../../../utils/common/apiResponseHandler");
const { getAll } = require("../../../utils/dbUtils/crud");

exports.getDetailedOrders = async (req, res) => {
  try {
    await getAll(req, res, {
      tableName: "orders",
      fields: ["orders.id", "orders.order_date", "users.name as userName"],
      joins: [
        {
          table: "users",
          condition: "orders.user_id = users.id",
        },
      ],
      filters: [
        {
          field: "orders.status",
          operator: "=",
          value: "'delivered'",
        },
      ],
      aggregates: [
        {
          function: "COUNT",
          field: "orders.id",
          alias: "totalOrders",
        },
        {
          function: "SUM",
          field: "orders.amount",
          alias: "totalAmount",
        },
      ],
      defaultSortField: "orders.order_date",
      additionalOptions: {
        groupBy: "orders.id, orders.order_date, users.name, orders.user_id",
      },
    });
  } catch (error) {
    console.error("Error retrieving detailed orders:", error);
    responseHandler(res, 500, false, "Failed to retrieve detailed orders");
  }
};

// Use case for retrieving all records from the 'products' table
exports.getAllOrders = async (req, res) => {
  try {
    await getAll(req, res, {
      tableName: 'orders',
    });
  } catch (error) {
    // Handle any potential errors that might occur
    console.error('Error retrieving all products:', error);
    responseHandler(res, 500, false, 'Failed to retrieve products');
  }
};

