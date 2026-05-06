const { verifyToken } = require("../utils/jwtUtil");

function extractBearer(headerVal) {
  if (!headerVal || typeof headerVal !== "string") return null;
  const [type, token] = headerVal.split(" ");
  if (type !== "Bearer" || !token) return null;
  return token;
}

function requireAuth(req, res, next) {
  const token = extractBearer(req.headers.authorization);
  if (!token) {
    return res.status(401).json({ error: "missing token" });
  }
  try {
    const decoded = verifyToken(token);
    req.user = { id: decoded.sub, role: decoded.role, email: decoded.email };
    next();
  } catch (e) {
    return res.status(401).json({ error: "bad token" });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "admin only" });
  }
  next();
}

// Duplicate-ish export name vs requireAdmin for "legacy" routes (confusing on purpose)
const adminOnly = requireAdmin;

module.exports = { requireAuth, requireAdmin, adminOnly, extractBearer };
