const express = require("express");
const router = express.Router();

const {
  checkoutOrder,
  createStoreOrder,
  getOrders,
  getMyOrders,
  updateOrderStatus,
  payOrder
} = require("../controllers/order.controller");

const { authMiddleware } = require("../middleware/auth.middleware");
const { isAdmin } = require("../middleware/role.middleware");


// ======================================================
// 👤 CLIENTE
// ======================================================

// 🔹 Crear pedido ONLINE desde carrito
router.post("/checkout", authMiddleware, checkoutOrder);

// 🔹 Ver mis pedidos
router.get("/my", authMiddleware, getMyOrders);

// 🔹 Pagar pedido online
router.put("/:id/pay", authMiddleware, payOrder);


// ======================================================
// 🏪 ADMIN / EMPLEADO
// ======================================================

// 🔹 Crear pedido en tienda (POS)
router.post("/store", authMiddleware, isAdmin, createStoreOrder);

// 🔹 Ver todos los pedidos
router.get("/", authMiddleware, isAdmin, getOrders);

// 🔹 Cambiar estado del pedido
router.put("/:id/status", authMiddleware, isAdmin, updateOrderStatus);


module.exports = router;