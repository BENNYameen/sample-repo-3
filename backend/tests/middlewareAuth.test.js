jest.mock("../utils/jwtUtil", () => ({
  verifyToken: jest.fn()
}));

const { verifyToken } = require("../utils/jwtUtil");
const { requireAuth, requireAdmin } = require("../middleware/auth");

describe("middleware auth", () => {
  test("requireAuth 401 when no header", () => {
    const req = { headers: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    requireAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test("requireAuth sets user on valid token", () => {
    verifyToken.mockReturnValue({ sub: "u1", role: "customer", email: "a@b.c" });
    const req = { headers: { authorization: "Bearer tok" } };
    const res = { status: jest.fn(), json: jest.fn() };
    const next = jest.fn();
    requireAuth(req, res, next);
    expect(req.user.id).toBe("u1");
    expect(next).toHaveBeenCalled();
  });

  test("requireAdmin blocks customer", () => {
    const req = { user: { role: "customer" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    requireAdmin(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
  });
});
