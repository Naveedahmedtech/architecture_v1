const { responseHandler } = require("../../../utils/common/apiResponseHandler");
const { createOne } = require("../../../utils/dbUtils/crud/createOne");
const { deleteAll } = require("../../../utils/dbUtils/crud/deleteAll");
const { deleteOne } = require("../../../utils/dbUtils/crud/deleteOne");
const { getAll } = require("../../../utils/dbUtils/crud/getAll");
const { getOne } = require("../../../utils/dbUtils/crud/getOne");
const { updateOne } = require("../../../utils/dbUtils/crud/updateOne");

exports.createOrders = async (req, res) => {
  await createOne(req, res, {
    tableName: "orders",
    data: req.body,
    returnFields: `
  json_build_object(
    'orderId', orders.id, 
    'amount', orders.amount, 
    'status', orders.status, 
    'orderDate', orders.order_date, 
    'user', json_build_object(
      'name', users.name, 
      'email', users.email
    )
  ) as orderDetails
`,
    joins: [
      {
        table: "users",
        condition: "orders.user_id = users.id",
      },
    ],
  });
};

exports.updateOrder = async (req, res) => {
  const { id } = req.body;
  await updateOne(req, res, {
    tableName: "orders",
    data: req.body,
    filters: [{ field: "id", operator: "=", value: id }],
    returnFields:
      "orders.id, orders.amount, orders.status, orders.order_date, json_build_object('name', users.name, 'email', users.email) as user",
    joins: [{ table: "users", condition: "orders.user_id = users.id" }],
  });
};

exports.getAllOrders = async (req, res) => {
  const { status, userId } = req.query;

  try {
    let filters = [];

    if (status) {
      filters.push({
        field: "orders.status",
        operator: "=",
        value: `'${status}'`,
      });
    }

    if (userId) {
      filters.push({ field: "orders.user_id", operator: "=", value: userId });
    }

    await getAll(req, res, {
      tableName: "orders",
      fields: [
        "orders.id",
        "orders.order_date",
        "orders.amount",
        "json_build_object('name', users.name, 'email', users.email) as user",
      ],
      joins: [
        {
          table: "users",
          condition: "orders.user_id = users.id",
        },
      ],
      filters,
      aggregates: [],
      defaultSortField: "orders.order_date",
      additionalOptions: {
        groupBy: "orders.id, orders.order_date, users.name, users.email, orders.user_id",
      },
    });
  } catch (error) {
    console.error("Error retrieving detailed orders:", error);
    responseHandler(res, 500, false, "Failed to retrieve detailed orders");
  }
};

exports.getOneOrder = async (req, res) => {
  const order_id = req.params.id;

  await getOne(req, res, {
    tableName: "orders",
    fields: `
    json_build_object(
      'orderId', orders.id,
      'amount', orders.amount,
      'orderDate', orders.order_date,
      'user', json_build_object(
        'userName', users.name
      )
    ) as orders
  `,
    joins: [
      {
        table: "users",
        condition: "orders.user_id = users.id",
      },
    ],
    filters: [
      {
        field: "orders.id",
        operator: "=",
        value: order_id,
      },
    ],
    sortField: "orders.order_date",
    sortOrder: "desc",
  });
};

exports.deleteOneOrder = async (req, res) => {
  const orderId = req.params.id;

  await deleteOne(req, res, {
    tableName: "orders",
    filters: [
      {
        field: "id",
        operator: "=",
        value: orderId,
      },
    ],
  });
};

exports.deleteAllOrders = async (req, res) => {
  await deleteAll(req, res, {
    tableName: "orders",
    // filters: [
    //   {
    //     field: "status",
    //     operator: "=",
    //     value: "'delivered'",
    //   },
    // ],
  });
};
