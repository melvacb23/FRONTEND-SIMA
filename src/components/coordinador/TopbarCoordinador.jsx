import { useNavigate } from "react-router-dom";

function TopbarCoordinador({ terminoBusqueda, setTerminoBusqueda }) {
  // Hook para navegar entre rutas
  const navigate = useNavigate();

  // =========================
  // FECHA ACTUAL AUTOMÁTICA
  // =========================
  // Genera la fecha actual en español de Colombia
  const fechaActual = new Date().toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  // Convierte la primera letra en mayúscula
  const fechaFormateada =
    fechaActual.charAt(0).toUpperCase() + fechaActual.slice(1);

  // =========================
  // OBTENER USUARIO DE SESIÓN
  // =========================
  // Intentamos leer distintas formas en que pudo haberse guardado el usuario
  const usuarioGuardado = localStorage.getItem("usuario");
  const usernameGuardado = localStorage.getItem("username");
  const nombreGuardado = localStorage.getItem("nombre");

  // Variable donde guardaremos el nombre final a mostrar
  let nombreUsuario = "Usuario";
  let inicialUsuario = "U";

  try {
    // Caso 1: si "usuario" existe y está guardado como JSON
    if (usuarioGuardado && usuarioGuardado.startsWith("{")) {
      const usuarioParseado = JSON.parse(usuarioGuardado);

      // Busca diferentes propiedades posibles
      nombreUsuario =
        usuarioParseado.nombre ||
        usuarioParseado.nombres ||
        usuarioParseado.username ||
        usuarioParseado.usuario ||
        "Usuario";
    }
    // Caso 2: si "usuario" existe como texto simple
    else if (usuarioGuardado) {
      nombreUsuario = usuarioGuardado;
    }
    // Caso 3: si no hay "usuario", busca "username"
    else if (usernameGuardado) {
      nombreUsuario = usernameGuardado;
    }
    // Caso 4: si no hay nada de lo anterior, busca "nombre"
    else if (nombreGuardado) {
      nombreUsuario = nombreGuardado;
    }

    // Saca la primera letra del nombre para el círculo del usuario
    inicialUsuario = nombreUsuario.charAt(0).toUpperCase();
  } catch (error) {
    // Si ocurre un error al leer el JSON, dejamos valores por defecto
    console.log("No se pudo leer el usuario de la sesión:", error);
    nombreUsuario = "Usuario";
    inicialUsuario = "U";
  }

  // =========================
  // CERRAR SESIÓN
  // =========================
  function cerrarSesion() {
    // Eliminamos datos de autenticación y usuario
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("rol");
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("username");
    localStorage.removeItem("nombre");

    // Limpiamos la sesión temporal
    sessionStorage.clear();

    // Redirigimos a la ruta principal
    // Si luego crean una ruta /login, cambias "/" por "/login"
    navigate("/");
  }

  // =========================
  // BUSCADOR CON ENTER
  // =========================
  function manejarEnter(e) {
    if (e.key === "Enter") {
      const texto = terminoBusqueda.toLowerCase().trim();

      // Navega según el texto ingresado
      if (texto.includes("usuario")) {
        navigate("/usuarios");
      } else if (
        texto.includes("ficha") ||
        texto.includes("grupo") ||
        texto.includes("grupos")
      ) {
        navigate("/fichas");
      } else if (texto.includes("alerta")) {
        navigate("/alertas");
      } else if (
        texto.includes("configuracion") ||
        texto.includes("configuración")
      ) {
        navigate("/configuracion");
      }
    }
  }

  return (
    <header className="coordinador-topbar">
      {/* Buscador principal */}
      <div className="coordinador-topbar-buscador">
        <input
          type="text"
          placeholder="Buscador aprendices, grupos..."
          value={terminoBusqueda}
          onChange={(e) => setTerminoBusqueda(e.target.value)}
          onKeyDown={manejarEnter}
        />
      </div>

      {/* Zona derecha del topbar */}
      <div className="coordinador-topbar-derecha">
        {/* Fecha y nombre del usuario logueado */}
        <div className="coordinador-topbar-info">
          <span className="coordinador-topbar-fecha">{fechaFormateada}</span>
          <strong className="coordinador-topbar-usuario">{nombreUsuario}</strong>
        </div>

        {/* Campana de notificaciones */}
        <div className="coordinador-topbar-campana">
          🔔
          <span className="coordinador-topbar-badge">3</span>
        </div>

        {/* Botón de cerrar sesión */}
        <button className="coordinador-btn-salir" onClick={cerrarSesion}>
          Cerrar sesión
        </button>

        {/* Círculo con la inicial del usuario */}
        <div className="coordinador-usuario-icono">{inicialUsuario}</div>
      </div>
    </header>
  );
}

export default TopbarCoordinador;