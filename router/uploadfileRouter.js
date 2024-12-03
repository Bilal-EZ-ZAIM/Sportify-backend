const express = require("express");
const router = express.Router();
const upload = require("../util/upload");
const { uploadSingleImage } = require("../controller/uploadImageController");

router.post("/upload", upload.single("image"), uploadSingleImage);

router.post("/uploads", upload.array("images"), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "Please upload image files" });
  }

  try {
    const fileUrls = req.files.map((file) => getLocalFileUrl(file.path, req));

    res.status(200).json({
      message: "Files uploaded successfully",
      files: req.files.map((file, index) => ({
        filename: file.filename,
        url: fileUrls[index],
      })),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
