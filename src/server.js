require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");

const PORT = process.env.PORT || 4000;

// Conectar DB
connectDB();

// 🔥 REGISTRAR RUTAS ANTES DE LISTEN
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Levantar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});