const { uploadToCloudinary } = require("../upload");

const uploadFile = async (req, data, fileColumn, tableName) => {
  const file = req.file;
  if (file) {
    data[fileColumn] = await uploadToCloudinary(file.path, tableName);
  }
};

module.exports = { uploadFile };
