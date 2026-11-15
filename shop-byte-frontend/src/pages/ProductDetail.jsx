
import {
  Link,
  useParams,
  useNavigate,
  useLocation,
} from "react-router-dom";

import { useEffect, useRef } from "react";

import {
  FiArrowLeft,
  FiHeart,
  FiPackage,
  FiUser,
} from "react-icons/fi";

import { useProducts } from "../context/ProductContext";
import { useAuth } from "../context/AuthContext";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { products, isFavorite, toggleFavorite } = useProducts();
  const { isAuthenticated } = useAuth();

  // Evitar procesar dos veces la misma acción
  const processedFavorite = useRef(null);

  const product = products.find(
    (item) => String(item.id) === String(id)
  );

  // Recuperar y guardar el favorito después del login
  useEffect(() => {
    const favoriteProductId = location.state?.favoriteProductId;

    if (
      !isAuthenticated ||
      !product ||
      String(favoriteProductId) !== String(product.id)
    ) {
      return;
    }

    if (processedFavorite.current === String(product.id)) {
      return;
    }

    processedFavorite.current = String(product.id);

    if (!isFavorite(product.id)) {
      toggleFavorite(product.id);
    }

    // Limpiar la acción pendiente para evitar repetirla
    navigate(location.pathname, {
      replace: true,
      state: null,
    });
  }, [
    isAuthenticated,
    product,
    location.state,
    location.pathname,
    navigate,
    isFavorite,
    toggleFavorite,
  ]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleFavorite = () => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          from: location.pathname,
          favoriteProductId: product.id,
        },
      });

      return;
    }

    toggleFavorite(product.id);
  };

  if (!product) {
    return (
      <div className="text-center py-5">
        <h2>Producto no encontrado</h2>

        <p className="text-secondary">
          El producto que buscas no está disponible.
        </p>

        <Link to="/" className="btn btn-primary">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const favorite = isFavorite(product.id);

  return (
    <div className="product-detail-page">

      <Link to="/" className="back-link">
        <FiArrowLeft /> Volver al catálogo
      </Link>

      <div className="row g-5 mt-2">

        {/* Imagen del producto */}
        <div className="col-lg-6">
          <div className="detail-image-container">
            <img
              src={product.image}
              alt={product.name}
              className="detail-image"
            />
          </div>
        </div>

        {/* Información del producto */}
        <div className="col-lg-6">

          <span className="product-category">
            {product.category}
          </span>

          <h1 className="detail-title mt-2">
            {product.name}
          </h1>

          <h2 className="detail-price" translate="no">
            {formatPrice(product.price)}
          </h2>

          <div className="detail-divider"></div>

          <h5>Descripción</h5>

          <p className="text-secondary detail-description">
            {product.description}
          </p>

          {/* Información adicional */}
          <div className="detail-info">

            <div>
              <FiPackage />
              <span>
                Estado: <strong>{product.condition}</strong>
              </span>
            </div>

            <div>
              <FiPackage />
              <span>
                Stock disponible:{" "}
                <strong>{product.stock} unidades</strong>
              </span>
            </div>

            <div>
              <FiUser />
              <span>
                Vendedor: <strong>{product.seller}</strong>
              </span>
            </div>

          </div>

          {/* Acciones */}
          <div className="detail-actions">

            <button
              type="button"
              className="btn btn-primary btn-lg"
              disabled
              title="La compra estará disponible en una etapa posterior"
            >
              Próximamente: Comprar
            </button>

            <button
              type="button"
              className={`btn btn-lg ${
                favorite
                  ? "btn-primary"
                  : "btn-outline-secondary"
              }`}
              onClick={handleFavorite}
              aria-label={
                favorite
                  ? "Quitar de favoritos"
                  : "Agregar a favoritos"
              }
              aria-pressed={favorite}
              title={
                favorite
                  ? "Quitar de favoritos"
                  : "Agregar a favoritos"
              }
            >
              <FiHeart
                fill={favorite ? "currentColor" : "none"}
              />
            </button>

          </div>

          <p className="text-secondary small mt-3">
            Los productos publicados por usuarios son parte
            del catálogo de Shop&Byte.
          </p>

        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
