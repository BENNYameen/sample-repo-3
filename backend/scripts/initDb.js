/**
 * Loads sql/init.sql against DATABASE_URL / PG* env.
 */
const fs = require("fs");
const path = require("path");
const { pool } = require("../models/db");

async function main() {
  const sqlPath = path.join(__dirname, "..", "sql", "init.sql");
  const sql = fs.readFileSync(sqlPath, "utf8");
  const client = await pool.connect();
  try {
    await client.query(sql);
    console.log("Schema initialized.");
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
