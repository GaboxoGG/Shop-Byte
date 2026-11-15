
const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/auth.middleware");

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");

// Ruta de prueba protegida
router.get("/private", verifyToken, (req, res) => {
  res.json({
    message: "Acceso autorizado",
    user: req.user,
  });
});

// Listar productos
router.get("/", getProducts);

// Obtener producto por ID
router.get("/:id", getProductById);

// Crear producto
router.post("/", verifyToken, createProduct);

// Editar producto propio
router.put("/:id", verifyToken, updateProduct);

// Eliminar producto propio
router.delete("/:id", verifyToken, deleteProduct);

module.exports = router;
