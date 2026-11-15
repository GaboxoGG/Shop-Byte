
const express = require("express");
const router = express.Router();

const {
  register,
  login,
} = require("../controllers/auth.controller");

// Registrar usuario
router.post("/register", register);

// Iniciar sesión
router.post("/login", login);

module.exports = router;
