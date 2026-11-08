
import { Link, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiLogOut,
  FiPlusSquare,
  FiHeart,
  FiEdit2,
  FiPackage,
} from "react-icons/fi";

import { useAuth } from "../context/AuthContext";
import { useProducts } from "../context/ProductContext";

function Profile() {
  const { user, logout } = useAuth();
  const { myProducts } = useProducts();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(price);

  if (!user) {
    return (
      <div className="register-page">
        <div className="register-card text-center">
          <div className="register-header">
            <div className="register-icon">
              <FiUser />
            </div>

            <h1>Inicia sesión</h1>

            <p>
              Necesitas iniciar sesión para acceder a tu perfil.
            </p>
          </div>

          <Link
            to="/login"
            className="register-submit d-block text-decoration-none"
          >
            Iniciar sesión
          </Link>

          <div className="register-footer">
            ¿No tienes una cuenta?{" "}
            <Link to="/registro">Crear cuenta</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-card">

        <div className="profile-header">
          <div className="profile-avatar">
            <FiUser />
          </div>

          <h1>Mi perfil</h1>

          <p>Bienvenido a tu cuenta de Shop&Byte.</p>
        </div>

        {/* Información del usuario */}
        <div className="profile-info">

          <div className="profile-info-item">
            <FiUser />

            <div>
              <span>Nombre</span>
              <strong>
                {[user.name, user.lastname]
                  .filter(Boolean)
                  .join(" ") || user.name}
              </strong>
            </div>
          </div>

          <div className="profile-info-item">
            <FiMail />

            <div>
              <span>Correo electrónico</span>
              <strong>{user.email}</strong>
            </div>
          </div>

        </div>

        {/* Acciones del perfil */}
        <div className="profile-actions">
          <Link to="/publicar" className="profile-action-button">
            <FiPlusSquare />
            Publicar producto
          </Link>

          <Link
            to="/favoritos"
            className="profile-action-button secondary"
          >
            <FiHeart />
            Mis favoritos
          </Link>
        </div>

        {/* Publicaciones propias */}
        <section className="mt-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="h4 mb-0">
              <FiPackage className="me-2" />
              Mis publicaciones
            </h2>

            <span className="text-secondary small">
              {myProducts.length} productos
            </span>
          </div>

          {myProducts.length === 0 ? (
            <div className="text-center py-4 border rounded-3">
              <FiPackage size={32} className="text-secondary mb-2" />

              <h3 className="h6">Todavía no tienes publicaciones</h3>

              <p className="text-secondary small mb-3">
                Publica tu primer producto en Shop&Byte.
              </p>

              <Link to="/publicar" className="btn btn-primary btn-sm">
                <FiPlusSquare className="me-2" />
                Publicar producto
              </Link>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {myProducts.map((product) => (
                <div
                  key={product.id}
                  className="border rounded-3 p-3"
                >
                  <div className="d-flex align-items-center gap-3">

                    <img
                      src={product.image}
                      alt={product.name}
                      style={{
                        width: "85px",
                        height: "85px",
                        objectFit: "contain",
                        borderRadius: "8px",
                      }}
                    />

                    <div className="flex-grow-1">
                      <span className="text-primary small">
                        {product.category}
                      </span>

                      <h3 className="h6 mb-1">
                        {product.name}
                      </h3>

                      <strong>
                        {formatPrice(product.price)}
                      </strong>

                      <div className="text-secondary small mt-1">
                        Stock: {product.stock} unidades
                      </div>
                    </div>

                    <Link
                      to={`/editar-producto/${product.id}`}
                      className="btn btn-outline-primary"
                      aria-label={`Editar ${product.name}`}
                      title="Editar publicación"
                    >
                      <FiEdit2 />
                      <span className="ms-1 d-none d-sm-inline">
                        Editar
                      </span>
                    </Link>

                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Cerrar sesión */}
        <button
          type="button"
          className="profile-logout mt-4"
          onClick={handleLogout}
        >
          <FiLogOut />
          Cerrar sesión
        </button>

      </div>
    </div>
  );
}

export default Profile;
