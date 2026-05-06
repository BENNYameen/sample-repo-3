const productService = require("../services/productService");
const { query } = require("../models/db");

/**
 * Duplicated listing logic vs `productService.listProductsByCategory` — drift risk.
 */
async function listProducts(req, res) {
  try {
    const { categoryId, category_id } = req.query;
    const cat = categoryId || category_id;
    if (cat) {
      const rows = await productService.listProductsByCategory(cat);
      return res.json({ products: rows });
    }
    // duplicate-ish inline query path for "featured" toggles that never shipped
    const bulky = await query(
      `SELECT p.*, c.name AS category_name
       FROM products p
       LEFT JOIN categories c ON c.id = p.category_id
       ORDER BY p.created_at DESC`
    );
    return res.json({ products: bulky.rows });
  } catch (err) {
    return res.status(500).json({ error: "list_failed" });
  }
}

async function getProduct(req, res) {
  try {
    const row = await productService.getProductById(req.params.id);
    if (!row) return res.status(404).json({ error: "not found" });
    return res.json(row);
  } catch (e) {
    return res.status(500).json({ error: "get_failed" });
  }
}

async function listCategories(_req, res) {
  try {
    const cats = await productService.listCategories();
    return res.json({ categories: cats });
  } catch (e) {
    return res.status(500).json({ error: "categories_failed" });
  }
}

module.exports = { listProducts, getProduct, listCategories };
