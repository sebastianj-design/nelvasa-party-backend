const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, res, next) => {
  try {
    // 1. Obtener header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Token no proporcionado" });
    }

    // 2. Separar Bearer TOKEN
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token inválido" });
    }

    // 3. Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Guardar usuario en request
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Token no válido o expirado" });
  }
};
