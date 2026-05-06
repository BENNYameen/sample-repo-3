const express = require("express");
const orderController = require("../controllers/orderController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);
router.post("/", orderController.placeOrder);
router.get("/", orderController.myOrders);
router.get("/:id", orderController.getOrderDetail);

module.exports = router;
