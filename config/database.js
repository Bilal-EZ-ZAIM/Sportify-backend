const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config();

const URL = process.env.URL;
const docker = "mongodb://root:example@mongo:27017/AlloMedia?authSource=admin";

const dbConection = () =>
  mongoose
    .connect(
      "mongodb+srv://bilanox:rJQ0lEMRHM8hd7Md@cluster0.6nqmc.mongodb.net/sportyfs?retryWrites=true&w=majority&appName=Cluster0"
    )
    .then(() => {
      console.log("mongodb is connect");
    })
    .catch((errror) => console.log("mongodb not is connect", errror));

module.exports = dbConection;
