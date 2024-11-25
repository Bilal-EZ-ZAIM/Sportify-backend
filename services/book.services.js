// Service.js
const repository = require("../Repository/repository");

const getAllItems = async (
  model,
  page,
  limit,
  filter,
  populate,
  selectFields
) => {

    console.log("servise boobk");
    
  return await repository.getData(
    model,
    page,
    limit,
    filter,
    populate,
    selectFields
  );
};

const getItemById = async (model, id, populate, selectFields) => {
  return await repository.getDataById(model, id, populate, selectFields);
};

const createBook = async (model, data) => {
  console.log(data);

  return await repository.createData(model, data);
};

const updateItem = async (model, id, data) => {
  return await repository.updateData(model, id, data);
};

const deleteItem = async (model, id) => {
  return await repository.deleteData(model, id);
};

module.exports = {
  getAllItems,
  getItemById,
  createBook,
  updateItem,
  deleteItem,
};
