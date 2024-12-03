// code npx jest tests/login.test.js
const User = require("../model/user.model");
const bcryptjs = require("bcryptjs");
const { login } = require("../controller/auth/auth.controller");
const CreateToken = require("../util/createToken");
const { generateRandomCode } = require("../util/generateRandomCode");

jest.mock("../model/user.model");
jest.mock("bcryptjs");
jest.mock("../util/createToken");
jest.mock("../util/generateRandomCode");

describe("login function", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        email: "john@example.com",
        password: "password123",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Clear mocks before each test
    User.findOne.mockClear();
    bcryptjs.compare.mockClear();
    CreateToken.mockClear();
    generateRandomCode.mockClear();
  });

  it("should return 404 if the user is not found", async () => {
    User.findOne.mockResolvedValue(null);  // Simulate user not found

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: "fail",
      message: "Email Or Password not correct.",
    });
  });

  it("should return 404 if the password is incorrect", async () => {
    const user = { email: "john@example.com", password: "hashed_password" };
    User.findOne.mockResolvedValue(user);  // Simulate user found
    bcryptjs.compare.mockResolvedValue(false);  // Simulate incorrect password

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: "fail",
      message: "Email Or Password not correct.",
    });
  });

  it("should login the user and return a token", async () => {
    const user = {
      id: "user_id",
      email: "john@example.com",
      password: "hashed_password",
    };
    const code = "123456";
    const token = "token";

    User.findOne.mockResolvedValue(user);  // Simulate user found
    bcryptjs.compare.mockResolvedValue(true);  // Simulate correct password
    generateRandomCode.mockReturnValue(code);  // Generate a random code
    CreateToken.mockReturnValue(token);  // Simulate token creation

    await login(req, res);

    expect(bcryptjs.compare).toHaveBeenCalledWith(
      "password123",
      "hashed_password"
    );
    expect(CreateToken).toHaveBeenCalledWith({ id: "user_id", code }, "90d");
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message:
        "You have received an email to verify your account. Please check your inbox and enter the verification code to complete the registration process.",
      token,
    });
  });

  it("should return 404 if an error occurs", async () => {
    User.findOne.mockRejectedValue(new Error("DB error"));

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: new Error("DB error") });
  });
});
