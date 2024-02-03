// external files
const path = require("path");
const { logger } = require("../../config/logger/logger.config");
const { cloudinary } = require("../../config/cloudinary/cloudinary.config");
const { uuid } = require("./common");

const uploadToCloudinary = async (filePath, folder_name) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `chaiforyou/${folder_name}`,
    });
    return result;
  } catch (error) {
    logger.error({ message: "Detailed Cloudinary error:", err: error.message });
    throw error;
  }
};

const updateOnCloudinary = async (filePath, publicId) => {
  const fullPublicId = `${publicId}`;
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      public_id: fullPublicId,
      overwrite: true,
    });
    return result;
  } catch (error) {
    logger.error({
      message: "Error updating image on Cloudinary:",
      err: error.message,
    });
    throw error;
  }
};


const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    logger.error({
      message: "Error deleting image from Cloudinary:",
      err: error.message,
    });
    throw error;
  }
};


const extractPublicId = (filename) => {
  const parts = filename.split("/");
  if (parts.length > 1) {
    let publicId = parts[1];

    return publicId;
  }
  throw new Error("EXTRACT_ERROR");
};

const generatePublicId = (originalFileName) => {
  let baseName = path.basename(
    originalFileName,
    path.extname(originalFileName)
  );

  baseName = baseName.split(" ").join("-").toLowerCase();

  return `${uuid()}-${baseName}`;
};

module.exports = {
  uploadToCloudinary,
  updateOnCloudinary,
  deleteFromCloudinary,
  extractPublicId,
  generatePublicId,
};
