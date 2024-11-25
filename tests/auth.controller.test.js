const request = require("supertest");
const express = require("express");
const app = express();
const {
  regester,
  login,
  getUserById,
} = require("../controller/auth/auth.controller");
const User = require("../model/user.model");
const HashPassword = require("../util/HashPassword");
const CreateToken = require("../util/createToken");
const envoyerEmail = require("../util/mail");
const slug = require("slug");

jest.mock("../model/user.model");
jest.mock("../util/HashPassword");
jest.mock("../util/createToken");
jest.mock("../util/mail");
jest.mock("slug");

app.use(express.json());
app.post("/api/auth/register", regester);
app.get("/api/auth/getUserById/1", getUserById);

describe("POST /api/auth/register", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should process req.body and create a new user", async () => {
    const userData = {
      name: "John Doe",
      email: "john.doe@example.com",
      password: "securepassword",
      confirmPassword: "securepassword",
      phone: "123456789",
    };

    slug.mockReturnValue("john-doe");
    HashPassword.mockResolvedValue("hashed_password");

    User.create.mockResolvedValue({
      _id: "user_id",
      ...userData,
      role: "client",
      slug: "john-doe",
    });

    CreateToken.mockReturnValue("mocked_token");

    envoyerEmail.mockResolvedValue(true);

    const response = await request(app)
      .post("/api/auth/register")
      .send(userData)
      .expect("Content-Type", /json/)
      .expect(201);

    expect(response.body.message).toBe("User created successfully!");
    expect(response.body.user).toBeDefined();
    expect(response.body.token).toBeDefined();

    expect(slug).toHaveBeenCalledWith("John Doe");
    expect(HashPassword).toHaveBeenCalledWith(userData.password);
    expect(User.create).toHaveBeenCalledWith({
      ...userData,
      password: "hashed_password",
      role: "client",
      slug: "john-doe",
    });

    expect(CreateToken).toHaveBeenCalledWith({ id: "user_id" }, "5m");
    expect(envoyerEmail).toHaveBeenCalledWith(
      "john.doe@example.com",
      "verfei accoute",
      "http://localhost:8001/api/auth/verifyAcount/mocked_token",
      null,
      "OTP"
    );
  });

  it("should return an error if registration fails", async () => {
    const userData = {
      name: "John Doe",
      email: "john.doe@example.com",
      password: "securepassword",
      confirmPassword: "securepassword",
      phone: "123456789",
    };

    User.create.mockRejectedValue(new Error("Database error"));

    const response = await request(app)
      .post("/api/auth/register")
      .send(userData)
      .expect(400);

    expect(response.body.message).toBe("An error occurred during registration");
    expect(response.body.error).toBe("Database error");
  });
});

const bcryptjs = require("bcryptjs");
const { generateRandomCode } = require("../util/generateRandomCode");

jest.mock("bcryptjs");
jest.mock("../util/generateRandomCode");

describe("POST /api/auth/login", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        email: "test@example.com",
        password: "password123",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    User.findOne.mockClear();
    bcryptjs.compare.mockClear();
    CreateToken.mockClear();
    envoyerEmail.mockClear();
    generateRandomCode.mockClear();
  });

  it("should return 404 if user is not found", async () => {
    // Simule que l'utilisateur n'existe pas
    User.findOne.mockResolvedValue(null);

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: "fail",
      message: "Email Or Password not correct.",
    });
  });

  it("should return 404 if password is incorrect", async () => {
    // Simule que l'utilisateur est trouvé
    User.findOne.mockResolvedValue({
      email: "test@example.com",
      password: "hashed_password",
    });

    // Simule que la comparaison du mot de passe échoue
    bcryptjs.compare.mockResolvedValue(false);

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: "fail",
      message: "Email Or Password not correct.",
    });
  });

  it("should generate token and send email if login is successful", async () => {
    const user = {
      id: "user_id",
      email: "test@example.com",
      password: "hashed_password",
    };

    // Simule que l'utilisateur est trouvé
    User.findOne.mockResolvedValue(user);

    // Simule que la comparaison du mot de passe réussit
    bcryptjs.compare.mockResolvedValue(true);

    // Simule la génération du code 2FA
    generateRandomCode.mockReturnValue("123456");

    // Simule la génération du token
    CreateToken.mockReturnValue("mocked_token");

    await login(req, res);

    // Vérifie si le token est généré correctement
    expect(CreateToken).toHaveBeenCalledWith(
      { id: "user_id", code: "123456" },
      "5m"
    );

    // Vérifie si l'email est envoyé correctement
    expect(envoyerEmail).toHaveBeenCalledWith(
      "test@example.com",
      "verfei accoute par code",
      null, // confirmationLink
      "123456", // code
      "2FA"
    );

    // Vérifie si la réponse est correcte
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      data: user,
      token: "mocked_token",
    });
  });
});

// test getById

describe("GET /api/auth/getUserById/", () => {
  beforeEach(() => {
    req = {
      params: {
        id: "1"
      },
    };
    jest.clearAllMocks();
  });

  it("should process req.params", async () => {
    const id = 1;

    // قم بمحاكاة النجاح بدلاً من الخطأ
    User.findById.mockResolvedValue({
      id: "1",
      name: "bilal",
    });

    const response = await request(app)
      .get("/api/auth/getUserById/1")
      .expect(200);

    expect(response.body.message).toBe("get user avec success");
    expect(response.body.user).toBeDefined(); 

    expect(User.findById).toHaveBeenCalledWith(1);
  });

  it("should return an error if getUser fails", async () => {
    User.findById.mockRejectedValue(new Error("Database error"));

    const response = await request(app)
      .get("/api/auth/getUserById/1")
      .expect(400);

    expect(response.body.error).toBe("Database error");
  });
});
