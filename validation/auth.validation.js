const { check } = require("express-validator");
const handelParamesError = require("../middleware/handelParamesError");
const UserModel = require("../model/user.model");
const ValiditUserId = [
  check("id").isMongoId().withMessage("Id is not fond"),
  handelParamesError,
];

const ValiditeCreat = [
  check("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Too Short Name")
    .isLength({ max: 50 })
    .withMessage("Too long Name"),
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Forma not email")
    .custom(async (val) => {
      await UserModel.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("Email already in user"));
        }
      });
    }),
  check("phone")
    .notEmpty()
    .withMessage("Phone is required")
    .isMobilePhone(["ar-MA"])
    .withMessage("InValid phone number Moroco")
    .custom(async (val) => {
      await UserModel.findOne({ phone: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("Phone already in user"));
        }
      });
    }),
  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("Too Short Password"),
  check("confirmPassword")
    .notEmpty()
    .withMessage("confirmPassword is required")
    .isLength({ min: 8 })
    .withMessage("Too Short confirmPassword")
    .custom((value, { req }) => {
      if (req.body.password !== value) {
        throw new Error(
          "Confirmation password does not match the new password"
        );
      }
      return true;
    }),
  handelParamesError,
];

const ValiditePassworUpdit = [
  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("Too Short Password"),
  check("newPassword")
    .notEmpty()
    .withMessage("newPassword is required")
    .isLength({ min: 8 })
    .withMessage("Too Short Password"),
  check("confirmPassword")
    .notEmpty()
    .withMessage("confirmPassword is required")
    .isLength({ min: 8 })
    .withMessage("Too Short confirmPassword")
    .custom((value, { req }) => {
      if (req.body.newPassword !== value) {
        throw new Error(
          "Confirmation password does not match the new password"
        );
      }
      return true;
    }),
  handelParamesError,
];


const ValiditePassworUpditForget = [
  check("newPassword")
    .notEmpty()
    .withMessage("newPassword is required")
    .isLength({ min: 8 })
    .withMessage("Too Short Password"),
  check("confirmPassword")
    .notEmpty()
    .withMessage("confirmPassword is required")
    .isLength({ min: 8 })
    .withMessage("Too Short confirmPassword")
    .custom((value, { req }) => {
      if (req.body.newPassword !== value) {
        throw new Error(
          "Confirmation password does not match the new password"
        );
      }
      return true;
    }),
  handelParamesError,
];
const ValiditeLogin = [
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Forma not email"),
  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("Too Short Password"),
  handelParamesError,
];

const ValiditeEmailforgetpassword = [
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Forma not email"),
  handelParamesError,
];

module.exports = {
  ValiditUserId,
  ValiditeCreat,
  ValiditePassworUpdit,
  ValiditeLogin,
  ValiditeEmailforgetpassword,
  ValiditePassworUpditForget
};
