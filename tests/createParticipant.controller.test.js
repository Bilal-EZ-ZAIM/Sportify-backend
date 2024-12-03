const {
  createParticipants,
} = require("../controller/participants/participants.controller");
const service = require("../services/participants/participants.services");

jest.mock("../services/participants/participants.services"); 

describe("createParticipants controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        username: "John Doe",
        event: "event123",
        email: "johndoe@example.com",
        phone: "123456789",
      },
      user: {
        id: "organisateur123",
        _id: "organisateur123",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  it("should create a participant successfully", async () => {
    const mockParticipant = {
      id: "participant123",
      username: "John Doe",
      event: "event123",
      email: "johndoe@example.com",
      phone: "123456789",
      organisateur: "organisateur123",
    };

    service.createParticipants.mockResolvedValue(mockParticipant); 

    await createParticipants(req, res);

    expect(service.createParticipants).toHaveBeenCalledWith(
      expect.anything(), 
      {
        username: "John Doe",
        event: "event123",
        email: "johndoe@example.com",
        phone: "123456789",
        organisateur: "organisateur123",
      },
      "organisateur123" 
    );

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Participant created successfully",
      participant: mockParticipant,
    });
  });

  it("should return a 500 error when the service throws an error", async () => {
    const mockError = new Error("Internal Server Error");
    service.createParticipants.mockRejectedValue(mockError);

    await createParticipants(req, res);

    expect(service.createParticipants).toHaveBeenCalledWith(
      expect.anything(),
      {
        username: "John Doe",
        event: "event123",
        email: "johndoe@example.com",
        phone: "123456789",
        organisateur: "organisateur123",
      },
      "organisateur123"
    );

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: mockError.message,
    });
  });
});
