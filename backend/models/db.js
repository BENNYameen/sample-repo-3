const { Pool } = require("pg");
require("dotenv").config();

/**
 * Shared pool — callers often forget to use transactions (intentional exercise surface).
 */
const connectionString = process.env.DATABASE_URL;

const pool = new Pool(
  connectionString
    ? { connectionString }
    : {
        host: process.env.PGHOST || "localhost",
        port: Number(process.env.PGPORT) || 5432,
        user: process.env.PGUSER || "postgres",
        password: process.env.PGPASSWORD || "postgres",
        database: process.env.PGDATABASE || "ecommerce_workshop"
      }
);

async function query(text, params) {
  return pool.query(text, params);
}

module.exports = { pool, query };
