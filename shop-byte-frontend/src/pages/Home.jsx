
import { useState } from "react";
import { FiSearch } from "react-icons/fi";

import ProductCard from "../components/ProductCard";
import { useProducts } from "../context/ProductContext";

function Home() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");

  const { products } = useProducts();

  // Obtener categorías disponibles
  const categories = [
    "Todas",
    ...new Set(products.map((product) => product.category)),
  ];

  // Filtrar productos por nombre y categoría
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "Todas" ||
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="home-page">

      {/* Presentación principal */}
      <section className="hero-section mb-5">
        <div>
          <span className="hero-label">
            TECNOLOGÍA A TU ALCANCE
          </span>

          <h1>
            Encuentra tu próximo
            <br />
            <span>dispositivo tecnológico.</span>
          </h1>

          <p>
            Descubre productos tecnológicos y encuentra
            lo que necesitas en Shop&Byte.
          </p>
        </div>
      </section>

      {/* Catálogo */}
      <section className="catalog-section">

        <div className="catalog-heading mb-4">
          <div>
            <h2>Explora nuestros productos</h2>

            <p className="text-secondary">
              Encuentra tecnología para tu día a día.
            </p>
          </div>
        </div>

        {/* Buscador y categorías */}
        <div className="row g-3 mb-4">

          <div className="col-md-7">
            <div className="search-box">
              <FiSearch />

              <input
                type="text"
                placeholder="Buscar productos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Buscar productos"
              />
            </div>
          </div>

          <div className="col-md-5">
            <select
              className="form-select category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filtrar por categoría"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Cantidad de resultados */}
        <p className="text-secondary small mb-3">
          {filteredProducts.length} productos encontrados
        </p>

        {/* Productos */}
        <div className="row g-4">

          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                className="col-sm-6 col-lg-4 col-xl-3"
                key={product.id}
              >
                <ProductCard {...product} />
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <h5>No encontramos productos</h5>

              <p className="text-secondary">
                Intenta con otra búsqueda o categoría.
              </p>

              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("Todas");
                }}
              >
                Limpiar filtros
              </button>
            </div>
          )}

        </div>

      </section>

    </div>
  );
}

export default Home;
