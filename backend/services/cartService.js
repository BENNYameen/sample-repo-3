const { query } = require("../models/db");

async function getCartRowsForUser(userId) {
  const res = await query(
    `SELECT ci.id, ci.quantity, p.id AS product_id, p.name, p.price_cents, p.stock
     FROM cart_items ci
     JOIN products p ON p.id = ci.product_id
     WHERE ci.user_id = $1`,
    [userId]
  );
  return res.rows;
}

async function upsertCartItem(userId, productId, quantity) {
  // Intentionally no transaction with stock read — race window
  const res = await query(
    `INSERT INTO cart_items (user_id, product_id, quantity)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, product_id)
     DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity
     RETURNING *`,
    [userId, productId, quantity]
  );
  return res.rows[0];
}

async function setCartItemQuantity(userId, productId, quantity) {
  if (quantity <= 0) {
    await query(`DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2`, [
      userId,
      productId
    ]);
    return null;
  }
  const res = await query(
    `INSERT INTO cart_items (user_id, product_id, quantity)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, product_id)
     DO UPDATE SET quantity = EXCLUDED.quantity
     RETURNING *`,
    [userId, productId, quantity]
  );
  return res.rows[0];
}

async function removeCartItem(userId, productId) {
  await query(`DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2`, [
    userId,
    productId
  ]);
}

async function clearCart(userId) {
  await query(`DELETE FROM cart_items WHERE user_id = $1`, [userId]);
}

module.exports = {
  getCartRowsForUser,
  upsertCartItem,
  setCartItemQuantity,
  removeCartItem,
  clearCart
};
