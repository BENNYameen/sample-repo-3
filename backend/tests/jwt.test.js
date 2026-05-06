const { signToken, verifyToken } = require("../utils/jwtUtil");

describe("jwtUtil", () => {
  test("round-trip token", () => {
    const t = signToken({ sub: "u1", role: "customer", email: "a@b.c" });
    const d = verifyToken(t);
    expect(d.sub).toBe("u1");
    expect(d.role).toBe("customer");
  });
});
