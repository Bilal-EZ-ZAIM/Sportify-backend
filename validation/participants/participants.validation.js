const { check } = require("express-validator");
const handelParamesError = require("../../middleware/handelParamesError");
const ParticipantsModel = require("../../model/participants/participants.model");

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

  check("event")
    .notEmpty()
    .withMessage("event is required")
    .custom(async (val) => {
      const existingEvent = await EventModel.findOneById(val);
      if (existingEvent) {
        return Promise.reject(new Error("Event not fond"));
      }
    }),

  handelParamesError,
];

// Validation pour la mise à jour d'un événement
const validiteUpdateEvent = [
  check("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Event name is too short")
    .isLength({ max: 100 })
    .withMessage("Event name is too long")
    .custom(async (val) => {
      const existingEvent = await EventModel.findOne({ name: val });
      if (existingEvent) {
        return Promise.reject(new Error("Event name already exists"));
      }
    }),

  check("date").optional().isISO8601().withMessage("Invalid event date format"),

  check("location")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Event location is too short")
    .isLength({ max: 200 })
    .withMessage("Event location is too long"),

  check("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Event description is too long"),

  handelParamesError,
];

module.exports = {
  validitEventId,
  validiteCreateParticipants,
  validiteUpdateEvent,
};
