const upload = require("../config/multer/multerConfig");

const uploadSingle = (req, res, next) => {
  const uploadSingleFile = upload.single("file");

  uploadSingleFile(req, res, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    next();
  });
};

module.exports = {
  uploadSingle,
};
