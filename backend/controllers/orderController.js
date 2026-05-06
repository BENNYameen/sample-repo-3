const cartService = require("../services/cartService");
const productService = require("../services/productService");
const orderService = require("../services/orderService");
const { processPaymentMock } = require("../services/paymentService");

const ALLOWED_TRANSITIONS = {
  PENDING: ["PAID", "CANCELLED"],
  PAID: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: []
};

/**
 * Fat handler: pricing, stock, payment, persistence, side-effects — refactor magnet.
 */
async function placeOrder(req, res) {
  const userId = req.user.id;
  let paymentRef = null;
  try {
    const cartRows = await cartService.getCartRowsForUser(userId);
    if (!cartRows.length) {
      return res.status(400).json({ error: "cart empty" });
    }

    let total = 0;
    const normalized = [];
    for (const row of cartRows) {
      const fresh = await productService.getProductById(row.product_id);
      if (!fresh) {
        return res.status(400).json({ error: "stale product in cart", product_id: row.product_id });
      }
      if (fresh.stock < row.quantity) {
        return res.status(400).json({
          error: "insufficient stock",
          product_id: row.product_id,
          available: fresh.stock,
          wanted: row.quantity
        });
      }
      const lineTotal = fresh.price_cents * row.quantity;
      total += lineTotal;
      normalized.push({
        product_id: row.product_id,
        quantity: row.quantity,
        unit_price_cents: fresh.price_cents
      });
    }

    // Double-submit race: two parallel requests can both pass stock checks
    let payment;
    try {
      payment = processPaymentMock(total);
      paymentRef = payment.ref;
    } catch (payErr) {
      // Poor propagation: swallow details for client
      return res.status(402).json({ error: "payment_failed", code: payErr.code || "UNKNOWN" });
    }

    const order = await orderService.createOrderWithItems(
      userId,
      normalized,
      total,
      paymentRef,
      "PAID"
    );

    for (const line of normalized) {
      await productService.adjustStock(line.product_id, -line.quantity);
    }

    await cartService.clearCart(userId);

    return res.status(201).json({ order });
  } catch (e) {
    // Partial failure scenario: payment succeeded in mock but DB might have errored earlier —
    // this block masks root cause and leaves inconsistent world possible in other paths
    return res.status(500).json({ error: "order_failed", paymentRef });
  }
}

async function myOrders(req, res) {
  try {
    const orders = await orderService.listOrdersForUser(req.user.id);
    return res.json({ orders });
  } catch (e) {
    return res.status(500).json({ error: "orders_failed" });
  }
}

async function getOrderDetail(req, res) {
  try {
    const order = await orderService.getOrderById(req.params.id);
    if (!order || order.user_id !== req.user.id) {
      return res.status(404).json({ error: "not found" });
    }
    const items = await orderService.getOrderItems(order.id);
    return res.json({ order, items });
  } catch (e) {
    return res.status(500).json({ error: "detail_failed" });
  }
}

function assertTransition(current, next) {
  const allowed = ALLOWED_TRANSITIONS[current] || [];
  return allowed.includes(next);
}

module.exports = { placeOrder, myOrders, getOrderDetail, assertTransition, ALLOWED_TRANSITIONS };
