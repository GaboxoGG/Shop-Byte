
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { apiRequest } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Recuperar usuario guardado
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("shopbyte-user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  // Mantener usuario en localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("shopbyte-user", JSON.stringify(user));
    } else {
      localStorage.removeItem("shopbyte-user");
    }
  }, [user]);

  // Registrar usuario en el backend
  const register = async ({ name, email, password }) => {
    try {
      const data = await apiRequest("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });

      return {
        success: true,
        message: data.message || "Cuenta creada correctamente.",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  };

  // Iniciar sesión mediante JWT
  const login = async (email, password) => {
    try {
      const data = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      localStorage.setItem("shopbyte-token", data.token);
      setUser(data.user);

      return {
        success: true,
        message: data.message || "Bienvenido a Shop&Byte.",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  };

  // Cerrar sesión
  const logout = () => {
    localStorage.removeItem("shopbyte-token");
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: Boolean(user),
    register,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth debe utilizarse dentro de AuthProvider"
    );
  }

  return context;
}
