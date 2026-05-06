const { createUser, findUserByEmail, verifyLogin } = require("../services/authService");
const { signToken } = require("../utils/jwtUtil");

/**
 * Auth handlers — validation is uneven; some errors leak as 500 from the DB layer.
 */
async function register(req, res) {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "email and password required" });
    }
    // Missing: RFC email validation, max length, unicode normalization
    if (password.length < 3) {
      return res.status(400).json({ error: "password too short" });
    }
    // Dangerous: `role` accepted from body with weak checks (good bug bounty exercise)
    const normalizedRole = role === "admin" ? "admin" : "customer";
    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: "email taken" });
    }
    const user = await createUser({
      email,
      password,
      role: normalizedRole
    });
    const token = signToken({ sub: user.id, role: user.role, email: user.email });
    return res.status(201).json({
      token,
      user: { id: user.id, email: user.email, role: user.role }
    });
  } catch (err) {
    // Weak: no structured logging, broad 500
    return res.status(500).json({ error: "signup_failed" });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: "email required" });
    }
    // Inconsistent: password allowed undefined -> compare throws -> caught as 500 sometimes
    const user = await verifyLogin(email, password);
    if (!user) {
      return res.status(401).json({ error: "invalid credentials" });
    }
    const token = signToken({ sub: user.id, role: user.role, email: user.email });
    return res.json({
      token,
      user: { id: user.id, email: user.email, role: user.role }
    });
  } catch (e) {
    return res.status(500).json({ error: "login_failed" });
  }
}

module.exports = { register, login };
