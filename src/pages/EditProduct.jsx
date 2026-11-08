
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FiPackage,
  FiDollarSign,
  FiImage,
  FiAlignLeft,
  FiTag,
  FiBox,
  FiSave,
  FiArrowLeft,
} from "react-icons/fi";

import { useProducts } from "../context/ProductContext";
import { useAuth } from "../context/AuthContext";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { products, updateProduct } = useProducts();
  const { user } = useAuth();

  const product = products.find(
    (item) => String(item.id) === id
  );

  const isOwner =
    product &&
    product.isCustom &&
    String(product.ownerId) === String(user?.id);

  const [formData, setFormData] = useState(() => ({
    name: product?.name || "",
    price: product?.price || "",
    category: product?.category || "",
    image: product?.image || "",
    description: product?.description || "",
    condition: product?.condition || "Nuevo",
    stock: product?.stock || "1",
  }));

  const [error, setError] = useState("");

  const categories = [
    "Notebooks",
    "Celulares",
    "Audio",
    "Periféricos",
    "Monitores",
    "Accesorios",
    "Otros",
  ];

  if (!product || !product.isCustom) {
    return (
      <div className="text-center py-5">
        <h2>Publicación no encontrada</h2>
        <p className="text-secondary">
          Esta publicación no está disponible para editar.
        </p>
        <Link to="/perfil" className="btn btn-primary">
          Volver a mi perfil
        </Link>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="text-center py-5">
        <h2>Acceso denegado</h2>
        <p className="text-secondary">
          No tienes permiso para editar esta publicación.
        </p>
        <Link to="/perfil" className="btn btn-primary">
          Volver a mi perfil
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      Object.values(formData).some(
        (value) => !String(value).trim()
      )
    ) {
      setError("Completa todos los campos.");
      return;
    }

    if (Number(formData.price) <= 0) {
      setError("El precio debe ser mayor que cero.");
      return;
    }

    if (
      !Number.isInteger(Number(formData.stock)) ||
      Number(formData.stock) < 1
    ) {
      setError("El stock debe ser un número entero mayor que cero.");
      return;
    }

    const result = updateProduct(product.id, {
      name: formData.name.trim(),
      price: Number(formData.price),
      category: formData.category,
      image: formData.image.trim(),
      description: formData.description.trim(),
      condition: formData.condition,
      stock: Number(formData.stock),
    });

    if (!result.success) {
      setError(result.message);
      return;
    }

    navigate(`/producto/${product.id}`);
  };

  return (
    <div className="register-page">
      <div className="register-card publish-card">
        <Link to="/perfil" className="back-link mb-3">
          <FiArrowLeft />
          Volver a mi perfil
        </Link>

        <div className="register-header">
          <div className="register-icon">
            <FiPackage />
          </div>

          <h1>Editar publicación</h1>

          <p>
            Modifica los datos de tu producto en Shop&Byte.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="register-field">
            <label htmlFor="name">Nombre del producto</label>
            <div className="register-input">
              <FiPackage />
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="register-field">
            <label htmlFor="price">Precio (CLP)</label>
            <div className="register-input">
              <FiDollarSign />
              <input
                id="price"
                name="price"
                type="number"
                min="1"
                value={formData.price}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="register-field">
            <label htmlFor="category">Categoría</label>
            <div className="register-input">
              <FiTag />
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Selecciona una categoría</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="register-field">
            <label htmlFor="image">URL de la imagen</label>
            <div className="register-input">
              <FiImage />
              <input
                id="image"
                name="image"
                type="url"
                value={formData.image}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="register-field">
            <label htmlFor="description">Descripción</label>
            <div className="register-input">
              <FiAlignLeft />
              <textarea
                id="description"
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="register-field">
            <label htmlFor="condition">Estado del producto</label>
            <div className="register-input">
              <FiBox />
              <select
                id="condition"
                name="condition"
                value={formData.condition}
                onChange={handleChange}
              >
                <option value="Nuevo">Nuevo</option>
                <option value="Usado">Usado</option>
              </select>
            </div>
          </div>

          <div className="register-field">
            <label htmlFor="stock">Cantidad disponible</label>
            <div className="register-input">
              <FiPackage />
              <input
                id="stock"
                name="stock"
                type="number"
                min="1"
                step="1"
                value={formData.stock}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && (
            <div className="register-message error">
              {error}
            </div>
          )}

          <button type="submit" className="register-submit">
            <FiSave />
            Guardar cambios
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProduct;
