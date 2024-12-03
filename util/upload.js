// prepare image
const multer = require("multer");
const path = require("path");

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
  if (
    !file.mimetype.startsWith("image/") ||
    !allowedTypes.includes(file.mimetype)
  ) {
    cb(new Error("Invalid file type. Only JPEG, PNG, and GIF are allowed."));
  } else {
    cb(null, true);
  }
};

// Initialize multer with storage, file filter, and limits
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

module.exports = upload;
// prepare image
