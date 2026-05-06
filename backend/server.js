const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "ecommerce-backend" });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  res.status(500).json({ error: "unhandled" });
});

const PORT = process.env.PORT || 3001;

function start() {
  app.listen(PORT, () => {
    console.log(`API listening on ${PORT}`);
  });
}

if (require.main === module) {
  start();
}

module.exports = app;
