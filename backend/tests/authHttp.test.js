jest.mock("../services/authService", () => ({
  createUser: jest.fn(),
  findUserByEmail: jest.fn(),
  verifyLogin: jest.fn()
}));

jest.mock("../utils/jwtUtil", () => ({
  signToken: jest.fn(() => "fake.jwt.token")
}));

const request = require("supertest");
const app = require("../server");
const authService = require("../services/authService");

describe("auth HTTP (partial)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("register 400 when missing password", async () => {
    const res = await request(app).post("/api/auth/register").send({ email: "a@b.com" });
    expect(res.status).toBe(400);
  });

  test("register 201 happy path", async () => {
    authService.findUserByEmail.mockResolvedValue(null);
    authService.createUser.mockResolvedValue({
      id: "uid",
      email: "a@b.com",
      role: "customer"
    });
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "a@b.com", password: "secret" });
    expect(res.status).toBe(201);
    expect(res.body.token).toBe("fake.jwt.token");
  });
});
