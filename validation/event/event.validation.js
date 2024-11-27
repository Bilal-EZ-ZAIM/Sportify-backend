const { check } = require("express-validator");
const handelParamesError = require("../../middleware/handelParamesError");
const EventModel = require("../../model/event/event.model");


// Validation pour les paramètres de l'ID de l'événement
const validitEventId = [
  check("id").isMongoId().withMessage("Id is not valid"),
  handelParamesError,
];

const validiteCreateEvent = [
  check("name")
    .notEmpty()
    .withMessage("Event name is required")
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

  check("date")
    .notEmpty()
    .withMessage("Event date is required")
    .isISO8601()
    .withMessage("Invalid event date format"),

  check("location")
    .notEmpty()
    .withMessage("Event location is required")
    .isLength({ min: 3 })
    .withMessage("Event location is too short")
    .isLength({ max: 200 })
    .withMessage("Event location is too long"),

  check("description")
    .notEmpty()
    .withMessage("Event description is required")
    .isLength({ max: 500 })
    .withMessage("Event description is too long"),

  check("participants")
    .notEmpty()
    .withMessage("Event participants is required"),

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
  validiteCreateEvent,
  validiteUpdateEvent,
};
