jest.mock("../models/db", () => ({
  query: jest.fn()
}));

jest.mock("bcrypt", () => ({
  hash: jest.fn(async () => "hashed"),
  compare: jest.fn()
}));

const bcrypt = require("bcrypt");
const { query } = require("../models/db");
const authService = require("../services/authService");

describe("authService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("createUser inserts row", async () => {
    query.mockResolvedValueOnce({
      rows: [{ id: "1", email: "a@b.com", role: "customer", created_at: new Date() }]
    });
    const row = await authService.createUser({ email: "a@b.com", password: "x" });
    expect(bcrypt.hash).toHaveBeenCalled();
    expect(row.email).toBe("a@b.com");
  });

  test("verifyLogin returns null on bad password", async () => {
    query.mockResolvedValueOnce({
      rows: [{ id: "1", email: "a@b.com", password_hash: "h" }]
    });
    bcrypt.compare.mockResolvedValueOnce(false);
    const u = await authService.verifyLogin("a@b.com", "wrong");
    expect(u).toBeNull();
  });
});
