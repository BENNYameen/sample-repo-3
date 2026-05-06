const bcrypt = require("bcrypt");
const { query } = require("../models/db");

const ROUNDS = Number(process.env.BCRYPT_ROUNDS) || 10;

async function createUser({ email, password, role = "customer" }) {
  const hash = await bcrypt.hash(password, ROUNDS);
  const res = await query(
    `INSERT INTO users (email, password_hash, role)
     VALUES ($1, $2, $3)
     RETURNING id, email, role, created_at`,
    [email, hash, role]
  );
  return res.rows[0];
}

async function findUserByEmail(email) {
  const res = await query(`SELECT * FROM users WHERE email = $1`, [email]);
  return res.rows[0] || null;
}

async function verifyLogin(email, password) {
  const user = await findUserByEmail(email);
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return null;
  return user;
}

module.exports = { createUser, findUserByEmail, verifyLogin };
