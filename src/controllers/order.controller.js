const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");


// ======================================================
// 🛒 1️⃣ CREAR PEDIDO ONLINE (desde carrito)
// ======================================================

exports.checkoutOrder = async (req, res) => {
  try {
    const { paymentMethod, address, items, total, deliveryDate } = req.body;

    let orderItems = [];
    let totalAmount = 0;

    // ======================================================
    // 🔥 CASO 1: VIENE DESDE APP MÓVIL
    // ======================================================
    if (items && items.length > 0) {

      for (let item of items) {
        const product = await Product.findById(item.product);

        if (!product || !product.isActive) {
          return res.status(400).json({ message: "Producto no disponible" });
        }

        if (product.stock < item.quantity) {
          return res.status(400).json({
            message: `Stock insuficiente para ${product.name}`
          });
        }

        // 🔥 Restar stock
        product.stock -= item.quantity;
        await product.save();

        totalAmount += product.price * item.quantity;

        orderItems.push({
          product: product._id,
          name: product.name,
          price: product.price,
          quantity: item.quantity
        });
      }

    } else {

      // ======================================================
      // 🧠 CASO 2: USAR CARRITO DB (WEB)
      // ======================================================
      const cart = await Cart.findOne({ user: req.user.id })
        .populate("items.product");

      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: "El carrito está vacío" });
      }

      for (let item of cart.items) {
        const product = item.product;

        if (!product || !product.isActive) {
          return res.status(400).json({ message: "Producto no disponible" });
        }

        if (product.stock < item.quantity) {
          return res.status(400).json({
            message: `Stock insuficiente para ${product.name}`
          });
        }

        product.stock -= item.quantity;
        await product.save();

        totalAmount += product.price * item.quantity;

        orderItems.push({
          product: product._id,
          name: product.name,
          price: product.price,
          quantity: item.quantity
        });
      }

      // 🔥 Vaciar carrito solo si viene de DB
      cart.items = [];
      await cart.save();
    }

    // ======================================================
    // 🧾 CREAR PEDIDO
    // ======================================================
    const order = await Order.create({
      user: req.user.id,
      createdBy: req.user.id,
      orderType: "online",
      items: orderItems,
      totalAmount,
      paymentMethod,
      address,
      deliveryDate,
      status: "pendiente"
    });

    res.status(201).json({
      message: "Pedido creado correctamente",
      order
    });

  } catch (error) {
    console.log("❌ ERROR CHECKOUT:", error);
    res.status(500).json({ message: error.message });
  }
};

// ======================================================
// 🏪 2️⃣ CREAR PEDIDO EN TIENDA (POS)
// ======================================================

exports.createStoreOrder = async (req, res) => {
  try {
    const { items, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No hay productos en el pedido" });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (let item of items) {
      const product = await Product.findById(item.productId);

      if (!product || !product.isActive) {
        return res.status(404).json({ message: "Producto no disponible" });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Stock insuficiente para ${product.name}`
        });
      }

      product.stock -= item.quantity;
      await product.save();

      totalAmount += product.price * item.quantity;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity
      });
    }

    const order = await Order.create({
      orderType: "store",
      createdBy: req.user.id,
      items: orderItems,
      totalAmount,
      paymentMethod,
      status: "pagado"
    });

    res.status(201).json(order);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ======================================================
// 📦 3️⃣ OBTENER TODOS LOS PEDIDOS (ADMIN)
// ======================================================

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ======================================================
// 👤 4️⃣ OBTENER MIS PEDIDOS (CLIENTE)
// ======================================================

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ======================================================
// 🔄 5️⃣ CAMBIAR ESTADO DEL PEDIDO (ADMIN)
// ======================================================

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = [
      "pendiente",
      "pagado",
      "enviado",
      "entregado",
      "cancelado"
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Estado inválido" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    res.json(order);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ======================================================
// 💳 6️⃣ SIMULAR PAGO (para online)
// ======================================================

exports.payOrder = async (req, res) => {
  try {
    const { paymentMethod } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    if (order.status === "pagado") {
      return res.status(400).json({ message: "El pedido ya está pagado" });
    }

    order.paymentMethod = paymentMethod;
    order.status = "pagado";

    await order.save();

    res.json({
      message: "Pago realizado con éxito",
      order
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};