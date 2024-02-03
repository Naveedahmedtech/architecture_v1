const multer = require("multer");

// Set up Multer
const storage = multer.diskStorage({});
const upload = multer({ storage: storage });

module.exports = { upload };
