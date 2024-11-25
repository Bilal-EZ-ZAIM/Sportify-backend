const express = require("express");
const router = express.Router();
const {
  regester,
  getUserById,
  verifierAccount,
  sendMail,
  verifier2FA,
  login,
  forgetpassword,
  resetpassword,
  updatedpassword,
  logout,
  loginByToken,
  resendVerification,
} = require("../../controller/auth/auth.controller");
const {
  ValiditeCreat,
  ValiditeLogin,
  ValiditeEmailforgetpassword,
  ValiditePassworUpdit,
  ValiditePassworUpditForget,
} = require("../../validation/auth.validation");
const verifyCodeToken = require("../../middleware/verfyCodeToken");
const verifyToken = require("../../middleware/VerifyToken");

router.get("/islogin", verifyToken, loginByToken);
router.get("/resendVerification", verifyToken, resendVerification);

router.get("/verifyAcount/:token", verifierAccount);
router.post("/verify-otp/:token", verifier2FA);
router.get("/getUserById/:id", getUserById);
router.post("/register", ValiditeCreat, regester);
router.post("/login", ValiditeLogin, login);
router.post("/", sendMail);

router.post(
  "/resetpassword/:token",
  ValiditePassworUpditForget,
  verifyCodeToken,
  resetpassword
);
router.post("/forgetpassword", ValiditeEmailforgetpassword, forgetpassword);
router.post(
  "/upditPassword",
  verifyToken,
  ValiditePassworUpdit,
  updatedpassword
);

router.get("/logout", verifyToken, logout);
module.exports = router;
