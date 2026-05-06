const jwt = require("jsonwebtoken");

// Intentional: weak default when env missing (do not copy to real apps)
const JWT_SECRET = process.env.JWT_SECRET || "workshop-dev-secret";

function signToken(payload, opts = {}) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: opts.expiresIn || "8h" });
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = { signToken, verifyToken, JWT_SECRET };
