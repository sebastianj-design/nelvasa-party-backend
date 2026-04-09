const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // No obligatorio (permitir pedidos de invitados)
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    orderType: {
      type: String,
      enum: ["online", "store"],
      required: true
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product"
        },
        name: String,
        price: Number,
        quantity: Number
      }
    ],
    totalAmount: {
      type: Number,
      required: true
    },
    // 👇 NUEVOS CAMPOS PARA DELIVERY
    customerName: {
      type: String,
      required: function() { return this.orderType === "online"; }
    },
    customerEmail: {
      type: String,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: function() { return this.orderType === "online"; }
    },
    address: {
      type: String,
      required: function() { return this.orderType === "online"; }
    },
    deliveryDate: {
      type: Date,
      required: function() { return this.orderType === "online"; }
    },
    deliveryInstructions: {
      type: String
    },
    status: {
      type: String,
      enum: ["pendiente", "pagado", "enviado", "entregado", "cancelado"],
      default: "pendiente"
    },
    paymentMethod: {
      type: String,
      enum: ["tarjeta", "transferencia", "efectivo"]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);