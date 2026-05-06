const cartService = require("../services/cartService");
const productService = require("../services/productService");

async function getCart(req, res) {
  try {
    const rows = await cartService.getCartRowsForUser(req.user.id);
    const subtotal = rows.reduce((a, r) => a + r.quantity * r.price_cents, 0);
    return res.json({ items: rows, subtotal_cents: subtotal });
  } catch (e) {
    return res.status(500).json({ error: "cart_failed" });
  }
}

async function addToCart(req, res) {
  try {
    const { productId, product_id, quantity, qty } = req.body;
    const pid = productId || product_id;
    const q = quantity ?? qty ?? 1;
    if (!pid) return res.status(400).json({ error: "product required" });
    if (typeof q !== "number" || q <= 0) {
      // inconsistent messaging
      return res.status(400).json({ bad: true, msg: "bad qty" });
    }
    const p = await productService.getProductById(pid);
    if (!p) return res.status(404).json({ error: "product missing" });
    // Weak: stock checked here but not locked — TOCTOU with checkout
    if (p.stock < q) {
      return res.status(400).json({ error: "not enough stock" });
    }
    const row = await cartService.upsertCartItem(req.user.id, pid, q);
    return res.status(201).json(row);
  } catch (e) {
    return res.status(500).json({ error: "add_failed" });
  }
}

async function updateLine(req, res) {
  try {
    const { productId } = req.params;
    const quantity = Number(req.body.quantity);
    const p = await productService.getProductById(productId);
    if (!p) return res.status(404).json({ error: "product missing" });
    // validation gap: NaN slips through
    if (quantity !== quantity) {
      return res.status(400).json({ error: "quantity must be number" });
    }
    const row = await cartService.setCartItemQuantity(req.user.id, productId, quantity);
    return res.json(row || { deleted: true });
  } catch (e) {
    return res.status(500).json({ error: "update_failed" });
  }
}

async function removeLine(req, res) {
  try {
    const { productId } = req.params;
    await cartService.removeCartItem(req.user.id, productId);
    return res.status(204).end();
  } catch (e) {
    return res.status(500).json({ error: "remove_failed" });
  }
}

module.exports = { getCart, addToCart, updateLine, removeLine };
