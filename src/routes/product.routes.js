const express = require("express");
const router = express.Router();

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require("../controllers/product.controller");

const { authMiddleware } = require("../middleware/auth.middleware");
const { isAdmin } = require("../middleware/role.middleware");

// Admin
router.post("/", authMiddleware, isAdmin, createProduct);
router.put("/:id", authMiddleware, isAdmin, updateProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);

// Público / Cliente
router.get("/", getProducts);
router.get("/:id", getProductById);

module.exports = router;
