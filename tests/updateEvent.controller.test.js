const { updateEvent } = require("../controller/event/event.controller");
const service = require("../services/event/event.services");

jest.mock("../services/event/event.services");

describe("updateEvent", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      params: { id: "123" },
      body: { title: "Updated Test Event" },
      user: { _id: "456" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should successfully update the event and return 200 status", async () => {
    const mockUpdatedEvent = { _id: "123", title: "Updated Test Event" };

    service.updateEvent.mockResolvedValue(mockUpdatedEvent);

    await updateEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Event updated successfully.",
      data: mockUpdatedEvent,
    });
  });

  it("should return 400 if there is a validation error", async () => {
    const validationError = new Error("Validation error");
    validationError.name = "ValidationError";

    service.updateEvent.mockRejectedValue(validationError);

    await updateEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Validation error occurred.",
      details: validationError.errors,
    });
  });

  it("should return 500 for a general error", async () => {
    const generalError = new Error("Some general error occurred");

    service.updateEvent.mockRejectedValue(generalError);

    await updateEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: `Error updating event: ${generalError.message}`,
    });
  });
});
