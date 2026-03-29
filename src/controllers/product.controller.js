const Product = require("../models/Product");

// ======================================================
// 📦 CREAR PRODUCTO
// ======================================================
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      purchasePrice,
      stock,
      category,
      image,
      productCode,
      batchNumber,
      supplier
    } = req.body;

    // 🔒 Validación básica
    if (!name || !price || !stock || !productCode || !purchasePrice) {
      return res.status(400).json({
        message: "Faltan campos obligatorios"
      });
    }

    // 🔒 Evitar duplicados por código
    const existing = await Product.findOne({ productCode });
    if (existing) {
      return res.status(400).json({
        message: "El código de producto ya existe"
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      purchasePrice,
      stock,
      category,
      image,
      productCode,
      batchNumber,
      supplier
    });

    res.status(201).json(product);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ======================================================
// 📦 OBTENER TODOS LOS PRODUCTOS
// ======================================================
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("supplier", "name phone email");

    res.json(products);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ======================================================
// 📦 OBTENER PRODUCTO POR ID
// ======================================================
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("supplier", "name phone email");

    if (!product) {
      return res.status(404).json({
        message: "Producto no encontrado"
      });
    }

    res.json(product);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ======================================================
// ✏️ ACTUALIZAR PRODUCTO
// ======================================================
exports.updateProduct = async (req, res) => {
  try {
    const {
      productCode
    } = req.body;

    // 🔒 Validar código duplicado si se actualiza
    if (productCode) {
      const existing = await Product.findOne({
        productCode,
        _id: { $ne: req.params.id }
      });

      if (existing) {
        return res.status(400).json({
          message: "El código de producto ya existe"
        });
      }
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("supplier", "name phone email");

    if (!product) {
      return res.status(404).json({
        message: "Producto no encontrado"
      });
    }

    res.json(product);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// ======================================================
// ❌ ELIMINAR PRODUCTO
// ======================================================
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Producto no encontrado"
      });
    }

    res.json({
      message: "Producto eliminado correctamente"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};