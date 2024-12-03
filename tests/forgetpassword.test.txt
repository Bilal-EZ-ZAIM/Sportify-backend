// code npx jest tests/forgetpassword.test.js
const User = require("../model/user.model");
const { forgetpassword } = require("../controller/auth/auth.controller");
const CreateToken = require("../util/createToken");
const envoyerEmail = require("../util/mail");
const { generateRandomCode } = require("../util/generateRandomCode");

jest.mock("../model/user.model");
jest.mock("bcryptjs");
jest.mock("../util/createToken");
jest.mock("../util/mail");
jest.mock("../util/generateRandomCode");

describe("forgetpassword function", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        email: "john@example.com",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Clear mocks before each test
    User.findOne.mockClear();
    CreateToken.mockClear();
    envoyerEmail.mockClear();
    generateRandomCode.mockClear();
  });

  it("user not fond ERROR ", async () => {
    // user not fond

    User.findOne.mockResolvedValue(null);

    await forgetpassword(req, res);

    expect(res.status).toHaveBeenCalledWith(404);

    expect(res.json).toHaveBeenCalledWith({
      status: "fail",
      message: "Email is not correct.",
    });
  });

  it("get user and send an email with the code", async () => {
    // user not fond

    const user = {
      id: "user_id",
      email: "john@example.com",
      password: "hashed_password",
    };
    const code = "123456";
    const token = "token";

    User.findOne.mockResolvedValue(user);
    generateRandomCode.mockReturnValue(code);
    CreateToken.mockReturnValue(token);
    envoyerEmail.mockResolvedValue(true);

    await forgetpassword(req, res);

    expect(CreateToken).toHaveBeenCalledWith({ id: "user_id", code }, "5m");
    expect(envoyerEmail).toHaveBeenCalledWith(
      "john@example.com",
      "forgetpassword",
      (confirmationLink = null),
      code,
      "forgetpassword"
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Code to reset password has been sent.",
      token,
    });
  });

  it("should return 500 if an error occurs", async () => {
    User.findOne.mockRejectedValue(new Error("DB error"));

    await forgetpassword(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: "error",
      message: "An error occurred. Please try again later.",
      error: new Error("DB error"),
    });
  });
});
