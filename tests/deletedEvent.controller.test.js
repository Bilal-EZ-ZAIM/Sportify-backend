const { deleteEvent } = require("../controller/event/event.controller");
const service = require("../services/event/event.services");

jest.mock("../services/event/event.services");

describe("deleteEvent controller", () => {
  it("should delete an event successfully", async () => {
    const eventId = "12345";
    const mockUser = { _id: "user123" };

    service.deleteEvent.mockResolvedValue(true);

    const req = {
      params: { id: eventId },
      user: mockUser,
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await deleteEvent(req, res);

    expect(service.deleteEvent).toHaveBeenCalledWith(
      expect.anything(),
      eventId,
      mockUser._id
    );

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
      message: "Event deleted successfully.",
    });
  });

  it("should handle errors when deletion fails", async () => {
    const eventId = "12345";
    const mockUser = { _id: "user123" };
    const mockErrorMessage = "Something went wrong";

    service.deleteEvent.mockRejectedValue(new Error(mockErrorMessage));

    const req = {
      params: { id: eventId },
      user: mockUser,
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await deleteEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(500);

    expect(res.json).toHaveBeenCalledWith({
      message: mockErrorMessage,
    });
  });
});
