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

  check("event").notEmpty().withMessage("event is required"),

  handelParamesError,
];

// Validation pour la mise à jour d'un événement
const validiteUpdateParticipants = [
  check("username")
    .notEmpty()
    .withMessage("Participants username is required")
    .isLength({ min: 3 })
    .withMessage("Participants username is too short")
    .isLength({ max: 50 })
    .withMessage("Participants username is too long"),

  check("event")
    .notEmpty()
    .withMessage("event is required")
    .custom(async (val) => {
      console.log(val);

      const existingEvent = await EventModel.find({ _id: val });
      if (!existingEvent) {
        return Promise.reject(new Error("Event not fond"));
      }
    }),

  handelParamesError,
];

module.exports = {
  validitId,
  validiteCreateParticipants,
  validiteUpdateParticipants,
};
