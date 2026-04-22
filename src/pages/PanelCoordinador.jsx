import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import SidebarCoordinador from "../components/coordinador/SidebarCoordinador";
import TopbarCoordinador from "../components/coordinador/TopbarCoordinador";
import CardResumen from "../components/coordinador/CardResumen";

import {
  obtenerResumenCoordinador,
  obtenerEstadisticasCoordinador
} from "../services/coordinadorService";

import "../styles/coordinador.css";

export default function PanelCoordinador() {
  // Hook para navegación entre rutas
  const navigate = useNavigate();

  // =========================
  // ESTADOS
  // =========================
  const [resumen, setResumen] = useState(null);
  const [estadisticas, setEstadisticas] = useState(null);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);
  const [terminoBusqueda, setTerminoBusqueda] = useState("");

  // =========================
  // CARGA INICIAL
  // =========================
  useEffect(() => {
    cargarDashboard();
  }, []);

  // =========================
  // CARGAR INFORMACIÓN
  // =========================
  async function cargarDashboard() {
    try {
      setCargando(true);
      setError("");

      const dataResumen = await obtenerResumenCoordinador();
      const dataEstadisticas = await obtenerEstadisticasCoordinador();

      setResumen(dataResumen);
      setEstadisticas(dataEstadisticas);
    } catch (err) {
      console.log(err);
      setError("Error al cargar el dashboard del coordinador");
    } finally {
      setCargando(false);
    }
  }

  // =========================
  // ACCIONES RÁPIDAS
  // =========================

  // Navega al módulo de usuarios, que ya existe en el sistema
  function irCrearUsuario() {
    navigate("/usuarios");
  }

  // Navega al módulo de fichas, que ya existe en el sistema
  function irCrearGrupo() {
    navigate("/fichas");
  }

  // Muestra un mensaje temporal porque ese módulo lo integra otro compañero
  function mostrarMensajeAprendiz() {
    alert("La funcionalidad de registrar aprendiz será integrada con el módulo correspondiente del sistema.");
  }

  // Muestra un mensaje temporal porque ese módulo lo integra otro compañero
  function mostrarMensajeHuella() {
    alert("La funcionalidad de registrar huella será integrada con el módulo correspondiente del sistema.");
  }

  // =========================
  // DATOS TEMPORALES
  // =========================
  const asistenciaSemanal = [
    { nombre: "Lun", valor: 80 },
    { nombre: "Mar", valor: 75 },
    { nombre: "Mié", valor: 90 },
    { nombre: "Jue", valor: 85 },
    { nombre: "Vie", valor: 70 }
  ];

  const alertasSeveridad = [
    { nombre: "Leves", valor: estadisticas?.alertasLeves ?? 0 },
    { nombre: "Moderadas", valor: estadisticas?.alertasModeradas ?? 0 },
    { nombre: "Graves", valor: estadisticas?.alertasGraves ?? 0 },
    { nombre: "Críticas", valor: estadisticas?.alertasCriticas ?? 0 }
  ];

  const aprendicesRiesgo = [
    {
      nombre: "Juan Pérez",
      inasistencias: 5,
      observaciones: 2,
      alertas: 1,
      riesgo: "Alto"
    },
    {
      nombre: "María Gómez",
      inasistencias: 4,
      observaciones: 1,
      alertas: 1,
      riesgo: "Medio"
    },
    {
      nombre: "Ana Martínez",
      inasistencias: 3,
      observaciones: 2,
      alertas: 0,
      riesgo: "Medio"
    }
  ];

  const accesosRecientes = [
    {
      nombre: "Carlos Ramírez",
      hora: "08:05",
      estado: "Entrada"
    },
    {
      nombre: "Andrea Salgado",
      hora: "08:02",
      estado: "Denegado"
    },
    {
      nombre: "Pedro Martínez",
      hora: "07:58",
      estado: "Entrada"
    }
  ];

  // =========================
  // CÁLCULOS DE APOYO
  // =========================
  const maxSemanal = Math.max(...asistenciaSemanal.map((item) => item.valor), 1);
  const maxAlertas = Math.max(...alertasSeveridad.map((item) => item.valor), 1);

  // =========================
  // TARJETAS RESUMEN
  // =========================
  const tarjetasResumen = [
    {
      titulo: "Aprendices activos",
      valor: estadisticas?.aprendicesActivos ?? 0,
      descripcion: "Aprendices con estado activo en formación",
      icono: "",
      color: "verde"
    },
    {
      titulo: "Instructores activos",
      valor: 0,
      descripcion: "Instructores activos registrados en el sistema",
      icono: "",
      color: "verde"
    },
    {
      titulo: "Fichas activas",
      valor: resumen?.total_fichas ?? 0,
      descripcion: "Grupos o fichas activas registradas en SIMA",
      icono: "",
      color: "azul"
    },
    {
      titulo: "Alertas activas",
      valor: estadisticas?.alertasActivas ?? 0,
      descripcion: "Alertas académicas o de seguimiento activas",
      icono: "",
      color: "verde"
    }
  ];

  const tarjetasFiltradas = tarjetasResumen.filter((tarjeta) =>
    tarjeta.titulo.toLowerCase().includes(terminoBusqueda.toLowerCase())
  );

  return (
    <div className="coordinador-layout">
      <SidebarCoordinador />

      <main className="coordinador-main">
        <TopbarCoordinador
          terminoBusqueda={terminoBusqueda}
          setTerminoBusqueda={setTerminoBusqueda}
        />

        <section className="coordinador-contenido">
          <div className="coordinador-seccion-titulo">Dashboard</div>

          {cargando && (
            <div className="coordinador-alerta-info">
              Cargando información...
            </div>
          )}

          {error && (
            <div className="coordinador-alerta-error">
              {error}
            </div>
          )}

          {resumen && !cargando && (
            <>
              {terminoBusqueda !== "" && tarjetasFiltradas.length === 0 && (
                <div className="coordinador-alerta-info">
                  No se encontraron resultados para: <strong>{terminoBusqueda}</strong>
                </div>
              )}

              {/* TARJETAS SUPERIORES */}
              <div className="coordinador-grid-resumen">
                {(terminoBusqueda === "" ? tarjetasResumen : tarjetasFiltradas).map(
                  (tarjeta, index) => (
                    <CardResumen
                      key={index}
                      titulo={tarjeta.titulo}
                      valor={tarjeta.valor}
                      descripcion={tarjeta.descripcion}
                      icono={tarjeta.icono}
                      color={tarjeta.color}
                    />
                  )
                )}
              </div>

              {/* GRÁFICAS */}
              <div className="coordinador-panel-graficas">
                <div className="coordinador-card-grande">
                  <div className="coordinador-card-header">
                    <h2>Asistencia semanal</h2>
                  </div>

                  <div className="grafico-barras">
                    {asistenciaSemanal.map((item) => (
                      <div className="grafico-item" key={item.nombre}>
                        <div
                          className="grafico-barra"
                          style={{
                            height: `${(item.valor / maxSemanal) * 180}px`
                          }}
                        ></div>
                        <span className="grafico-valor">{item.valor}%</span>
                        <span className="grafico-label">{item.nombre}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="coordinador-card-grande">
                  <div className="coordinador-card-header">
                    <h2>Alertas por severidad</h2>
                  </div>

                  <div className="grafico-barras">
                    {alertasSeveridad.map((item) => (
                      <div className="grafico-item" key={item.nombre}>
                        <div
                          className="grafico-barra grafico-barra-azul"
                          style={{
                            height: `${(item.valor / maxAlertas) * 180}px`
                          }}
                        ></div>
                        <span className="grafico-valor">{item.valor}</span>
                        <span className="grafico-label">{item.nombre}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* TABLAS */}
              <div
                className="coordinador-panel-inferior"
                style={{ marginTop: "20px" }}
              >
                <div className="coordinador-card-grande">
                  <h2>Top aprendices en riesgo</h2>

                  <table className="coordinador-tabla">
                    <thead>
                      <tr>
                        <th>Aprendiz</th>
                        <th>Inasistencias</th>
                        <th>Observaciones</th>
                        <th>Alertas</th>
                        <th>Riesgo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {aprendicesRiesgo.map((aprendiz, index) => (
                        <tr key={index}>
                          <td>{aprendiz.nombre}</td>
                          <td>{aprendiz.inasistencias}</td>
                          <td>{aprendiz.observaciones}</td>
                          <td>{aprendiz.alertas}</td>
                          <td>
                            <span
                              className={`estado ${
                                aprendiz.riesgo === "Alto"
                                  ? "denegado"
                                  : "pendiente"
                              }`}
                            >
                              {aprendiz.riesgo}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="coordinador-card-grande">
                  <h2>Accesos recientes</h2>

                  <table className="coordinador-tabla">
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Hora</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {accesosRecientes.map((acceso, index) => (
                        <tr key={index}>
                          <td>{acceso.nombre}</td>
                          <td>{acceso.hora}</td>
                          <td>
                            <span
                              className={`estado ${
                                acceso.estado === "Entrada"
                                  ? "entrada"
                                  : "denegado"
                              }`}
                            >
                              {acceso.estado}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ACCIONES RÁPIDAS */}
              <div className="coordinador-acciones-rapidas">
                <button className="btn-accion verde" onClick={irCrearUsuario}>
                   + Crear Usuario
                </button>

                <button className="btn-accion verde" onClick={irCrearGrupo}>
                   + Crear Grupo
                </button>

                <button className="btn-accion azul" onClick={mostrarMensajeAprendiz}>
                  Registrar Aprendiz
                </button>

                <button className="btn-accion azul" onClick={mostrarMensajeHuella}>
                   Registrar Huella
                </button>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}