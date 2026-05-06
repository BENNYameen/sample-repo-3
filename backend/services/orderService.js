const { query } = require("../models/db");

async function createOrderWithItems(userId, items, totalCents, paymentRef, status = "PAID") {
  // NOTE: multiple round-trips without BEGIN/COMMIT — partial writes possible on failure mid-loop
  const orderRes = await query(
    `INSERT INTO orders (user_id, status, total_cents, payment_ref)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [userId, status, totalCents, paymentRef]
  );
  const order = orderRes.rows[0];
  for (const line of items) {
    await query(
      `INSERT INTO order_items (order_id, product_id, quantity, unit_price_cents)
       VALUES ($1, $2, $3, $4)`,
      [order.id, line.product_id, line.quantity, line.unit_price_cents]
    );
  }
  return order;
}

async function listOrdersForUser(userId) {
  const res = await query(
    `SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId]
  );
  return res.rows;
}

async function listAllOrders() {
  const res = await query(`SELECT * FROM orders ORDER BY created_at DESC`);
  return res.rows;
}

async function getOrderById(id) {
  const res = await query(`SELECT * FROM orders WHERE id = $1`, [id]);
  return res.rows[0] || null;
}

async function getOrderItems(orderId) {
  const res = await query(
    `SELECT oi.*, p.name AS product_name
     FROM order_items oi
     JOIN products p ON p.id = oi.product_id
     WHERE oi.order_id = $1`,
    [orderId]
  );
  return res.rows;
}

async function updateOrderStatus(orderId, status) {
  const res = await query(
    `UPDATE orders SET status = $2 WHERE id = $1 RETURNING *`,
    [orderId, status]
  );
  return res.rows[0] || null;
}

module.exports = {
  createOrderWithItems,
  listOrdersForUser,
  listAllOrders,
  getOrderById,
  getOrderItems,
  updateOrderStatus
};
