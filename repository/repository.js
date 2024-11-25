// Repository functions for CRUD operations

// Get all data with pagination and selected fields
const getData = async (
  model,
  page = 1,
  limit = 10,
  filter = {},
  populate = "",
  selectFields = ""
) => {
  try {
    const skip = (page - 1) * limit;

    const data = await model
      .find(filter)
      .select(selectFields)
      .populate(populate)
      .skip(skip)
      .limit(limit);

    const totalRecords = await model.countDocuments(filter);

    return {
      data,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
      currentPage: page,
    };
  } catch (error) {
    throw new Error(`Error fetching data with pagination: ${error.message}`);
  }
};

const getDataById = async (model, id, populate = "", selectFields = "") => {
  try {
    const data = await model
      .findById(id)
      .select(selectFields)
      .populate(populate);

    if (!data) {
      throw new Error("Item not found");
    }
    return data;
  } catch (error) {
    throw new Error(`Error fetching data by ID: ${error.message}`);
  }
};

// Create data
const createData = async (model, data) => {
  try {
    console.log("reposetory");

    console.log(data);

    const createdItem = await model.create(data);
    return createdItem;
  } catch (error) {
    throw new Error(`Error creating data: ${error.message}`);
  }
};

// Update data by ID
const updateData = async (model, id, data) => {
  try {
    const updatedItem = await model.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!updatedItem) {
      throw new Error("Item not found");
    }
    return updatedItem;
  } catch (error) {
    throw new Error(`Error updating data: ${error.message}`);
  }
};

// Delete data by ID
const deleteData = async (model, id) => {
  try {
    const deletedItem = await model.findByIdAndDelete(id);
    if (!deletedItem) {
      throw new Error("Item not found");
    }
    return deletedItem;
  } catch (error) {
    throw new Error(`Error deleting data: ${error.message}`);
  }
};

// Search data with query
const searchData = async (
  model,
  query = {},
  page = 1,
  limit = 10,
  populate = "",
  selectFields = ""
) => {
  try {
    const skip = (page - 1) * limit;

    const data = await model
      .find(query)
      .select(selectFields)
      .populate(populate)
      .skip(skip)
      .limit(limit);

    const totalRecords = await model.countDocuments(query);

    return {
      data,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
      currentPage: page,
    };
  } catch (error) {
    throw new Error(`Error searching data: ${error.message}`);
  }
};

module.exports = {
  createData,
  deleteData,
  updateData,
  searchData,
  getData,
  getDataById,
};
