import { Link, useLocation } from "react-router-dom";

export default function SidebarCoordinador() {
  const location = useLocation();

  return (
    <aside className="coordinador-sidebar">
      <div className="coordinador-logo">SIMA</div>

      <nav className="coordinador-menu">
        <Link to="/panel" className="coordinador-link">
          <button className={location.pathname === "/panel" ? "active" : ""}>
            Dashboard
          </button>
        </Link>

        <Link to="/usuarios" className="coordinador-link">
          <button className={location.pathname === "/usuarios" ? "active" : ""}>
            Usuarios
          </button>
        </Link>

        <Link to="/fichas" className="coordinador-link">
          <button className={location.pathname === "/fichas" ? "active" : ""}>
            Fichas
          </button>
        </Link>

        <Link to="/alertas" className="coordinador-link">
          <button className={location.pathname === "/alertas" ? "active" : ""}>
            Alertas
          </button>
        </Link>

        <Link to="/configuracion" className="coordinador-link">
          <button className={location.pathname === "/configuracion" ? "active" : ""}>
            Configuración
          </button>
        </Link>
      </nav>
    </aside>
  );
}