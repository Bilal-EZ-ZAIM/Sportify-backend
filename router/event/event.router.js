const express = require("express");
const router = express.Router();

const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../../controller/event/event.controller");
const upload = require("../../util/upload");

const {
  validitEventId,
  validiteCreateEvent,
  validiteUpdateEvent,
} = require("../../validation/event/event.validation");
const { uploadSingleImage } = require("../../controller/uploadImageController");

router.get("/event", getAllEvents);

router.get("/event/:id", validitEventId, getEventById);

router.post(
  "/event/create",
  upload.single("image"),
  validiteCreateEvent,
  uploadSingleImage,
  createEvent
);

router.put(
  "/event/update/:id",
  validitEventId,
  validiteUpdateEvent,
  updateEvent
);

router.delete("/event/delete/:id", validitEventId, deleteEvent);

module.exports = router;
