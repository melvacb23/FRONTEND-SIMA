// Importamos useEffect y useState para manejar estados y carga inicial
import { useEffect, useState } from "react";

// Importamos el componente para cambiar contraseña
import CambiarPassword from "../Auth/CambiarPassword";

// Importamos los estilos
import "./Usuario.css";

// Recibimos la función onLogout desde App.jsx
import { useNavigate } from "react-router-dom";

export default function Usuario() {
  const navigate = useNavigate();
  // Estado para guardar la lista completa de usuarios
  const [usuarios, setUsuarios] = useState([]);

  // Estado para guardar la lista de roles
  const [roles, setRoles] = useState([]);

  // Estado para guardar el texto del buscador
  const [busquedaDocumento, setBusquedaDocumento] = useState("");

  // Estado para guardar la lista filtrada que se muestra en la tabla
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);

  // Estados del formulario de creación
  const [username, setUsername] = useState("");
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [correo, setCorreo] = useState("");
  const [rol, setRol] = useState("");

  // Estado para mostrar mensajes generales
  const [mensaje, setMensaje] = useState("");

  // Estado para errores al cargar usuarios
  const [errorUsuarios, setErrorUsuarios] = useState("");

  // Estado para errores al cargar roles
  const [errorRoles, setErrorRoles] = useState("");

  // Guarda el id del usuario que se está editando
  const [editandoId, setEditandoId] = useState(null);

  // Guarda los valores de la fila que se está editando
  const [filaEditando, setFilaEditando] = useState({
    username: "",
    nombres: "",
    apellidos: "",
    tipo_documento: "",
    numero_documento: "",
    correo: "",
    rol: "",
    estado: "ACTIVO"
  });

  // Endpoints del backend
  const URL_USUARIOS = "http://127.0.0.1:8000/api/usuarios/";
  const URL_ROLES = "http://127.0.0.1:8000/api/roles/";

  // Al cargar el componente, consultamos usuarios y roles
  useEffect(() => {
    cargarUsuarios();
    cargarRoles();
  }, []);

  // Construye los headers con el token
  function obtenerHeaders() {
    const token = localStorage.getItem("access");

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    };
  }

  // Normaliza la respuesta del backend
  // Si Django devuelve lista directa, retorna la lista
  // Si Django devuelve objeto con "results", retorna results
  function normalizarLista(data) {
    if (Array.isArray(data)) {
      return data;
    }

    if (data && Array.isArray(data.results)) {
      return data.results;
    }

    return [];
  }

  // Carga usuarios desde el backend
  async function cargarUsuarios() {
    try {
      setErrorUsuarios("");

      const res = await fetch(URL_USUARIOS, {
        method: "GET",
        headers: obtenerHeaders()
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        console.log("Error usuarios:", res.status, data);
        throw data || { detail: "No se pudieron cargar los usuarios" };
      }

      // Guardamos lista completa
      const listaUsuarios = normalizarLista(data);
      setUsuarios(listaUsuarios);

      // Mostramos todos al inicio en la tabla
      setUsuariosFiltrados(listaUsuarios);
    } catch (error) {
      console.log(error);
      setErrorUsuarios("Error al cargar los usuarios");
    }
  }

  // Carga roles desde el backend
  async function cargarRoles() {
    try {
      setErrorRoles("");

      const res = await fetch(URL_ROLES, {
        method: "GET",
        headers: obtenerHeaders()
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        console.log("Error roles:", res.status, data);
        throw data || { detail: "No se pudieron cargar los roles" };
      }

      setRoles(normalizarLista(data));
    } catch (error) {
      console.log(error);
      setErrorRoles("Error al cargar los roles");
    }
  }

  // Busca usuario por número de documento
  function buscarUsuarioPorDocumento() {
    // Limpiamos espacios
    const textoBusqueda = busquedaDocumento.trim();

    // Si no escribió nada, mostramos todos
    if (textoBusqueda === "") {
      setUsuariosFiltrados(usuarios);
      setMensaje("Mostrando todos los usuarios");
      return;
    }

    // Filtramos por coincidencia parcial
    const resultado = usuarios.filter((item) =>
      item.numero_documento?.toString().includes(textoBusqueda)
    );

    // Guardamos resultado filtrado
    setUsuariosFiltrados(resultado);

    // Mensaje según resultado
    if (resultado.length > 0) {
      setMensaje("Búsqueda realizada correctamente");
    } else {
      setMensaje("No se encontraron usuarios con ese número de documento");
    }
  }

  // Limpia la búsqueda y vuelve a mostrar todos
  function limpiarBusqueda() {
    setBusquedaDocumento("");
    setUsuariosFiltrados(usuarios);
    setMensaje("Búsqueda limpiada");
  }

  // Guarda un nuevo usuario
  async function guardarUsuario(e) {
    e.preventDefault();
    setMensaje("");

    const data = {
      username: username.trim(),
      email: correo.trim(),
      nombres: nombres.trim(),
      apellidos: apellidos.trim(),
      tipo_documento: tipoDocumento,
      numero_documento: numeroDocumento.trim(),
      rol: parseInt(rol),
      estado: "ACTIVO"
    };

    try {
      const res = await fetch(URL_USUARIOS, {
        method: "POST",
        headers: obtenerHeaders(),
        body: JSON.stringify(data)
      });

      const respuesta = await res.json().catch(() => null);

      if (!res.ok) {
        throw respuesta || { detail: "No se pudo crear el usuario" };
      }

      setMensaje("Usuario creado correctamente");
      limpiarFormulario();
      cargarUsuarios();
    } catch (error) {
      mostrarError(error);
    }
  }

  // Elimina un usuario
  async function eliminarUsuario(id) {
    const confirmar = window.confirm("¿Está seguro de eliminar este usuario?");
    if (!confirmar) return;

    try {
      const res = await fetch(URL_USUARIOS + id + "/", {
        method: "DELETE",
        headers: obtenerHeaders()
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw data || { detail: "No se pudo eliminar el usuario" };
      }

      setMensaje("Usuario eliminado correctamente");

      if (editandoId === id) {
        cancelarEdicion();
      }

      cargarUsuarios();
    } catch (error) {
      console.log(error);
      setMensaje("Error al eliminar el usuario");
    }
  }

  // Activa edición de un usuario
  function iniciarEdicion(usuario) {
    setEditandoId(usuario.id);

    setFilaEditando({
      username: usuario.username || "",
      nombres: usuario.nombres || "",
      apellidos: usuario.apellidos || "",
      tipo_documento: usuario.tipo_documento || "",
      numero_documento: usuario.numero_documento || "",
      correo: usuario.email || "",
      rol: usuario.rol ? usuario.rol.toString() : "",
      estado: usuario.estado || "ACTIVO"
    });

    setMensaje("Editando usuario en la tabla");
  }

  // Cancela la edición
  function cancelarEdicion() {
    setEditandoId(null);

    setFilaEditando({
      username: "",
      nombres: "",
      apellidos: "",
      tipo_documento: "",
      numero_documento: "",
      correo: "",
      rol: "",
      estado: "ACTIVO"
    });

    setMensaje("");
  }

  // Cambia los datos mientras se edita una fila
  function cambiarFilaEditando(e) {
    const { name, value } = e.target;

    setFilaEditando({
      ...filaEditando,
      [name]: value
    });
  }

  // Guarda edición de usuario
  async function guardarEdicion(id) {
    const data = {
      username: filaEditando.username.trim(),
      email: filaEditando.correo.trim(),
      nombres: filaEditando.nombres.trim(),
      apellidos: filaEditando.apellidos.trim(),
      tipo_documento: filaEditando.tipo_documento,
      numero_documento: filaEditando.numero_documento.trim(),
      rol: parseInt(filaEditando.rol),
      estado: filaEditando.estado
    };

    try {
      const res = await fetch(URL_USUARIOS + id + "/", {
        method: "PUT",
        headers: obtenerHeaders(),
        body: JSON.stringify(data)
      });

      const respuesta = await res.json().catch(() => null);

      if (!res.ok) {
        throw respuesta || { detail: "No se pudo actualizar el usuario" };
      }

      setMensaje("Usuario actualizado correctamente");
      cancelarEdicion();
      cargarUsuarios();
    } catch (error) {
      mostrarError(error);
    }
  }

  // Muestra errores del backend
  function mostrarError(error) {
    console.log(error);

    if (error?.username) {
      setMensaje(error.username[0]);
    } else if (error?.numero_documento) {
      setMensaje(error.numero_documento[0]);
    } else if (error?.email) {
      setMensaje(error.email[0]);
    } else if (error?.correo) {
      setMensaje(error.correo[0]);
    } else if (error?.password) {
      setMensaje(error.password[0]);
    } else if (error?.rol) {
      setMensaje(error.rol[0]);
    } else if (error?.tipo_documento) {
      setMensaje(error.tipo_documento[0]);
    } else if (error?.detail) {
      setMensaje(error.detail);
    } else {
      setMensaje("Error al guardar el usuario");
    }
  }

  // Limpia el formulario
  function limpiarFormulario() {
    setUsername("");
    setNombres("");
    setApellidos("");
    setTipoDocumento("");
    setNumeroDocumento("");
    setCorreo("");
    setRol("");
  }

  // Cierra la sesión
  function cerrarSesion() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("username");

    navigate("/login");
  }

  // Devuelve el nombre del rol
  function obtenerNombreRol(item) {
    const rolId = typeof item.rol === "object" ? item.rol?.id : Number(item.rol);
    const rolEncontrado = roles.find((r) => Number(r.id) === Number(rolId));
    return rolEncontrado ? rolEncontrado.nombre : "";
  }

  return (
    <div className="sima-layout">
      {/* Barra lateral */}
      <aside className="sima-sidebar">
        <div className="sima-logo">SIMA</div>

        <div className="sima-menu">
          <button>Inicio</button>
          <button className="active">Gestión de usuarios</button>
          <button onClick={() => navigate("/grupos")}>Gestión de fichas</button>
          <button>Configuración</button>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="sima-main">
        {/* Barra superior */}
        <div className="sima-topbar">
          <div className="sima-search-box">
            <input
              type="text"
              className="sima-search"
              placeholder="Buscar por número de documento..."
              value={busquedaDocumento}
              onChange={(e) => setBusquedaDocumento(e.target.value)}
            />

            <button
              type="button"
              className="sima-btn-search"
              onClick={buscarUsuarioPorDocumento}
            >
              Buscar
            </button>

            <button
              type="button"
              className="sima-btn-clear"
              onClick={limpiarBusqueda}
            >
              Limpiar
            </button>
          </div>

          <div className="sima-userbox">
            <button className="sima-btn-danger" onClick={cerrarSesion}>
              Cerrar sesión
            </button>
            <div className="sima-user-icon">U</div>
          </div>
        </div>

        {/* Contenido */}
        <div className="sima-content">
          <div className="sima-title">Gestión de usuarios</div>

          {/* Mensajes */}
          {mensaje && <div className="alert alert-info">{mensaje}</div>}
          {errorUsuarios && <div className="alert alert-danger">{errorUsuarios}</div>}
          {errorRoles && <div className="alert alert-warning">{errorRoles}</div>}

          {/* Formulario */}
          <div className="sima-card">
            <div className="sima-section-title">Crear usuario</div>

            <form onSubmit={guardarUsuario}>
              <div className="sima-form-grid">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nombre de usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nombres"
                  value={nombres}
                  onChange={(e) => setNombres(e.target.value)}
                  required
                />
              </div>

              <div className="sima-form-grid-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Apellidos"
                  value={apellidos}
                  onChange={(e) => setApellidos(e.target.value)}
                  required
                />
                <select
                  className="form-select"
                  value={tipoDocumento}
                  onChange={(e) => setTipoDocumento(e.target.value)}
                  required
                >
                  <option value="">Seleccione tipo de documento</option>
                  <option value="CC">Cédula de ciudadanía</option>
                  <option value="TI">Tarjeta de identidad</option>
                  <option value="CE">Cédula de extranjería</option>
                  <option value="PPT">Permiso por Protección Temporal</option>
                  <option value="PAS">Pasaporte</option>
                </select>
              </div>

              <div className="sima-form-grid-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Número de documento"
                  value={numeroDocumento}
                  onChange={(e) => setNumeroDocumento(e.target.value)}
                  required
                />
                <input
                  type="email"
                  className="form-control"
                  placeholder="Correo"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  required
                />
                <select
                  className="form-select"
                  value={rol}
                  onChange={(e) => setRol(e.target.value)}
                  required
                >
                  <option value="">Seleccione un rol</option>
                  {roles.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-3">
                <button type="submit" className="sima-btn-green w-100">
                  Guardar usuario
                </button>
              </div>
            </form>
          </div>

          {/* Tabla */}
          <div className="sima-card">
            <div className="sima-section-title">Usuarios registrados</div>

            <table className="table table-bordered table-striped sima-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Nombres</th>
                  <th>Apellidos</th>
                  <th>Tipo Doc.</th>
                  <th>Documento</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.length > 0 ? (
                  usuariosFiltrados.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>

                      {editandoId === item.id ? (
                        <>
                          <td>
                            <input
                              type="text"
                              className="form-control"
                              name="username"
                              value={filaEditando.username}
                              onChange={cambiarFilaEditando}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className="form-control"
                              name="nombres"
                              value={filaEditando.nombres}
                              onChange={cambiarFilaEditando}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className="form-control"
                              name="apellidos"
                              value={filaEditando.apellidos}
                              onChange={cambiarFilaEditando}
                            />
                          </td>
                          <td>
                            <select
                              className="form-select"
                              name="tipo_documento"
                              value={filaEditando.tipo_documento}
                              onChange={cambiarFilaEditando}
                            >
                              <option value="CC">Cédula de ciudadanía</option>
                              <option value="TI">Tarjeta de identidad</option>
                              <option value="CE">Cédula de extranjería</option>
                              <option value="PPT">Permiso por Protección Temporal</option>
                              <option value="PAS">Pasaporte</option>
                            </select>
                          </td>
                          <td>
                            <input
                              type="text"
                              className="form-control"
                              name="numero_documento"
                              value={filaEditando.numero_documento}
                              onChange={cambiarFilaEditando}
                            />
                          </td>
                          <td>
                            <input
                              type="email"
                              className="form-control"
                              name="correo"
                              value={filaEditando.correo}
                              onChange={cambiarFilaEditando}
                            />
                          </td>
                          <td>
                            <select
                              className="form-select"
                              name="rol"
                              value={filaEditando.rol}
                              onChange={cambiarFilaEditando}
                            >
                              <option value="">Seleccione un rol</option>
                              {roles.map((r) => (
                                <option key={r.id} value={r.id}>
                                  {r.nombre}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td>
                            {filaEditando.estado === "ACTIVO" ? "Activo" : filaEditando.estado}
                          </td>
                          <td>
                            <div className="sima-actions">
                              <button
                                type="button"
                                className="btn btn-success btn-sm"
                                onClick={() => guardarEdicion(item.id)}
                              >
                                Guardar
                              </button>
                              <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                onClick={cancelarEdicion}
                              >
                                Cancelar
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td>{item.username}</td>
                          <td>{item.nombres}</td>
                          <td>{item.apellidos}</td>
                          <td>{item.tipo_documento}</td>
                          <td>{item.numero_documento}</td>
                          <td>{item.email}</td>
                          <td>{obtenerNombreRol(item)}</td>
                          <td>{item.estado === "ACTIVO" ? "Activo" : item.estado}</td>
                          <td>
                            <div className="sima-actions">
                              <button
                                type="button"
                                className="btn btn-warning btn-sm"
                                onClick={() => iniciarEdicion(item)}
                              >
                                Editar
                              </button>
                              <button
                                type="button"
                                className="btn btn-danger btn-sm"
                                onClick={() => eliminarUsuario(item.id)}
                              >
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center">
                      No hay usuarios para mostrar
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Cambiar contraseña */}
          <div className="sima-card sima-password-box">
            <CambiarPassword />
          </div>
        </div>
      </main>
    </div>
  );
}