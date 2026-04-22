// Importamos useEffect y useState para manejar la sesión
import { useEffect, useState } from "react";

// Importamos BrowserRouter para que funcionen useNavigate y la navegación
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Importamos login
import Login from "./Login";

// Importamos dashboard
import PanelCoordinador from "./pages/PanelCoordinador";

// Importamos gestión de usuarios
import Usuario from "./Usuario";

function App() {
  // Estado para guardar el token actual
  const [token, setToken] = useState(null);

  // Al cargar la app, revisamos si ya existe un token guardado
  useEffect(() => {
    const tokenGuardado = localStorage.getItem("access");

    if (tokenGuardado) {
      setToken(tokenGuardado);
    }
  }, []);

  // Se ejecuta cuando el login es correcto
  function manejarLogin() {
    const tokenGuardado = localStorage.getItem("access");
    setToken(tokenGuardado);
  }

  // Se ejecuta al cerrar sesión
  function cerrarSesion() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("username");
    localStorage.removeItem("usuario");
    localStorage.removeItem("rol");
    localStorage.removeItem("nombre");
    sessionStorage.clear();

    setToken(null);
  }

  return (
    <BrowserRouter>
      {/* Si hay token, mostramos las rutas del dashboard; si no, login */}
      {token ? (
        <Routes>
          <Route path="/panel" element={<PanelCoordinador onLogout={cerrarSesion} />} />
          <Route path="/usuarios" element={<Usuario onLogout={cerrarSesion} />} />
          <Route path="/" element={<Navigate to="/panel" replace />} />
          {/* Agregar más rutas según sea necesario */}
        </Routes>
      ) : (
        <Login onLogin={manejarLogin} />
      )}
    </BrowserRouter>
  );
}

export default App;