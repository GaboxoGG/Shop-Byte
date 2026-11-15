
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import productsData from "../data/products";
import { useAuth } from "./AuthContext";

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const { user } = useAuth();

  const [products, setProducts] = useState(() => {
    try {
      const savedProducts = localStorage.getItem("shopbyte-products");
      const customProducts = savedProducts
        ? JSON.parse(savedProducts)
        : [];

      // Recuperar usuarios registrados para asociar
      // publicaciones antiguas con sus propietarios.
      const savedUsers = JSON.parse(
        localStorage.getItem("shopbyte-users") || "[]"
      );

      const migratedProducts = customProducts.map((product) => {
        if (product.ownerId) return product;

        const owner = savedUsers.find((savedUser) => {
          const fullName = [
            savedUser.name,
            savedUser.lastname,
          ]
            .filter(Boolean)
            .join(" ")
            .trim();

          return (
            fullName.toLowerCase() ===
            String(product.seller || "").trim().toLowerCase()
          );
        });

        return owner
          ? { ...product, ownerId: owner.id }
          : product;
      });

      return [...productsData, ...migratedProducts];
    } catch {
      return [...productsData];
    }
  });

  // Favoritos separados por usuario
  const [favoritesByUser, setFavoritesByUser] = useState(() => {
    try {
      const savedFavorites = localStorage.getItem(
        "shopbyte-favorites-by-user"
      );

      return savedFavorites ? JSON.parse(savedFavorites) : {};
    } catch {
      return {};
    }
  });

  const userKey = user ? String(user.id) : null;

  const favorites = userKey
    ? favoritesByUser[userKey] || []
    : [];

  // Publicaciones del usuario actual
  const myProducts = userKey
    ? products.filter(
        (product) =>
          product.isCustom &&
          String(product.ownerId) === userKey
      )
    : [];

  // Guardar productos publicados y editados
  useEffect(() => {
    const customProducts = products.filter(
      (product) => product.isCustom
    );

    localStorage.setItem(
      "shopbyte-products",
      JSON.stringify(customProducts)
    );
  }, [products]);

  // Guardar favoritos de todas las cuentas
  useEffect(() => {
    localStorage.setItem(
      "shopbyte-favorites-by-user",
      JSON.stringify(favoritesByUser)
    );
  }, [favoritesByUser]);

  // Agregar un producto
  const addProduct = (product) => {
    if (!user) return null;

    const newProduct = {
      ...product,
      id: `custom-${Date.now()}`,
      ownerId: user.id,
      seller: `${user.name || ""} ${user.lastname || ""}`.trim() || user.name,
      isCustom: true,
    };

    setProducts((previousProducts) => [
      newProduct,
      ...previousProducts,
    ]);

    return newProduct;
  };

  // Editar una publicación propia
  const updateProduct = (productId, updatedData) => {
    if (!userKey) {
      return {
        success: false,
        message: "Debes iniciar sesión.",
      };
    }

    const productToEdit = products.find(
      (product) => product.id === productId
    );

    if (!productToEdit || !productToEdit.isCustom) {
      return {
        success: false,
        message: "No se encontró la publicación.",
      };
    }

    if (String(productToEdit.ownerId) !== userKey) {
      return {
        success: false,
        message: "No tienes permiso para editar esta publicación.",
      };
    }

    setProducts((previousProducts) =>
      previousProducts.map((product) =>
        product.id === productId
          ? { ...product, ...updatedData }
          : product
      )
    );

    return {
      success: true,
      message: "Publicación actualizada correctamente.",
    };
  };

  // Comprobar si un producto es favorito
  const isFavorite = (productId) => {
    return favorites.includes(productId);
  };

  // Agregar o quitar favoritos
  const toggleFavorite = (productId) => {
    if (!userKey) return;

    setFavoritesByUser((previousFavorites) => {
      const currentFavorites = previousFavorites[userKey] || [];

      const updatedFavorites = currentFavorites.includes(productId)
        ? currentFavorites.filter((id) => id !== productId)
        : [...currentFavorites, productId];

      return {
        ...previousFavorites,
        [userKey]: updatedFavorites,
      };
    });
  };

  // Obtener productos favoritos
  const favoriteProducts = products.filter((product) =>
    favorites.includes(product.id)
  );

  return (
    <ProductContext.Provider
      value={{
        products,
        favorites,
        favoriteProducts,
        myProducts,
        isFavorite,
        toggleFavorite,
        addProduct,
        updateProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useProducts() {
  const context = useContext(ProductContext);

  if (!context) {
    throw new Error(
      "useProducts debe utilizarse dentro de ProductProvider"
    );
  }

  return context;
}
