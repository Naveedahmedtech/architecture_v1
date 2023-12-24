const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "public",
      "uploads"
    );

    // Check if the directory exists
    fs.access(uploadsDir, fs.constants.F_OK, (err) => {
      if (err) {
        // Directory does not exist, so create it
        fs.mkdir(uploadsDir, { recursive: true }, (err) => {
          if (err) {
            cb(err);
          } else {
            cb(null, uploadsDir);
          }
        });
      } else {
        // Directory exists, proceed as normal
        cb(null, uploadsDir);
      }
    });
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
