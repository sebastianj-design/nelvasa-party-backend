const Cart = require("../models/Cart");
const Product = require("../models/Product");

// 🔹 Obtener carrito del usuario
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id })
      .populate("items.product");

    if (!cart) {
      return res.json({
        items: [],
        totalAmount: 0
      });
    }

    let totalAmount = 0;

    cart.items.forEach(item => {
      totalAmount += item.product.price * item.quantity;
    });

    res.json({
      _id: cart._id,
      user: cart.user,
      items: cart.items,
      totalAmount
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Agregar producto al carrito
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);

    if (!product || !product.isActive) {
      return res.status(404).json({ message: "Producto no disponible" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: "Stock insuficiente" });
    }

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = new Cart({
        user: req.user.id,
        items: []
      });
    }

    const existingItem = cart.items.find(
      item => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity
      });
    }

    await cart.save();

    res.json(cart);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Eliminar producto del carrito
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });

    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    );

    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};