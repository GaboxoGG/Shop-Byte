
import { useState } from "react";
import { Link } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiUserPlus } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

function Register() {
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (Object.values(formData).some((value) => !value.trim())) {
      setError("Completa todos los campos.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Ingresa un correo electrónico válido.");
      return;
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    const result = register({
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
    });

    if (!result.success) {
      setError(result.message);
      return;
    }

    setSuccess(result.message);

    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="register-page">
      <div className="register-card">

        <div className="register-header">
          <div className="register-icon">
            <FiUserPlus />
          </div>

          <h1>Crear cuenta</h1>

          <p>
            Únete a Shop&Byte y descubre nuestra tecnología.
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="register-field">
            <label htmlFor="name">Nombre completo</label>

            <div className="register-input">
              <FiUser />

              <input
                id="name"
                type="text"
                name="name"
                placeholder="Tu nombre"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="register-field">
            <label htmlFor="email">Correo electrónico</label>

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
            <label htmlFor="password">Contraseña</label>

            <div className="register-input">
              <FiLock />

              <input
                id="password"
                type="password"
                name="password"
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="register-field">
            <label htmlFor="confirmPassword">
              Confirmar contraseña
            </label>

            <div className="register-input">
              <FiLock />

              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="Repite tu contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && (
            <div className="register-message error">
              {error}
            </div>
          )}

          {success && (
            <div className="register-message success">
              {success} Ya puedes iniciar sesión.
            </div>
          )}

          <button type="submit" className="register-submit">
            <FiUserPlus />
            Crear cuenta
          </button>

        </form>

        <div className="register-footer">
          ¿Ya tienes una cuenta?{" "}
          <Link to="/login">Inicia sesión</Link>
        </div>

      </div>
    </div>
  );
}

export default Register;
