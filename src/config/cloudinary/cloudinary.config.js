const cloudinary = require("cloudinary").v2;
const { NAME, API_KEY, SECRET } = require("../../constants/config");

cloudinary.config({
  cloud_name: NAME,
  api_key: API_KEY,
  api_secret: SECRET,
});

module.exports = { cloudinary };
