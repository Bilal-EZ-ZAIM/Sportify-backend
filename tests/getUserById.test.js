// code npx jest tests/getUserById.test.js
const User = require("../model/user.model");
const { getUserById } = require("../controller/auth/auth.controller");

jest.mock("../model/user.model");

describe("login function", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {
        id: "user_id",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Clear mocks before each test
    User.findOne.mockClear();
  });

  it("should get user by id", async () => {
    const user = {
      id: "user_id",
      email: "john@example.com",
      password: "hashed_password",
    };

    User.findById.mockResolvedValue(user);

    await getUserById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "get user avec success",
      user,
    });
  });

  it("should return 400 if an error occurs", async () => {
    User.findById.mockRejectedValue(new Error("DB error"));

    await getUserById(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: new Error("DB error").message });
  });
});
