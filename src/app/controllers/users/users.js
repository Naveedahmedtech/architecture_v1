const { hashPassword } = require("../../../lib/common/bcrypt");
const { createOne } = require("../../../utils/dbUtils/crud/createOne");

exports.register = async (req, res) => {
  const { full_name, email, password } = req.body;

  const hashedPassword = await hashPassword(password);

  const data = {
    full_name: full_name,
    email: email,
    password: hashedPassword,
  };

  createOne(req, res, {
    tableName: "users",
    data: data,
    returnFields: "*",
    excludeFields: ["password"],
  });
};
