
import { Link } from "react-router-dom";
import { FiAlertCircle, FiHome } from "react-icons/fi";

function NotFound() {
  return (
    <div className="text-center py-5">
      <div className="mb-3">
        <FiAlertCircle size={64} className="text-primary" />
      </div>

      <h1 className="display-1 fw-bold">404</h1>

      <h2 className="mb-3">Página no encontrada</h2>

      <p className="text-secondary mb-4">
        Lo sentimos, la página que buscas no existe
        o fue movida.
      </p>

      <Link to="/" className="btn btn-primary">
        <FiHome className="me-2" />
        Volver al inicio
      </Link>
    </div>
  );
}

export default NotFound;
