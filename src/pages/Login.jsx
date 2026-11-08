
import { useState } from "react";
import {
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  FiMail,
  FiLock,
  FiLogIn,
} from "react-icons/fi";

import { useAuth } from "../context/AuthContext";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

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

    if (!formData.email.trim() || !formData.password.trim()) {
      setError("Completa todos los campos.");
      return;
    }

    const result = login(
      formData.email.trim().toLowerCase(),
      formData.password
    );

    if (!result.success) {
      setError(result.message);
      return;
    }

    // Recuperar la página y la acción pendientes
    const from = location.state?.from || "/perfil";
    const favoriteProductId = location.state?.favoriteProductId;

    navigate(from, {
      replace: true,
      state: favoriteProductId
        ? { favoriteProductId }
        : null,
    });
  };

  return (
    <div className="register-page">
      <div className="register-card">

        <div className="register-header">
          <div className="register-icon">
            <FiLogIn />
          </div>

          <h1>Iniciar sesión</h1>

          <p>
            Bienvenido nuevamente a Shop&Byte.
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="register-field">
            <label htmlFor="email">
              Correo electrónico
            </label>

            <div className="register-input">
              <FiMail />

              <input
                id="email"
                type="email"
                name="email"
                placeholder="correo@ejemplo.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="register-field">
            <label htmlFor="password">
              Contraseña
            </label>

            <div className="register-input">
              <FiLock />

              <input
                id="password"
                type="password"
                name="password"
                placeholder="Ingresa tu contraseña"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && (
            <div className="register-message error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="register-submit"
          >
            <FiLogIn />
            Iniciar sesión
          </button>

        </form>

        <div className="register-footer">
          ¿Todavía no tienes una cuenta?{" "}
          <Link to="/registro">Crear cuenta</Link>
        </div>

      </div>
    </div>
  );
}

export default Login;
