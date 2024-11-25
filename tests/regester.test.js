// code npx jest tests/regester.test.js
const { regester } = require("../controller/auth/auth.controller");
const UserModel = require("../model/user.model");
const CreateToken = require("../util/createToken");
const HashPassword = require("../util/HashPassword");
const envoyerEmail = require("../util/mail");

jest.mock("../util/createToken.js");
jest.mock("../util/mail.js");
jest.mock("../util/HashPassword.js");
jest.mock("../model/user.model");

describe("register function", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        name: "John Doe",
        email: "john@example.com",
        password: "password123", // Original password used in request body
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    HashPassword.mockClear();
    UserModel.create.mockClear();
    CreateToken.mockClear();
    envoyerEmail.mockClear();
  });

  it("should register a user and send a confirmation email", async () => {
    // Expected values
    const hashedPassword = "hashed_password"; // Mocked hashed password
    const token = "token"; // Mocked token
    const user = { _id: "user_id", ...req.body, password: hashedPassword }; // Expected user object

    // Mock the utility functions with the expected values
    HashPassword.mockResolvedValue(hashedPassword); // Return the hashed password
    UserModel.create.mockResolvedValue(user); // Simulate user creation with UserModel.create
    CreateToken.mockReturnValue(token); // Mock CreateToken to return a token
    envoyerEmail.mockResolvedValue(true); // Mock envoyerEmail to resolve successfully

    await regester(req, res); // Call the register function

    // Verify HashPassword was called with the original password
    expect(HashPassword).toHaveBeenCalledWith("password123"); // Explicitly match the original password

    // Verify UserModel.create was called with the expected values
    expect(UserModel.create).toHaveBeenCalledWith({
      name: "John Doe",
      email: "john@example.com",
      role: "client", // Assuming default role is client
      slug: expect.any(String), // slug should be a string
      password: "hashed_password", // The value returned by HashPassword mock
    });

    // Verify CreateToken was called with the user ID and the expiration time
    expect(CreateToken).toHaveBeenCalledWith({ id: user._id }, "5m");

    // Verify envoyerEmail was called correctly
    expect(envoyerEmail).toHaveBeenCalledWith(
      user.email,
      "verfei accoute",
      `http://localhost:8001/api/auth/verifyAcount/${token}`,
      null,
      "OTP"
    );

    // Verify the response status and JSON response
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "User created successfully!",
      user,
      token,
    });
  });
});
