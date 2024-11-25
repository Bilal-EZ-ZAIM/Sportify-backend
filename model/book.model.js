const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "name required"],
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [50, "Name must be less than 50 characters"],
    },
    prix: {
      type: Number ,
      trim: true,
      required: [true, "prix required"],
    },
  },
  {
    timestamps: true,
  }
);

const BookModel = mongoose.model("Book", BookSchema);

module.exports = BookModel;
