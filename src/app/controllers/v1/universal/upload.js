exports.upload = async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  res.status(200).json({
    message: "File uploaded successfully",
    fileDetails: req.file,
  });
};
