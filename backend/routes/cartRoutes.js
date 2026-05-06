const express = require("express");
const cartController = require("../controllers/cartController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);
router.get("/", cartController.getCart);
router.post("/items", cartController.addToCart);
router.patch("/items/:productId", cartController.updateLine);
router.delete("/items/:productId", cartController.removeLine);

module.exports = router;
