
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import productsData from "../data/products";
import { useAuth } from "./AuthContext";
import { apiRequest } from "../services/api";

const ProductContext = createContext(null);

// Adaptar los productos de PostgreSQL al formato de Shop&Byte.
const formatProduct = (product) => ({
  ...product,
  id: `db-${product.id}`,
  backendId: product.id,
  ownerId: product.user_id,
  seller: product.seller || "Vendedor",
  image: product.image || "",
  price: Number(product.price),
  stock: Number(product.stock),
  isCustom: true,
});

export function ProductProvider({ children }) {
  const { user } = useAuth();

  const [products, setProducts] = useState(productsData);
  const [loading, setLoading] = useState(true);
  const [productError, setProductError] = useState("");

  // Recuperar productos desde PostgreSQL.
  useEffect(() => {
    let active = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setProductError("");

        const data = await apiRequest("/api/products");

        const serverProducts = (
          Array.isArray(data) ? data : data.products || []
        ).map(formatProduct);

        if (active) {
          setProducts([...serverProducts, ...productsData]);
        }
      } catch (error) {
        if (active) {
          setProductError(error.message);
          setProducts(productsData);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      active = false;
    };
  }, []);

  // Favoritos separados por usuario.
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

  // Publicaciones del usuario actual.
  const myProducts = userKey
    ? products.filter(
        (product) =>
          product.isCustom &&
          String(product.ownerId) === userKey
      )
    : [];

  // Guardar favoritos de todas las cuentas.
  useEffect(() => {
    localStorage.setItem(
      "shopbyte-favorites-by-user",
      JSON.stringify(favoritesByUser)
    );
  }, [favoritesByUser]);

  // Publicar un producto en PostgreSQL.
  const addProduct = async (product) => {
    if (!user) {
      return {
        success: false,
        message: "Debes iniciar sesión.",
      };
    }

    try {
      const data = await apiRequest("/api/products", {
        method: "POST",
        body: JSON.stringify({
          name: product.name,
          price: Number(product.price),
          category: product.category,
          image: product.image,
          description: product.description,
          condition: product.condition,
          stock: Number(product.stock),
        }),
      });

      const savedProduct = formatProduct(
        data.product || data
      );

      setProducts((previousProducts) => [
        savedProduct,
        ...previousProducts,
      ]);

      return {
        success: true,
        product: savedProduct,
        message:
          data.message || "Producto publicado correctamente.",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  };

  // Editar una publicación propia en PostgreSQL.
  const updateProduct = async (productId, updatedData) => {
    if (!userKey) {
      return {
        success: false,
        message: "Debes iniciar sesión.",
      };
    }

    const productToEdit = products.find(
      (product) => String(product.id) === String(productId)
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

    try {
      const data = await apiRequest(
        `/api/products/${productToEdit.backendId}`,
        {
          method: "PUT",
          body: JSON.stringify({
            name: updatedData.name,
            price: Number(updatedData.price),
            category: updatedData.category,
            image: updatedData.image,
            description: updatedData.description,
            condition: updatedData.condition,
            stock: Number(updatedData.stock),
          }),
        }
      );

      const updatedProduct = formatProduct(
        data.product || data
      );

      setProducts((previousProducts) =>
        previousProducts.map((product) =>
          String(product.id) === String(productId)
            ? updatedProduct
            : product
        )
      );

      return {
        success: true,
        message:
          data.message || "Publicación actualizada correctamente.",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  };

  // Eliminar una publicación propia de PostgreSQL.
  const deleteProduct = async (productId) => {
    if (!userKey) {
      return {
        success: false,
        message: "Debes iniciar sesión.",
      };
    }

    const productToDelete = products.find(
      (product) => String(product.id) === String(productId)
    );

    if (!productToDelete || !productToDelete.isCustom) {
      return {
        success: false,
        message: "No se encontró la publicación.",
      };
    }

    if (String(productToDelete.ownerId) !== userKey) {
      return {
        success: false,
        message: "No tienes permiso para eliminar esta publicación.",
      };
    }

    try {
      const data = await apiRequest(
        `/api/products/${productToDelete.backendId}`,
        {
          method: "DELETE",
        }
      );

      // Actualizar el catálogo después de confirmar el borrado.
      setProducts((previousProducts) =>
        previousProducts.filter(
          (product) => String(product.id) !== String(productId)
        )
      );

      // Quitar el producto eliminado de los favoritos del usuario.
      setFavoritesByUser((previousFavorites) => ({
        ...previousFavorites,
        [userKey]: (previousFavorites[userKey] || []).filter(
          (id) => String(id) !== String(productId)
        ),
      }));

      return {
        success: true,
        message:
          data.message || "Publicación eliminada correctamente.",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  };

  // Comprobar si un producto es favorito.
  const isFavorite = (productId) => {
    return favorites.some(
      (id) => String(id) === String(productId)
    );
  };

  // Agregar o quitar favoritos.
  const toggleFavorite = (productId) => {
    if (!userKey) return;

    setFavoritesByUser((previousFavorites) => {
      const currentFavorites =
        previousFavorites[userKey] || [];

      const exists = currentFavorites.some(
        (id) => String(id) === String(productId)
      );

      const updatedFavorites = exists
        ? currentFavorites.filter(
            (id) => String(id) !== String(productId)
          )
        : [...currentFavorites, productId];

      return {
        ...previousFavorites,
        [userKey]: updatedFavorites,
      };
    });
  };

  // Obtener productos favoritos.
  const favoriteProducts = products.filter((product) =>
    isFavorite(product.id)
  );

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        productError,
        favorites,
        favoriteProducts,
        myProducts,
        isFavorite,
        toggleFavorite,
        addProduct,
        updateProduct,
        deleteProduct,
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
