const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    description: String,

    // 💰 Precio de venta
    price: {
      type: Number,
      required: true
    },

    // 💰 Precio de compra
    purchasePrice: {
      type: Number,
      required: true
    },

    stock: {
      type: Number,
      required: true
    },

    category: String,
    image: String,

    isActive: {
      type: Boolean,
      default: true
    },

    // 🏷 Código único
    productCode: {
      type: String,
      required: true,
      unique: true
    },

    // 📦 Lote
    batchNumber: String,

    // 🏭 Relación con proveedor
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier"
    }

  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);