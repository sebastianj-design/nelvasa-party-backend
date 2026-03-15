const express = require("express");
const cors = require("cors");
const cartRoutes = require("./routes/cart.routes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({ message: "API Nelvasa Party funcionando 🚀" });
});

app.use("/api/cart", cartRoutes);
module.exports = app;
