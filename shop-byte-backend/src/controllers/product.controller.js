
const pool = require("../config/db");

// LISTAR TODOS LOS PRODUCTOS
const getProducts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        p.id,
        p.name,
        p.description,
        p.price,
        p.category,
        p.image,
        p.condition,
        p.stock,
        p.user_id,
        p.created_at,
        u.name AS seller
      FROM products p
      LEFT JOIN users u ON u.id = p.user_id
      ORDER BY p.created_at DESC
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error al listar productos:", error.message);
    res.status(500).json({
      message: "Error al obtener productos",
    });
  }
};

// OBTENER PRODUCTO POR ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT
         p.*,
         u.name AS seller
       FROM products p
       LEFT JOIN users u ON u.id = p.user_id
       WHERE p.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Producto no encontrado",
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener producto:", error.message);
    res.status(500).json({
      message: "Error al obtener producto",
    });
  }
};

// CREAR PRODUCTO
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      image,
      condition,
      stock,
    } = req.body;

    if (!name || !price || !category || !condition) {
      return res.status(400).json({
        message: "Nombre, precio, categoría y condición son obligatorios",
      });
    }

    if (Number(price) <= 0 || !Number.isFinite(Number(price))) {
      return res.status(400).json({
        message: "El precio debe ser mayor que cero",
      });
    }

    const result = await pool.query(
      `INSERT INTO products
       (name, description, price, category, image, condition, stock, user_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        name.trim(),
        description || null,
        Number(price),
        category,
        image || null,
        condition,
        stock === undefined ? 1 : Number(stock),
        req.user.id,
      ]
    );

    const productResult = await pool.query(
      `SELECT
         p.*,
         u.name AS seller
       FROM products p
       LEFT JOIN users u ON u.id = p.user_id
       WHERE p.id = $1`,
      [result.rows[0].id]
    );

    res.status(201).json({
      message: "Producto publicado correctamente",
      product: productResult.rows[0],
    });
  } catch (error) {
    console.error("Error al crear producto:", error.message);
    res.status(500).json({
      message: "Error al crear producto",
    });
  }
};

// EDITAR PRODUCTO PROPIO
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      description,
      price,
      category,
      image,
      condition,
      stock,
    } = req.body;

    const result = await pool.query(
      `UPDATE products
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           price = COALESCE($3, price),
           category = COALESCE($4, category),
           image = COALESCE($5, image),
           condition = COALESCE($6, condition),
           stock = COALESCE($7, stock)
       WHERE id = $8 AND user_id = $9
       RETURNING id`,
      [
        name ?? null,
        description ?? null,
        price === undefined ? null : Number(price),
        category ?? null,
        image ?? null,
        condition ?? null,
        stock === undefined ? null : Number(stock),
        id,
        req.user.id,
      ]
    );

    if (result.rows.length === 0) {
      const product = await pool.query(
        "SELECT id FROM products WHERE id = $1",
        [id]
      );

      if (product.rows.length === 0) {
        return res.status(404).json({
          message: "Producto no encontrado",
        });
      }

      return res.status(403).json({
        message: "No tienes permiso para editar este producto",
      });
    }

    const productResult = await pool.query(
      `SELECT
         p.*,
         u.name AS seller
       FROM products p
       LEFT JOIN users u ON u.id = p.user_id
       WHERE p.id = $1`,
      [id]
    );

    res.status(200).json({
      message: "Producto actualizado correctamente",
      product: productResult.rows[0],
    });
  } catch (error) {
    console.error("Error al actualizar producto:", error.message);
    res.status(500).json({
      message: "Error al actualizar producto",
    });
  }
};

// ELIMINAR PRODUCTO PROPIO
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM products
       WHERE id = $1 AND user_id = $2
       RETURNING id`,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      const product = await pool.query(
        "SELECT id FROM products WHERE id = $1",
        [id]
      );

      if (product.rows.length === 0) {
        return res.status(404).json({
          message: "Producto no encontrado",
        });
      }

      return res.status(403).json({
        message: "No tienes permiso para eliminar este producto",
      });
    }

    res.status(200).json({
      message: "Producto eliminado correctamente",
    });
  } catch (error) {
    console.error("Error al eliminar producto:", error.message);
    res.status(500).json({
      message: "Error al eliminar producto",
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
