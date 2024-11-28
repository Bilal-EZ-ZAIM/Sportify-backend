// controllers/uploadController.js
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");

// Set up Cloudinary with your API credentials
cloudinary.config({
  cloud_name: "dsldmzxqt", // Replace with your cloud name
  api_key: "911915962845283", // Replace with your API key
  api_secret: "WxofRCHYbkEQhRultpf_vNyp5DE", // Replace with your API secret
  secure: true,
});

// Function to upload an image to Cloudinary
const uploadToCloudinary = async (filePath) => {
  try {
    // Upload the image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(filePath);

    // After uploading, delete the local file
    fs.unlinkSync(filePath);

    console.log("Image uploaded successfully:", uploadResult);

    // Get the optimized image URL (for better quality and smaller size)
    const optimizeUrl = cloudinary.url(uploadResult.public_id, {
      fetch_format: "auto", // Automatically fetch the best format
      quality: "auto", // Automatically adjust the quality
    });

    console.log("Optimized URL:", optimizeUrl);

    return uploadResult; // Return the uploaded image details
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error; // Rethrow the error to be handled further up
  }
};

// API endpoint function for uploading a single image
const uploadSingleImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Please upload an image." });
    }

    // Upload the image to Cloudinary
    const uploadResult = await uploadToCloudinary(req.file.path);

    res.status(200).json({
      message: "Image uploaded successfully.",
      file: {
        name: req.file.filename,
        url: uploadResult.secure_url, // Secure URL of the uploaded image
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Error uploading image." });
  }
};

module.exports = {
  uploadSingleImage,
};
