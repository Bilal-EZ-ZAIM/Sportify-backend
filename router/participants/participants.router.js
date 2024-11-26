const express = require("express");
const {
  getAllParticipants,
  getParticipantsById,
  createParticipants,
  updateParticipants,
  deleteParticipants,
} = require("../../controller/participants/participants.controller");
const {
  validitId,
  validiteCreateParticipants,
  validiteUpdateParticipants,
} = require("../../validation/participants/participants.validation");
const router = express.Router();

router.get("/participants/:id",  validitId ,getAllParticipants);

router.get("/participants/:id", validitId, getParticipantsById);

router.post(
  "/participants/create",
  validiteCreateParticipants,
  createParticipants
);

router.put("/participants/update/:id", validitId, validiteUpdateParticipants,updateParticipants);

router.delete("/participants/delete/:id", validitId, deleteParticipants);

module.exports = router;
