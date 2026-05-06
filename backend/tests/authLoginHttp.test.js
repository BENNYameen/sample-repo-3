jest.mock("../services/authService", () => ({
  verifyLogin: jest.fn(),
  findUserByEmail: jest.fn(),
  createUser: jest.fn()
}));

jest.mock("../utils/jwtUtil", () => ({
  signToken: jest.fn(() => "t")
}));

const request = require("supertest");
const app = require("../server");
const authService = require("../services/authService");

describe("auth login HTTP smoke", () => {
  test("401 valid shape", async () => {
    authService.verifyLogin.mockResolvedValue(null);
    const res = await request(app).post("/api/auth/login").send({
      email: "x@y.z",
      password: "nope"
    });
    expect(res.status).toBe(401);
  });
});
