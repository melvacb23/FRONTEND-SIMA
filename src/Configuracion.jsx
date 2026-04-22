import SidebarCoordinador from "./components/coordinador/SidebarCoordinador";
import TopbarCoordinador from "./components/coordinador/TopbarCoordinador";

export default function Configuracion({ onLogout }) {
  return (
    <div className="coordinador-layout">
      <SidebarCoordinador />
      <div className="coordinador-content">
        <TopbarCoordinador onLogout={onLogout} />
        <main className="coordinador-main">
          <div className="sima-title">Configuración</div>
          <div className="sima-card">
            <button className="sima-btn-danger" onClick={onLogout}>
              Cerrar sesión
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
