const express = require("express");
const router = express.Router();

const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../../controller/event/event.controller");

const {
  validitEventId,
  validiteCreateEvent,
  validiteUpdateEvent,
} = require("../../validation/event/event.validation");

router.get("/event", getAllEvents);

router.get("/event/:id", validitEventId, getEventById);

router.post("/event", validiteCreateEvent, createEvent);

router.put("/event/:id", validitEventId, validiteUpdateEvent, updateEvent);

router.delete("/event/:id", validitEventId, deleteEvent);

module.exports = router;
