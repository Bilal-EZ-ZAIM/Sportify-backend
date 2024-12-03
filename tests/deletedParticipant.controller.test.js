const {
  deleteParticipants,
} = require("../controller/participants/participants.controller");
const service = require("../services/participants/participants.services");

jest.mock("../services/participants/participants.services");

describe("deleteParticipants", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: "123" },
      user: { id: "456" },
    };

    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  it("should delete the participant and return a success message", async () => {
    service.deleteParticipants.mockResolvedValue({ participantId: "123" });

    await deleteParticipants(req, res);

    expect(service.deleteParticipants).toHaveBeenCalledWith(
      expect.anything(),
      "123",
      "456"
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Participant deleted successfully",
      data: { participantId: "123" },
    });
  });

  it("should return 404 if the participant is not found", async () => {
    service.deleteParticipants.mockRejectedValue(
      new Error("Participant not found for the specified ID")
    );

    // Act
    await deleteParticipants(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Participant not found for the specified ID",
    });
  });

  it("should return 403 if the user is not authorized", async () => {
    service.deleteParticipants.mockRejectedValue(
      new Error("Unauthorized: You do not own this event")
    );

    // Act
    await deleteParticipants(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: "Unauthorized: You do not own this event",
    });
  });

  it("should return 500 for an internal server error", async () => {
    service.deleteParticipants.mockRejectedValue(new Error("Some error"));

    // Act
    await deleteParticipants(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal Server Error",
      error: "Some error",
    });
  });
});
