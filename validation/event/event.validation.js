const { check } = require("express-validator");
const handelParamesError = require("../middleware/handelParamesError");
const EventModel = require("../model/event/event.model");

// Validation pour les paramètres de l'ID de l'événement
const ValiditEventId = [
  check("id").isMongoId().withMessage("Id is not valid"),
  handelParamesError,
];

const ValiditeCreateEvent = [
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
    .optional()
    .isLength({ max: 500 })
    .withMessage("Event description is too long"),

  handelParamesError,
];

// Validation pour la mise à jour d'un événement
const ValiditeUpdateEvent = [
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

// Validation pour la suppression d'un événement
const ValiditeDeleteEvent = [
  check("id").isMongoId().withMessage("Id is not valid"),
  handelParamesError,
];

module.exports = {
  ValiditEventId,
  ValiditeCreateEvent,
  ValiditeUpdateEvent,
  ValiditeDeleteEvent,
};
