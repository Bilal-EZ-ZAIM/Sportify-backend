const express = require("express");
const dotenv = require("dotenv");
// const dbConection = require("./config/database");
const app = express();
const authRouter = require("./router/auth/auth.router");
const organisateurRouter = require("./router/event/event.router");
const participantsRouter = require("./router/participants/participants.router");
const cors = require("cors");
const verifyToken = require("./middleware/VerifyToken");
const roleMiddleware = require("./middleware/roleMiddleware");
// dbConection();
dotenv.config();

const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

app.get("/api", (req, res) => {
  res.status(200).json({
    message: "Bonjour, backend opérationnel ! 🚀sss",
  });
});

app.use("/api/v1/auth/", authRouter);


app.use(
  "/api/v1/manager/",
  verifyToken,
  roleMiddleware("manager"),
  organisateurRouter
);

app.use(
  "/api/v1/manager/",
  verifyToken,
  roleMiddleware("manager"),
  participantsRouter
);

app.use((err, req, res, next) => {
  return res.status(400).json({ err });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

module.exports = app;
