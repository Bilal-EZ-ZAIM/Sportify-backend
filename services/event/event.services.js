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

const updateEvent = async (model, id, data,userId) => {
  // console.log(req.user);

  const updatedEvent = await repository.updateDataByOwner(
    model,
    id,
    data,
    userId
  );

  console.log(userId);
  if (!updatedEvent) {
    return res
      .status(404)
      .json({ message: "Event not found. Please check the ID." });
  }
  return updateEvent;
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
