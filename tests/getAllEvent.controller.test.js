// npx jest getAllEvent.controller.test.js
jest.mock("../model/event/event.model.js", () => jest.fn());

const { getAllEvents } = require("../controller/event/event.controller");
const service = require("../services/event/event.services");
const Model = require("../model/event/event.model");

jest.mock("../services/event/event.services", () => ({
  getAllEvents: jest.fn(),
}));

describe("getAllEvents Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      query: {
        page: 1,
        limit: 6,
        filter: JSON.stringify({ organisateur: "mockUserId" }),
        populate: {
          path: "organisateur",
          select: "name email",
        },
        selectFields: "",
      },
      user: { id: "mockUserId" },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should return data successfully when service resolves", async () => {
    const mockData = {
      events: [
        { id: "event1", name: "Event 1", organisateur: "mockUserId" },
        { id: "event2", name: "Event 2", organisateur: "mockUserId" },
      ],
      total: 2,
      page: 1,
      limit: 6,
    };

    service.getAllEvents.mockResolvedValue(mockData);

    await getAllEvents(req, res);

    expect(service.getAllEvents).toHaveBeenCalledWith(
      Model, 
      1,
      6,
      { organisateur: "mockUserId" },
      {
        path: "organisateur",
        select: "name email",
      },
      ""
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockData);
  });

  test("should return error if service throws an error", async () => {
    const mockError = new Error("Something went wrong");

    service.getAllEvents.mockRejectedValue(mockError);

    await getAllEvents(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Something went wrong" });
  });
});
