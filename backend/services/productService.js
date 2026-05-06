const { query } = require("../models/db");

/**
 * Product queries — N+1 style listing left in places; duplicated filter SQL in controller too.
 */
async function listAllProducts() {
  const res = await query(
    `SELECT p.*, c.name AS category_name
     FROM products p
     LEFT JOIN categories c ON c.id = p.category_id
     ORDER BY p.created_at DESC`
  );
  return res.rows;
}

async function listProductsByCategory(categoryId) {
  // Inefficient: could use index-only scan pattern; kept simple
  const res = await query(
    `SELECT p.*, c.name AS category_name
     FROM products p
     LEFT JOIN categories c ON c.id = p.category_id
     WHERE p.category_id = $1
     ORDER BY p.name ASC`,
    [categoryId]
  );
  return res.rows;
}

async function getProductById(id) {
  const res = await query(
    `SELECT p.*, c.name AS category_name
     FROM products p
     LEFT JOIN categories c ON c.id = p.category_id
     WHERE p.id = $1`,
    [id]
  );
  return res.rows[0] || null;
}

async function createProduct({ name, description, price_cents, stock, category_id }) {
  const res = await query(
    `INSERT INTO products (name, description, price_cents, stock, category_id)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [name, description, price_cents, stock, category_id || null]
  );
  return res.rows[0];
}

async function updateProduct(id, fields) {
  const keys = ["name", "description", "price_cents", "stock", "category_id"].filter(
    (k) => Object.prototype.hasOwnProperty.call(fields, k)
  );
  if (!keys.length) return getProductById(id);
  const sets = keys.map((k, i) => `${k} = $${i + 2}`).join(", ");
  const values = keys.map((k) => fields[k]);
  const res = await query(
    `UPDATE products SET ${sets} WHERE id = $1 RETURNING *`,
    [id, ...values]
  );
  return res.rows[0] || null;
}

async function adjustStock(productId, delta) {
  const res = await query(
    `UPDATE products SET stock = stock + $2 WHERE id = $1 RETURNING *`,
    [productId, delta]
  );
  return res.rows[0] || null;
}

async function listCategories() {
  const res = await query(`SELECT * FROM categories ORDER BY name`);
  return res.rows;
}

module.exports = {
  listAllProducts,
  listProductsByCategory,
  getProductById,
  createProduct,
  updateProduct,
  adjustStock,
  listCategories
};
