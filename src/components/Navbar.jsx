
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import {
  FiShoppingBag,
  FiUser,
  FiHeart,
  FiMenu,
  FiX,
  FiHome,
  FiPlusSquare,
  FiLogOut,
} from "react-icons/fi";

import { useAuth } from "../context/AuthContext";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg shop-navbar">
      <div className="container navbar-container">

        {/* Logo */}
        <Link
          to="/"
          className="navbar-brand brand-name"
          translate="no"
          onClick={closeMenu}
        >
          <span className="brand-shop">Shop</span>
          <span className="brand-byte">&Byte</span>
        </Link>

        {/* Menú móvil */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setMenuOpen((previous) => !previous)}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
        >
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        {/* Navegación */}
        <div
          id="main-navigation"
          className={`collapse navbar-collapse ${
            menuOpen ? "show" : ""
          }`}
        >
          <div className="navbar-nav ms-auto align-items-lg-center">

            {/* Inicio */}
            <NavLink
              to="/"
              end
              className="nav-link"
              onClick={closeMenu}
            >
              <FiHome className="me-1" />
              Inicio
            </NavLink>

            {/* Favoritos */}
            <NavLink
              to="/favoritos"
              className="nav-link"
              onClick={closeMenu}
            >
              <FiHeart className="me-1" />
              Favoritos
            </NavLink>

            {/* Publicar */}
            <NavLink
              to="/publicar"
              className="nav-link"
              onClick={closeMenu}
            >
              <FiPlusSquare className="me-1" />
              Publicar
            </NavLink>

            {/* Mi cuenta / Perfil */}
            <NavLink
              to={isAuthenticated ? "/perfil" : "/login"}
              className="nav-link"
              onClick={closeMenu}
            >
              <FiUser className="me-1" />
              {isAuthenticated ? "Mi perfil" : "Mi cuenta"}
            </NavLink>

            {/* Cerrar sesión */}
            {isAuthenticated && (
              <button
                type="button"
                className="nav-link navbar-logout"
                onClick={handleLogout}
              >
                <FiLogOut className="me-1" />
                Cerrar sesión
              </button>
            )}

            {/* Productos */}
            <NavLink
              to="/"
              end
              className="btn btn-primary products-button"
              onClick={closeMenu}
            >
              <FiShoppingBag className="me-2" />
              Productos
            </NavLink>

          </div>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;
