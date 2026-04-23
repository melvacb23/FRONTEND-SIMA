import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Importamos las vistas (Páginas)
import Login from "./pages/Auth/Login";
import OlvidePassword from "./pages/Auth/OlvidePassword";
import Usuario from "./pages/Dashboard/Usuario";
import GruposFormativos from "./pages/Grupos/GruposFormativos";
import CoordinadorDashboard from "./pages/Dashboard/CoordinadorDashboard";
import GrupoDetalle from "./pages/Dashboard/GrupoDetalle";

// Rutas que solo requieren estar autenticado
function RutaPrivada({ children }) {
  const token = localStorage.getItem("access");
  return token ? children : <Navigate to="/login" />;
}

// TODO: Validación de rol DESACTIVADA temporalmente para pruebas visuales
// Restaurar RutaCoordinador con chequeo de rol antes de producción
function RutaCoordinador({ children }) {
  const token = localStorage.getItem("access");
  if (!token) return <Navigate to="/login" />;
  return children;
}

// Rutas públicas: redirige según rol si ya está logueado
function RutaPublica({ children }) {
  const token = localStorage.getItem("access");
  const rol   = localStorage.getItem("rol");
  if (!token) return children;
  return rol === "coordinador"
    ? <Navigate to="/coordinador" />
    : <Navigate to="/dashboard" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={<Navigate to="/login" />} 
        />
        
        <Route 
          path="/login" 
          element={
            <RutaPublica>
              <Login />
            </RutaPublica>
          } 
        />
        
        <Route 
          path="/olvide-password" 
          element={
            <RutaPublica>
              <OlvidePassword />
            </RutaPublica>
          } 
        />

        {/* Dashboard Coordinador — solo rol 'coordinador' */}
        <Route 
          path="/coordinador" 
          element={
            <RutaCoordinador>
              <CoordinadorDashboard />
            </RutaCoordinador>
          } 
        />

        {/* Detalle de ficha — solo rol 'coordinador' */}
        <Route 
          path="/coordinador/ficha/:codigo" 
          element={
            <RutaCoordinador>
              <GrupoDetalle />
            </RutaCoordinador>
          } 
        />

        {/* Página de acceso no autorizado */}
        <Route
          path="/no-autorizado"
          element={
            <div style={{
              display:"flex", flexDirection:"column", alignItems:"center",
              justifyContent:"center", height:"100vh", fontFamily:"Inter,sans-serif",
              background:"#f5f7f8"
            }}>
              <div style={{ fontSize:64, marginBottom:16 }}>🔒</div>
              <h2 style={{ color:"#333", marginBottom:8 }}>Acceso no autorizado</h2>
              <p style={{ color:"#888", marginBottom:24 }}>
                No tienes permiso para ver esta página.
              </p>
              <button
                onClick={() => { window.history.back(); }}
                style={{ background:"#39A900", color:"white", border:"none",
                  borderRadius:8, padding:"10px 24px", fontWeight:600,
                  fontSize:14, cursor:"pointer" }}>
                Volver
              </button>
            </div>
          }
        />
        
        {/* Dashboard Administrador (gestión de usuarios) */}
        <Route 
          path="/dashboard" 
          element={
            <RutaPrivada>
              <Usuario />
            </RutaPrivada>
          } 
        />
        
        <Route 
          path="/grupos" 
          element={
            <RutaPrivada>
              <GruposFormativos />
            </RutaPrivada>
          } 
        />

        {/* Alias /usuarios para el dashboard de gestión */}
        <Route
          path="/usuarios"
          element={
            <RutaPrivada>
              <Usuario />
            </RutaPrivada>
          }
        />
        
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;