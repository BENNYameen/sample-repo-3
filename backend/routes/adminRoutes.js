const express = require("express");
const adminController = require("../controllers/adminController");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// Intentional flaw: global admin guard omitted — some routes forget requireAdmin
router.get("/orders", requireAuth, requireAdmin, adminController.listAllOrders);

// BUG: customers can change order state if they know an order UUID
router.patch("/orders/:id/status", requireAuth, adminController.patchOrderStatus);

router.post("/products", requireAuth, requireAdmin, adminController.admin_createProduct);
router.patch("/products/:id", requireAuth, requireAdmin, adminController.admin_updateProduct);

module.exports = router;
