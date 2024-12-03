const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");

const dotenv = require("dotenv");
dotenv.config();

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
  secure: true,
});

const uploadToCloudinary = async (filePath) => {
  try {
    const uploadResult = await cloudinary.uploader.upload(filePath);

    fs.unlinkSync(filePath);

    const optimizeUrl = cloudinary.url(uploadResult.public_id, {
      fetch_format: "auto",
      quality: "auto",
    });

    return uploadResult;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

const uploadSingleImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Please upload an image." });
    }

    const uploadResult = await uploadToCloudinary(req.file.path);

    if (!uploadResult || !uploadResult.secure_url) {
      return res.status(500).json({ error: "Image upload failed." });
    }

    req.file = uploadResult;

    next();
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Error uploading image." });
  }
};

module.exports = {
  uploadSingleImage,
};
