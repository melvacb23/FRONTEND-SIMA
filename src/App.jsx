// Importamos useEffect y useState para manejar el estado de la sesión
import { useEffect, useState } from "react";

// Importamos el componente Login
import Login from "./Login";

// Importamos el componente Usuario
import Usuario from "./Usuario";

function App() {
  // Estado para guardar el token actual de sesión
  const [token, setToken] = useState(null);

  // useEffect se ejecuta una vez al cargar la aplicación
  useEffect(() => {
    // Como quieres que primero salga siempre el login,
    // limpiamos cualquier sesión vieja guardada
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("username");

    // Dejamos el token en null para mostrar login
    setToken(null);
  }, []);

  // Esta función se ejecuta cuando el login es correcto
  function manejarLogin() {
    // Obtenemos el token recién guardado en localStorage
    const tokenGuardado = localStorage.getItem("access");

    // Lo guardamos en el estado para cambiar a la vista Usuario
    setToken(tokenGuardado);
  }

  // Esta función se ejecuta cuando el usuario cierra sesión
  function cerrarSesion() {
    // Eliminamos los datos de sesión
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("username");

    // Volvemos a null para mostrar login nuevamente
    setToken(null);
  }

  return (
    <div>
      {/* Si hay token mostramos Usuario, si no hay token mostramos Login */}
      {token ? (
        <Usuario onLogout={cerrarSesion} />
      ) : (
        <Login onLogin={manejarLogin} />
      )}
    </div>
  );
}

export default App;