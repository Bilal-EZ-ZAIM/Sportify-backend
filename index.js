const express = require("express");
const dotenv = require("dotenv");
const dbConection = require("./config/database");
const app = express();
const authRouter = require("./router/auth/auth.router");
const bookRouter = require("./router/book/book.router");
const cors = require("cors");
dbConection();
dotenv.config();

const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

app.use("/api/auth/", authRouter);

app.use("/api/", bookRouter);

app.use((err, req, res, next) => {
  return res.status(400).json({ err });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

module.exports = app;
