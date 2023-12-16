const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const pool = require("./db.connect");

const initDatabase = async () => {
  // Read the manifest file
  const manifestPath = path.join(__dirname, "..", "models", "manifest.yml");
  const manifest = yaml.load(fs.readFileSync(manifestPath, "utf8"));

  // Loop through the manifest to ensure the correct order
  for (const file of manifest) {
    console.log("File",file);
    try {
      const filePath = path.join(__dirname, "..", "models", file);
      const initSQL = fs.readFileSync(filePath, "utf8");
      await pool.query(initSQL);
      console.log(`Initialized '${file}' successfully`);
    } catch (err) {
      console.error(`Error Occurred While Initializing ${file}:`, err);
      throw err; 
    }
  }
};

module.exports = initDatabase;
