
const express = require("express");
const cors = require("cors");
const pool = require("./config/db");

const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");

const app = express();

// Middlewares generales
app.use(cors());
app.use(express.json());

// Ruta principal
app.get("/", (req, res) => {
  res.json({
    message: "Servidor Shop&Byte funcionando",
  });
});

// Prueba de conexión a PostgreSQL
app.get("/api/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS fecha");

    res.json({
      message: "Conexión a PostgreSQL exitosa",
      fecha: result.rows[0].fecha,
    });
  } catch (error) {
    console.error("Error al consultar PostgreSQL:", error.message);

    res.status(500).json({
      message: "Error de conexión con la base de datos",
    });
  }
});

// Rutas de autenticación
app.use("/api/auth", authRoutes);

// Rutas de productos
app.use("/api/products", productRoutes);

module.exports = app;
