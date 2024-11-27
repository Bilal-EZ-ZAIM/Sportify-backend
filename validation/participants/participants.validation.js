const { check } = require("express-validator");
const handelParamesError = require("../../middleware/handelParamesError");
const ParticipantsModel = require("../../model/participants/participants.model");
const EventModel = require("../../model/event/event.model");
// Validation pour les paramètres de l'ID de l'événement
const validitId = [
  check("id").isMongoId().withMessage("Id is not valid"),
  handelParamesError,
];

const validiteCreateParticipants = [
  check("username")
    .notEmpty()
    .withMessage("Participants username is required")
    .isLength({ min: 3 })
    .withMessage("Participants username is too short")
    .isLength({ max: 50 })
    .withMessage("Participants username is too long"),
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Forma not email"),
  check("phone")
    .notEmpty()
    .withMessage("Phone is required")
    .isMobilePhone(["ar-MA"])
    .withMessage("InValid phone number Moroco"),
  check("event").notEmpty().withMessage("event is required"),

  handelParamesError,
];

// Validation pour la mise à jour d'un événement
const validiteUpdateParticipants = [
  check("username")
    .isLength({ min: 3 })
    .withMessage("Participants username is too short")
    .isLength({ max: 50 })
    .withMessage("Participants username is too long"),
  check("email").isEmail().withMessage("Forma not email"),
  check("phone")
    .isMobilePhone(["ar-MA"])
    .withMessage("InValid phone number Moroco"),

  handelParamesError,
];

module.exports = {
  validitId,
  validiteCreateParticipants,
  validiteUpdateParticipants,
};
