import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Importamos las vistas (Páginas)
import Login from "./pages/Auth/Login";
import OlvidePassword from "./pages/Auth/OlvidePassword";
import Usuario from "./pages/Dashboard/Usuario";
import GruposFormativos from "./pages/Grupos/GruposFormativos";

// Componente para proteger las rutas privadas
function RutaPrivada({ children }) {
  const token = localStorage.getItem("access");
  return token ? children : <Navigate to="/login" />;
}

// Componente para redirigir si ya está logueado (Rutas públicas)
function RutaPublica({ children }) {
  const token = localStorage.getItem("access");
  return !token ? children : <Navigate to="/dashboard" />;
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
        
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;