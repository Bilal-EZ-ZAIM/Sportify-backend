// code npx jest tests/login.test.js
const User = require("../model/user.model");
const bcryptjs = require("bcryptjs");
const { login } = require("../controller/auth/auth.controller");
const CreateToken = require("../util/createToken");
const envoyerEmail = require("../util/mail");
const { generateRandomCode } = require("../util/generateRandomCode");

jest.mock("../model/user.model");
jest.mock("bcryptjs");
jest.mock("../util/createToken");
jest.mock("../util/mail");
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
    envoyerEmail.mockClear();
    generateRandomCode.mockClear();
  });

  it("should return 404 if the user is not found", async () => {
    User.findOne.mockResolvedValue(null); 

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: "fail",
      message: "Email Or Password not correct.",
    });
  });

  it("should return 404 if the password is incorrect", async () => {
    const user = { email: "john@example.com", password: "hashed_password" };
    User.findOne.mockResolvedValue(user); 
    bcryptjs.compare.mockResolvedValue(false); 

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: "fail",
      message: "Email Or Password not correct.",
    });
  });

  it("should login the user and send an email with the code", async () => {
    const user = {
      id: "user_id",
      email: "john@example.com",
      password: "hashed_password",
    };
    const code = "123456";
    const token = "token";

    User.findOne.mockResolvedValue(user);
    bcryptjs.compare.mockResolvedValue(true);
    generateRandomCode.mockReturnValue(code);
    CreateToken.mockReturnValue(token);
    envoyerEmail.mockResolvedValue(true);

    await login(req, res);

    expect(bcryptjs.compare).toHaveBeenCalledWith(
      "password123",
      "hashed_password"
    );
    expect(CreateToken).toHaveBeenCalledWith({ id: "user_id", code }, "5m");
    expect(envoyerEmail).toHaveBeenCalledWith(
      "john@example.com",
      "verfei accoute par code",
      null,
      code,
      "2FA"
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      data: user,
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
