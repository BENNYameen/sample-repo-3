const orderService = require("../services/orderService");
const productService = require("../services/productService");
const { assertTransition } = require("./orderController");

async function listAllOrders(_req, res) {
  try {
    const orders = await orderService.listAllOrders();
    return res.json({ orders });
  } catch (e) {
    return res.status(500).json({ error: "admin_orders_failed" });
  }
}

async function patchOrderStatus(req, res) {
  try {
    const { status } = req.body;
    const order = await orderService.getOrderById(req.params.id);
    if (!order) return res.status(404).json({ error: "not found" });
    if (!assertTransition(order.status, status)) {
      return res.status(400).json({ error: "illegal transition", from: order.status, to: status });
    }
    const updated = await orderService.updateOrderStatus(order.id, status);
    return res.json(updated);
  } catch (e) {
    return res.status(500).json({ error: "status_failed" });
  }
}

async function admin_createProduct(req, res) {
  try {
    const { name, description, price_cents, stock, category_id } = req.body;
    if (!name || price_cents === undefined) {
      return res.status(400).json({ error: "name and price_cents required" });
    }
    const p = await productService.createProduct({
      name,
      description,
      price_cents: Number(price_cents),
      stock: stock === undefined ? 0 : Number(stock),
      category_id
    });
    return res.status(201).json(p);
  } catch (e) {
    return res.status(500).json({ error: "create_product_failed" });
  }
}

async function admin_updateProduct(req, res) {
  try {
    const updated = await productService.updateProduct(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: "not found" });
    return res.json(updated);
  } catch (e) {
    return res.status(500).json({ error: "update_product_failed" });
  }
}

module.exports = {
  listAllOrders,
  patchOrderStatus,
  admin_createProduct,
  admin_updateProduct
};
