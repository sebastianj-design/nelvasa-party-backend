const express = require("express");
const router = express.Router();

const Supplier = require("../models/Supplier");
const { authMiddleware } = require("../middleware/auth.middleware");
const { isAdmin } = require("../middleware/role.middleware");

// Crear proveedor
router.post("/", authMiddleware, isAdmin, async (req, res) => {
  const supplier = await Supplier.create(req.body);
  res.json(supplier);
});

// Obtener proveedores
router.get("/", authMiddleware, isAdmin, async (req, res) => {
  const suppliers = await Supplier.find();
  res.json(suppliers);
});

module.exports = router;