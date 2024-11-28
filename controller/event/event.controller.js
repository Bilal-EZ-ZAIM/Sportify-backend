const service = require("../../services/event/event.services");

const Model = require("../../model/event/event.model");

// Get all events with pagination
// GET /api/events
// Endpoint pour récupérer tous les événements avec pagination et options de filtrage.
const getAllEvents = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 6,
      filter = { organisateur: req.user.id },
      populate = {
        path: "organisateur",
        select: "name email",
      },
      selectFields = "",
    } = req.query;

    const parsedFilter =
      typeof filter === "string" ? JSON.parse(filter) : filter;
    const data = await service.getAllEvents(
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
    const { name, date, location, description, participants } = req.body;

    const data = {
      name,
      description,
      date,
      location,
      participants,
      organisateur: req.user.id,
    };

    const event = await service.createEvent(Model, data);

    res.status(201).json({
      message: "L'événement a été créé avec succès!",
      event: event,
    });
  } catch (error) {
    res.status(500).json({
      message:
        "Une erreur est survenue lors de la création de l'événement. Veuillez réessayer plus tard.",
      error: error.message,
    });
  }
};

// Update event
// PUT /api/events/:id
// Endpoint pour mettre à jour les informations d'un événement existant.
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedEvent = await service.updateEvent(
      Model,
      id,
      req.body,
      req.user._id
    );

    res.status(200).json({
      message: "Event updated successfully.",
      data: updatedEvent,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(400).json({
        message: "Validation error occurred.",
        details: error.errors,
      });
    } else {
      res
        .status(500)
        .json({ message: `Error updating event: ${error.message}` });
    }
  }
};

// Delete event
// DELETE /api/events/:id
// Endpoint pour supprimer un événement par son identifiant.
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

     await service.deleteEvent(Model, id, req.user._id);

    res.status(200).json({ message: "Event deleted successfully." });
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
