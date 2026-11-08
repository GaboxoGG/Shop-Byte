
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ProductDetail from "./pages/ProductDetail";
import PublishProduct from "./pages/PublishProduct";
import Favorites from "./pages/Favorites";
import EditProduct from "./pages/EditProduct";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <div className="app-container">
      <Navbar />

      <main className="container flex-grow-1 py-4">
        <Routes>
          {/* Página principal */}
          <Route path="/" element={<Home />} />

          {/* Autenticación */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />

          {/* Perfil protegido */}
          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Publicar producto */}
          <Route
            path="/publicar"
            element={
              <ProtectedRoute>
                <PublishProduct />
              </ProtectedRoute>
            }
          />

          {/* Detalle del producto */}
          <Route
            path="/producto/:id"
            element={<ProductDetail />}
          />

          {/* Favoritos protegidos */}
          <Route
            path="/favoritos"
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            }
          />

          {/* Editar publicación propia */}
          <Route
            path="/editar-producto/:id"
            element={
              <ProtectedRoute>
                <EditProduct />
              </ProtectedRoute>
            }
          />

          {/* Página 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
