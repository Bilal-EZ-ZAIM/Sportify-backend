// Controller.js
const service = require("../../services/participants/participants.services");

const Model = require("../../model/participants/participants.model");

// Get all items with pagination
const getAllParticipants = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      filter = { event: req.params.id },
      populate = "",
      selectFields = "",
    } = req.query;
    const parsedFilter =
      typeof filter === "string" ? JSON.parse(filter) : filter;

    const data = await service.getAllParticipants(
      Model,
      page,
      limit,
      parsedFilter,
      populate,
      selectFields
    );

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get item by ID
const getParticipantsById = async (req, res) => {
  try {
    const { id } = req.params;
    const { populate = "", selectFields = "" } = req.query;

    const data = await service.getParticipantsById(
      Model,
      id,
      populate,
      selectFields
    );

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create Participants
const createParticipants = async (req, res) => {
  try {
    const data = await service.createParticipants(
      Model,
      req.body,
      req.user._id
    );

    res.status(201).json({ message: "Participant created successfully", data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Participants
const updateParticipants = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedParticipant = await service.updateParticipants(
      Model,
      id,
      req.body,
      req.user.id
    );

    res.status(200).json({
      message: "Participant updated successfully",
      data: updatedParticipant,
    });
  } catch (error) {
    if (error.message === "Participant not found") {
      return res.status(404).json({ message: error.message });
    }

    if (error.message === "Event not found") {
      return res.status(404).json({ message: error.message });
    }

    if (error.message === "Unauthorized: You do not own this event") {
      return res.status(403).json({ message: error.message });
    }

    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const deleteParticipants = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await service.deleteParticipants(Model, id, req.user.id);

    res.status(200).json({
      message: "Participant deleted successfully",
      data,
    });
  } catch (error) {
    if (error.message === "Participant not found for the specified ID") {
      return res.status(404).json({ message: error.message });
    }

    if (error.message === "Event not found for the specified ID") {
      return res.status(404).json({ message: error.message });
    }

    if (error.message === "Unauthorized: You do not own this event") {
      return res.status(403).json({ message: error.message });
    }

    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = {
  getAllParticipants,
  getParticipantsById,
  createParticipants,
  updateParticipants,
  deleteParticipants,
};
