// Función para obtener el resumen del dashboard del coordinador
export async function obtenerResumenCoordinador() {
  // Obtenemos el token guardado al iniciar sesión
  const token = localStorage.getItem("access");

  // Hacemos la petición al backend real del dashboard
  const response = await fetch("http://localhost:3000/api/dashboard/coordinador/resumen", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });

  // Si la respuesta no fue correcta, lanzamos error
  if (!response.ok) {
    throw new Error("Error al cargar el resumen del coordinador");
  }

  // Convertimos la respuesta a JSON
  const resultado = await response.json();

  // Adaptamos la estructura del backend a lo que usará el frontend
  return {
    total_areas: resultado.data.kpis.total_areas,
    total_programas: resultado.data.kpis.total_programas,
    total_fichas: resultado.data.kpis.total_grupos_activos,
    aprendices_activos: resultado.data.kpis.total_aprendices_activos,
    alertas_activas: resultado.data.kpis.total_alertas_activas,
    observaciones_abiertas: resultado.data.kpis.total_observaciones_abiertas,
    inasistencias_validas: resultado.data.kpis.total_inasistencias_validas,
    areas: resultado.data.areas,
    programas: resultado.data.programas,
    modulo: "Coordinador",
    mensaje: "Resumen del panel del coordinador"
  };
}

// Función temporal para estadísticas del coordinador
// Por ahora reutilizamos el mismo resumen porque la ruta /estadisticas
// no existe aún en el backend real
export async function obtenerEstadisticasCoordinador() {
  const resumen = await obtenerResumenCoordinador();

  return {
    totalUsuarios: 0,
    usuariosActivos: 0,
    usuariosInactivos: 0,
    totalAprendices: resumen.aprendices_activos ?? 0,
    aprendicesActivos: resumen.aprendices_activos ?? 0,
    alertasActivas: resumen.alertas_activas ?? 0,
    alertasCerradas: 0,
    alertasCriticas: 0,
    alertasGraves: 0,
    alertasModeradas: 0,
    alertasLeves: 0
  };
}