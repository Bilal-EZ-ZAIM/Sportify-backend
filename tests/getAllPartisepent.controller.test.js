// npx jest getAllPartisepent.controller.test.js
jest.mock("../model/participants/participants.model.js", () => jest.fn());

const {
  getAllParticipants,
} = require("../controller/participants/participants.controller");
const service = require("../services/participants/participants.services");
const Model = require("../model/participants/participants.model");

jest.mock("../services/participants/participants.services", () => ({
  getAllParticipants: jest.fn(),
}));

describe("getAllParticipants Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      query: {
        page: 1,
        limit: 10,
        filter: JSON.stringify({ organisateur: "mockUserId" }),
        populate: {
          path: "event",
          select: "name",
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

    service.getAllParticipants.mockResolvedValue(mockData);

    await getAllParticipants(req, res);

    expect(service.getAllParticipants).toHaveBeenCalledWith(
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

    service.getAllParticipants.mockRejectedValue(mockError);

    await getAllParticipants(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Something went wrong" });
  });
});
