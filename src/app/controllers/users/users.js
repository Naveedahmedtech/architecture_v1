// project external files

// project files
const { deleteAll } = require("../../../utils/dbUtils/crud/deleteAll");
const { deleteOne } = require("../../../utils/dbUtils/crud/deleteOne");
const { getAll } = require("../../../utils/dbUtils/crud/getAll");
const { getOne } = require("../../../utils/dbUtils/crud/getOne");
const { updateOne } = require("../../../utils/dbUtils/crud/updateOne");

exports.updateProfile = async (req, res) => {
  const { id, username, full_name } = req.body;
  const data = {
    username,
    full_name,
  };
  await updateOne(req, res, {
    tableName: "users",
    data,
    filters: [{ field: "id", operator: "=", value: id }],
    returnFields: "*",
  });
};


exports.get = async (req, res) => {
  const user_id = req.params.id;

  await getOne(req, res, {
    tableName: "users",
    fields: `*`,
    filters: [
      {
        field: "users.id",
        operator: "=",
        value: user_id,
      },
    ],
  });
};

exports.getAll = async (req, res) => {
  try {
    await getAll(req, res, {
      tableName: "users",
    });
  } catch (error) {
    console.error("Error retrieving detailed users:", error);
    return responseHandler(res, 500, false, "Failed to retrieve user details");
  }
};


exports.delete = async (req, res) => {
  const user_id = req.params.id;

  await deleteOne(req, res, {
    tableName: "users",
    filters: [
      {
        field: "id",
        operator: "=",
        value: user_id,
      },
    ],
  });
};

exports.deleteAll = async (req, res) => {
  await deleteAll(req, res, {
    tableName: "users",
  });
};
