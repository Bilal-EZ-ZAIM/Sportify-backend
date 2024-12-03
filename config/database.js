const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config();

const URL = process.env.URL;


const dbConection = () =>
  mongoose
    .connect(URL)
    .then(() => {
      console.log("mongodb is connect");
    })
    .catch((errror) => console.log("mongodb not is connect", errror));

module.exports = dbConection;
