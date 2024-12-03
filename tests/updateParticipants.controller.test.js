const {
  updateParticipants,
} = require("../controller/participants/participants.controller");
const service = require("../services/participants/participants.services");

jest.mock("../services/participants/participants.services");

describe("updateParticipants controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: "participant123" },
      body: {
        username: "Updated Name",
        email: "updated@example.com",
      },
      user: { id: "organisateur123" },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  it("should update a participant successfully", async () => {
    const mockUpdatedParticipant = {
      id: "participant123",
      username: "Updated Name",
      email: "updated@example.com",
    };

    service.updateParticipants.mockResolvedValue(mockUpdatedParticipant);

    await updateParticipants(req, res);

    expect(service.updateParticipants).toHaveBeenCalledWith(
      expect.anything(),
      "participant123",
      { username: "Updated Name", email: "updated@example.com" },
      "organisateur123"
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Participant updated successfully",
      data: mockUpdatedParticipant,
    });
  });

  it("should return 404 if the participant is not found", async () => {
    service.updateParticipants.mockRejectedValue(
      new Error("Participant not found")
    );

    await updateParticipants(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Participant not found",
    });
  });

  it("should return 404 if the event is not found", async () => {
    service.updateParticipants.mockRejectedValue(new Error("Event not found"));

    await updateParticipants(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Event not found",
    });
  });

  it("should return 403 if the user is not authorized", async () => {
    service.updateParticipants.mockRejectedValue(
      new Error("Unauthorized: You do not own this event")
    );

    await updateParticipants(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: "Unauthorized: You do not own this event",
    });
  });

  it("should return 500 for unexpected errors", async () => {
    const mockError = new Error("Unexpected Error");

    service.updateParticipants.mockRejectedValue(mockError);

    await updateParticipants(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal Server Error",
      error: mockError.message,
    });
  });
});
