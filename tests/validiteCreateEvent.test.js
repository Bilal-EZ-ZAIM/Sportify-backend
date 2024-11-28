const express = require("express");
const request = require("supertest");
const { validationResult } = require("express-validator");
const { validiteCreateEvent } = require("../validation/event/event.validation"); 

const createTestApp = (middleware) => {
  const app = express();
  app.use(express.json());
  app.post("/events", middleware, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    res.status(200).json({ message: "Event created successfully" });
  });
  return app;
};

describe("validiteCreateEvent Middleware Tests", () => {
  let app;

  beforeAll(() => {
    app = createTestApp(validiteCreateEvent);
  });

  test("should return error if name is empty", async () => {
    const response = await request(app)
      .post("/events")
      .send({
        date: "2024-12-01",
        location: "New York",
        description: "Sample description",
        participants: ["John", "Jane"],
      });

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          msg: "Event name is required",
          param: "name",
        }),
      ])
    );
  });

  test("should return error if date is invalid", async () => {
    const response = await request(app)
      .post("/events")
      .send({
        name: "Test Event",
        date: "invalid-date",
        location: "New York",
        description: "Sample description",
        participants: ["John", "Jane"],
      });

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          msg: "Invalid event date format",
          param: "date",
        }),
      ])
    );
  });

  test("should return success if all data is valid", async () => {
    const response = await request(app)
      .post("/events")
      .send({
        name: "Valid Event Name",
        date: "2024-12-01",
        location: "New York",
        description: "This is a valid description",
        participants: ["John", "Jane"],
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Event created successfully");
  });
});
