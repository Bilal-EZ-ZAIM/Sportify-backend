const { createEvent } = require("../controller/event/event.controller");
const service = require("../services/event/event.services");

jest.mock("../services/event/event.services.js");

describe("createEvent", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        name: "Test Event",
        date: "2024-12-01",
        location: "Test Location",
        description: "Test Description",
        participants: ["user1", "user2"],
        price: 100,
      },
      user: {
        id: "organisateur_id",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  it("should create an event successfully", async () => {
    // Mocking the service response
    const mockEvent = {
      id: "event_id",
      ...req.body,
      organisateur: req.user.id,
    };
    service.createEvent.mockResolvedValue(mockEvent);

    // Call the function
    await createEvent(req, res);

    expect(service.createEvent).toHaveBeenCalledWith(expect.anything(), {
      name: "Test Event",
      date: "2024-12-01",
      location: "Test Location",
      description: "Test Description",
      participants: ["user1", "user2"],
      organisateur: "organisateur_id",
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "L'événement a été créé avec succès!",
      event: mockEvent,
    });
  });

  it("should handle errors gracefully", async () => {
    const mockError = new Error("Database error");
    service.createEvent.mockRejectedValue(mockError);

    await createEvent(req, res);

    expect(service.createEvent).toHaveBeenCalledWith(expect.anything(), {
      name: "Test Event",
      date: "2024-12-01",
      location: "Test Location",
      description: "Test Description",
      participants: ["user1", "user2"],
      organisateur: "organisateur_id",
    });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message:
        "Une erreur est survenue lors de la création de l'événement. Veuillez réessayer plus tard.",
      error: mockError.message,
    });
  });
});
