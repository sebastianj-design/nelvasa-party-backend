const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: function () {
        return this.orderType === "online";
      }
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

    deliveryDate: {
      type: Date,
      required: function () {
        return this.orderType === "online";
      }
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