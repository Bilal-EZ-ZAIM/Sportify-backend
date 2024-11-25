const BookServices = require("../services/book.services");
const Book = require("../model/book.model");

// Get all items with pagination
const getAllItems = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      filter = { prix: { $lt: 10 }, name: "book1" },
      populate = "",
      selectFields = "",
    } = req.query;
    console.log("is book controller");

    const parsedFilter =
      typeof filter === "string" ? JSON.parse(filter) : filter;

    const data = await BookServices.getAllItems(
      Book,
      page,
      limit,
      parsedFilter,
      populate,
      selectFields
    );

    res.status(200).json({
      status: "success",
      message: "Books retrieved successfully.",
      data,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: `Error retrieving books: ${error.message}`,
    });
  }
};

// Get item by ID
const getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const { populate = "", selectFields = "" } = req.query;

    const data = await BookServices.getItemById(
      Book,
      id,
      populate,
      selectFields
    );

    res.status(200).json({
      status: "success",
      message: "Book retrieved successfully.",
      data,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: `Error retrieving book: ${error.message}`,
    });
  }
};

// Create item
const createItem = async (req, res) => {
  try {
    const data = await BookServices.createBook(Book, req.body);

    res.status(201).json({
      status: "success",
      message: "Book created successfully.",
      data,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: `Error creating book: ${error.message}`,
    });
  }
};

// Update item
const updateItem = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await BookServices.updateItem(Book, id, req.body);

    res.status(200).json({
      status: "success",
      message: "Book updated successfully.",
      data,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: `Error updating book: ${error.message}`,
    });
  }
};

// Delete item
const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await BookServices.deleteItem(Book, id);

    res.status(200).json({
      status: "success",
      message: "Book deleted successfully.",
      data,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: `Error deleting book: ${error.message}`,
    });
  }
};

module.exports = {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
};
