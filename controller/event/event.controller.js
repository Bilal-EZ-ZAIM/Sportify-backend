const service = require("../../services/event/event.services");

const Model = require("../../model/event/event.model");

// Get all events with pagination
// GET /api/events
// Endpoint pour récupérer tous les événements avec pagination et options de filtrage.
const getAllEvents = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      filter = {},
      populate = "",
      selectFields = "",
    } = req.query;

    const data = await service.getAllEvents(
      Model,
      page,
      limit,
      JSON.parse(filter),
      populate,
      selectFields
    );

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get event by ID
// GET /api/events/:id
// Endpoint pour récupérer un événement spécifique par son identifiant.
const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const { populate = "", selectFields = "" } = req.query;

    const data = await service.getEventById(Model, id, populate, selectFields);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create event
// POST /api/events
// Endpoint pour créer un nouvel événement.
const createEvent = async (req, res) => {
  try {
    const data = await service.createEvent(Model, req.body);

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update event
// PUT /api/events/:id
// Endpoint pour mettre à jour les informations d'un événement existant.
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await service.updateEvent(Model, id, req.body);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete event
// DELETE /api/events/:id
// Endpoint pour supprimer un événement par son identifiant.
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await service.deleteEvent(Model, id);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
