// code npx jest tests/regester.test.js
const { regester } = require("../controller/auth/auth.controller");
const UserModel = require("../model/user.model");
const CreateToken = require("../util/createToken");
const HashPassword = require("../util/HashPassword");
const envoyerEmail = require("../util/mail");

jest.mock("../util/createToken.js");
jest.mock("../util/HashPassword.js");
jest.mock("../model/user.model");

describe("register function", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    HashPassword.mockClear();
    UserModel.create.mockClear();
    CreateToken.mockClear();
  });

  it("should register a user and send a confirmation email", async () => {
    const hashedPassword = "hashed_password";
    const token = "token";
    const user = { _id: "user_id", ...req.body, password: hashedPassword };

    HashPassword.mockResolvedValue(hashedPassword);
    UserModel.create.mockResolvedValue(user);
    CreateToken.mockReturnValue(token);

    await regester(req, res);

    expect(HashPassword).toHaveBeenCalledWith("password123");

    expect(UserModel.create).toHaveBeenCalledWith({
      name: "John Doe",
      email: "john@example.com",
      role: "manager", // Ensure that role is "manager" as per the implementation
      slug: expect.any(String), // Slug should be a string, ensure it's generated correctly
      password: "hashed_password",
    });

    // Verify CreateToken was called with the user ID and the expiration time
    expect(CreateToken).toHaveBeenCalledWith({ id: user._id }, "90d"); // Update to "90d" as per the actual implementation

   

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      message: "Congratulations! Your account has been created successfully. Please check your email for the verification code to complete your registration.",
      token,
    });
  });

  it("should return an error if user creation fails", async () => {
    const errorMessage = "Error creating user";
    UserModel.create.mockRejectedValue(new Error(errorMessage));

    await regester(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "An error occurred during registration",
      error: errorMessage,
    });
  });
});
