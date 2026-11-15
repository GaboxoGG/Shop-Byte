
import { Link } from "react-router-dom";
import { FiHeart, FiShoppingBag } from "react-icons/fi";

import ProductCard from "../components/ProductCard";
import { useProducts } from "../context/ProductContext";

function Favorites() {
  const { favoriteProducts } = useProducts();

  const totalFavorites = favoriteProducts.length;

  return (
    <div className="favorites-page">

      <div className="mb-4">
        <h1>Mis favoritos</h1>

        <p className="text-secondary">
          Tus productos tecnológicos guardados.
        </p>
      </div>

      {totalFavorites > 0 ? (
        <>
          <p className="text-secondary small mb-3">
            {totalFavorites}{" "}
            {totalFavorites === 1
              ? "producto guardado"
              : "productos guardados"}
          </p>

          <div className="row g-4">
            {favoriteProducts.map((product) => (
              <div
                className="col-12 col-sm-6 col-lg-4 col-xl-3"
                key={product.id}
              >
                <ProductCard {...product} />
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-5">

          <FiHeart
            size={48}
            className="text-secondary mb-3"
          />

          <h4>Aún no tienes favoritos</h4>

          <p className="text-secondary">
            Explora nuestro catálogo y guarda los productos
            que más te gusten.
          </p>

          <Link to="/" className="btn btn-primary mt-2">
            <FiShoppingBag className="me-2" />
            Explorar productos
          </Link>

        </div>
      )}

    </div>
  );
}

export default Favorites;
