// project external files

// project files

const { getAll } = require("../../../../utils/dbUtils/crud/getAll");

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
