const service = require("../services/event/event.services");
const { createEvent } = require("../controller/event/event.controller");

jest.mock("../services/event/event.services");

describe("Test Unit for createEvent Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        name: "Event Name",
        date: "2024-12-31",
        location: "Event Location",
        description: "Event Description",
        participants: ["Participant1", "Participant2"],
      },
      file: {
        secure_url: "http://example.com/image.jpg",
        public_id: "image123",
      },
      user: {
        id: "user123",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create an event successfully with provided image", async () => {
    const mockEvent = { id: "event123", ...req.body };
    service.createEvent.mockResolvedValue(mockEvent);

    await createEvent(req, res);

    expect(service.createEvent).toHaveBeenCalledWith(expect.anything(), {
      name: req.body.name,
      description: req.body.description,
      date: req.body.date,
      location: req.body.location,
      participants: req.body.participants,
      organisateur: req.user.id,
      event_image: {
        url: req.file.secure_url,
        id: req.file.public_id,
      },
    });

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "L'événement a été créé avec succès!",
      event: mockEvent,
    });
  });

  it("should create an event successfully with default image if no file is provided", async () => {
    req.file = null;
    const mockEvent = { id: "event123", ...req.body };
    service.createEvent.mockResolvedValue(mockEvent);

    await createEvent(req, res);

    expect(service.createEvent).toHaveBeenCalledWith(expect.anything(), {
      name: req.body.name,
      description: req.body.description,
      date: req.body.date,
      location: req.body.location,
      participants: req.body.participants,
      organisateur: req.user.id,
      event_image: {
        url: expect.stringContaining("https://images.unsplash.com"),
        id: null,
      },
    });

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "L'événement a été créé avec succès!",
      event: mockEvent,
    });
  });

  it("should return an error if service.createEvent throws an exception", async () => {
    const mockError = new Error("Database error");
    service.createEvent.mockRejectedValue(mockError);

    await createEvent(req, res);

    expect(service.createEvent).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message:
        "Une erreur est survenue lors de la création de l'événement. Veuillez réessayer plus tard.",
      error: mockError.message,
    });
  });
});
