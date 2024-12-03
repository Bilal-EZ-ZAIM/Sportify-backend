const { verifier2FA } = require("../controller/auth/auth.controller");
const jwt = require("jsonwebtoken");
const User = require("../model/user.model");

jest.mock("jsonwebtoken");
jest.mock("../model/user.model");

describe("verifier2FA function", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        code: "1234",
      },
      params: {
        token: "token",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jwt.verify.mockClear();
    User.findById.mockClear();
  });

  it("should return 401 if the token is not found", async () => {
    req.params.token = null;

    await verifier2FA(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      status: "fail",
      message:
        "Vous n'êtes pas connecté, veuillez vous connecter pour accéder à cette route.",
    });
  });

  it("should return 401 if the user is not found", async () => {
    jwt.verify.mockReturnValue({ id: "userId", code: "1234" });
    User.findById.mockResolvedValue(null);

    await verifier2FA(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      status: "fail",
      message: "L'utilisateur associé à ce token n'existe plus.",
    });
  });

  it("should return 400 if the 2FA code is incorrect", async () => {
    jwt.verify.mockReturnValue({ id: "userId", code: "wrongCode" });
    User.findById.mockResolvedValue({ id: "userId" });

    await verifier2FA(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: "fail",
      message: "Le code de vérification est incorrect.",
    });
  });

  it("should return 200 if the 2FA code is correct", async () => {
    jwt.verify.mockReturnValue({ id: "userId", code: "1234" });
    User.findById.mockResolvedValue({ id: "userId" });

    await verifier2FA(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      message: "Votre authentification a été effectuée avec succès.",
    });
  });

  it("should return 500 for any other errors", async () => {
    jwt.verify.mockImplementationOnce(() => {
      throw new Error("Unknown error");
    });

    await verifier2FA(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: "error",
      message: "Une erreur est survenue. Veuillez réessayer plus tard.",
      error: "Unknown error",
    });
  });
});
