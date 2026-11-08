
import { Link, useNavigate } from "react-router-dom";
import { FiHeart, FiEye } from "react-icons/fi";

import { useProducts } from "../context/ProductContext";
import { useAuth } from "../context/AuthContext";

function ProductCard({
  id,
  name,
  price,
  category,
  image,
  description
}) {
  const { isFavorite, toggleFavorite } = useProducts();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const favorite = isFavorite(id);

  const formattedPrice = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(price);

  const handleFavorite = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    toggleFavorite(id);
  };

  return (
    <div className="card product-card h-100">

      <div className="product-image-container">
        <img
          src={image}
          className="card-img-top product-image"
          alt={name}
        />
      </div>

      <div className="card-body d-flex flex-column">

        <span className="product-category">
          {category}
        </span>

        <h5 className="card-title mt-2">
          {name}
        </h5>

        <p className="card-text text-secondary small">
          {description}
        </p>

        <div className="mt-auto">

          <h5 className="product-price" translate="no">
            {formattedPrice}
          </h5>

          <div className="d-flex gap-2 mt-3">

            <Link
              to={`/producto/${id}`}
              className="btn btn-primary flex-grow-1"
            >
              <FiEye /> Ver producto
            </Link>

            <button
              type="button"
              className={`btn ${
                favorite
                  ? "btn-primary"
                  : "btn-outline-secondary"
              }`}
              onClick={handleFavorite}
              aria-label={
                favorite
                  ? `Quitar ${name} de favoritos`
                  : `Agregar ${name} a favoritos`
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
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
