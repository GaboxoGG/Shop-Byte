
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FiPackage,
  FiDollarSign,
  FiImage,
  FiAlignLeft,
  FiTag,
  FiBox,
  FiPlusSquare,
} from "react-icons/fi";

import { useProducts } from "../context/ProductContext";
import { useAuth } from "../context/AuthContext";

function PublishProduct() {
  const { addProduct } = useProducts();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    image: "",
    description: "",
    condition: "Nuevo",
    stock: "1",
  });

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

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (Object.values(formData).some((value) => !String(value).trim())) {
      setError("Completa todos los campos.");
      return;
    }

    if (Number(formData.price) <= 0) {
      setError("El precio debe ser mayor que cero.");
      return;
    }

    if (!Number.isInteger(Number(formData.stock)) || Number(formData.stock) < 1) {
      setError("El stock debe ser un número entero mayor que cero.");
      return;
    }

    const newProduct = addProduct({
      name: formData.name.trim(),
      price: Number(formData.price),
      category: formData.category,
      image: formData.image.trim(),
      description: formData.description.trim(),
      seller: user.name,
      condition: formData.condition,
      stock: Number(formData.stock),
    });

    navigate(`/producto/${newProduct.id}`);
  };

  if (!isAuthenticated) {
    return (
      <div className="register-page">
        <div className="register-card text-center">
          <h1>Inicia sesión</h1>
          <p>Necesitas una cuenta para publicar productos.</p>
          <Link to="/login" className="register-submit d-block text-decoration-none">
            Iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="register-page">
      <div className="register-card publish-card">

        <div className="register-header">
          <div className="register-icon">
            <FiPackage />
          </div>

          <h1>Publicar producto</h1>

          <p>Completa los datos para publicar tu producto en Shop&Byte.</p>
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
                placeholder="Ej: Notebook Lenovo"
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
                placeholder="Ej: 350000"
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
                placeholder="https://ejemplo.com/imagen.jpg"
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
                placeholder="Describe las características del producto..."
                value={formData.description}
                onChange={handleChange}
                rows="4"
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
            <FiPlusSquare />
            Publicar producto
          </button>

        </form>
      </div>
    </div>
  );
}

export default PublishProduct;
