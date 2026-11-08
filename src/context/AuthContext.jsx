
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Recuperar usuario y sesión guardados
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("shopbyte-user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  // Guardar o eliminar sesión
  useEffect(() => {
    if (user) {
      localStorage.setItem(
        "shopbyte-user",
        JSON.stringify(user)
      );
    } else {
      localStorage.removeItem("shopbyte-user");
    }
  }, [user]);

  // Registrar usuario
  const register = ({ name, email, password }) => {
    const savedUsers = JSON.parse(
      localStorage.getItem("shopbyte-users") || "[]"
    );

    const existingUser = savedUsers.find(
      (item) => item.email === email
    );

    if (existingUser) {
      return {
        success: false,
        message: "Este correo ya está registrado.",
      };
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
    };

    localStorage.setItem(
      "shopbyte-users",
      JSON.stringify([...savedUsers, newUser])
    );

    return {
      success: true,
      message: "Cuenta creada correctamente.",
    };
  };

  // Iniciar sesión
  const login = (email, password) => {
    const savedUsers = JSON.parse(
      localStorage.getItem("shopbyte-users") || "[]"
    );

    const foundUser = savedUsers.find(
      (item) =>
        item.email === email &&
        item.password === password
    );

    if (!foundUser) {
      return {
        success: false,
        message: "Correo o contraseña incorrectos.",
      };
    }

    const userData = { ...foundUser };
    delete userData.password;

    setUser(userData);

    return {
      success: true,
      message: "Bienvenido a Shop&Byte.",
    };
  };

  // Cerrar sesión
  const logout = () => {
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
