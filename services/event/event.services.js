const repository = require("../../repository/repository");

const getAllEvents = async (
  model,
  page,
  limit,
  filter,
  populate,
  selectFields
) => {
  return await repository.getData(
    model,
    page,
    limit,
    filter,
    populate,
    selectFields
  );
};

const getEventById = async (model, id, populate, selectFields) => {
  return await repository.getDataById(model, id, populate, selectFields);
};

const createEvent = async (model, data) => {
  return await repository.createData(model, data);
};

const updateEvent = async (model, id, data) => {
  return await repository.updateData(model, id, data);
};

const deleteEvent = async (model, id) => {
  return await repository.deleteData(model, id);
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
