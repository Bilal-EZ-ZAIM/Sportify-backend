// Controller.js
const service = require("./Service");

const Model = require("../models/YourModel");

// Get all items with pagination
const getAllItems = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      filter = {},
      populate = "",
      selectFields = "",
    } = req.query;

    const data = await service.getAllItems(
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

// Get item by ID
const getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const { populate = "", selectFields = "" } = req.query;

    const data = await service.getItemById(Model, id, populate, selectFields);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create item
const createItem = async (req, res) => {
  try {
    const data = await service.createItem(Model, req.body);

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update item
const updateItem = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await service.updateItem(Model, id, req.body);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete item
const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await service.deleteItem(Model, id);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
};
