const bcrypt = require("bcrypt");
const { pool } = require("../models/db");

const ROUNDS = Number(process.env.BCRYPT_ROUNDS) || 10;

async function run() {
  const client = await pool.connect();
  try {
    const adminHash = await bcrypt.hash("Admin123!", ROUNDS);
    const userHash = await bcrypt.hash("User123!", ROUNDS);

    const adminEmail = "admin@example.com";
    const userEmail = "customer@example.com";

    await client.query("DELETE FROM order_items");
    await client.query("DELETE FROM orders");
    await client.query("DELETE FROM cart_items");
    await client.query("DELETE FROM products");
    await client.query("DELETE FROM categories");
    await client.query("DELETE FROM users");

    await client.query(
      `INSERT INTO users (email, password_hash, role) VALUES ($1, $2, 'admin') RETURNING id`,
      [adminEmail, adminHash]
    );
    await client.query(`INSERT INTO users (email, password_hash, role) VALUES ($1, $2, 'customer')`, [
      userEmail,
      userHash
    ]);

    const cElectronics = await client.query(
      `INSERT INTO categories (name) VALUES ('Electronics') RETURNING id`
    );
    const cHome = await client.query(`INSERT INTO categories (name) VALUES ('Home') RETURNING id`);

    const catE = cElectronics.rows[0].id;
    const catH = cHome.rows[0].id;

    const products = [
      ["Noise-Cancelling Headphones", "Over-ear, USB-C charging", 19900, 40, catE],
      ["Mechanical Keyboard", "Hot-swap, tactile switches", 12950, 25, catE],
      ["4K Monitor", "IPS, 27 inch", 34900, 10, catE],
      ["Desk Lamp", "Warm LED", 3499, 100, catH],
      ["Notebook Set", "3-pack dotted", 1299, 200, catH]
    ];

    for (const [name, desc, price, stock, cat] of products) {
      await client.query(
        `INSERT INTO products (name, description, price_cents, stock, category_id)
         VALUES ($1, $2, $3, $4, $5)`,
        [name, desc, price, stock, cat]
      );
    }

    console.log("Seed complete.");
    console.log(`Admin login: ${adminEmail} / Admin123!`);
    console.log(`Customer login: ${userEmail} / User123!`);
    console.log("(Passwords are for local workshops only.)");
  } finally {
    client.release();
    await pool.end();
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
