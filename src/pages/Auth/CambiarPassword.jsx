import "../Dashboard/Usuario.css";
import { useState } from "react";

export default function CambiarPassword() {
  const [passwordActual, setPasswordActual] = useState("");
  const [passwordNueva, setPasswordNueva] = useState("");
  const [passwordConfirmar, setPasswordConfirmar] = useState("");
  const [mensaje, setMensaje] = useState("");

  const URL_CAMBIAR_PASSWORD = "http://127.0.0.1:8000/api/cambiar-password/";

  function obtenerHeaders() {
    const token = localStorage.getItem("access");

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    };
  }

  function cambiarPassword(e) {
    e.preventDefault();
    setMensaje("");

    const data = {
      password_actual: passwordActual,
      password_nueva: passwordNueva,
      password_confirmar: passwordConfirmar
    };

    fetch(URL_CAMBIAR_PASSWORD, {
      method: "POST",
      headers: obtenerHeaders(),
      body: JSON.stringify(data)
    })
      .then((res) => {
        return res.json().then((data) => {
          if (!res.ok) throw data;
          return data;
        });
      })
      .then((data) => {
        setMensaje(data.mensaje);
        setPasswordActual("");
        setPasswordNueva("");
        setPasswordConfirmar("");
      })
      .catch((error) => {
        console.log(error);

        if (error.error) {
          setMensaje(error.error);
        } else {
          setMensaje("Error al cambiar la contraseña");
        }
      });
  }

  return (
    <div className="card mt-4">
      <div className="card-body">
        <h4 className="mb-3">Cambiar mi contraseña</h4>

        {mensaje && (
          <div className="alert alert-info">
            {mensaje}
          </div>
        )}

        <form onSubmit={cambiarPassword}>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Contraseña actual"
              value={passwordActual}
              onChange={(e) => setPasswordActual(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Nueva contraseña"
              value={passwordNueva}
              onChange={(e) => setPasswordNueva(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Confirmar nueva contraseña"
              value={passwordConfirmar}
              onChange={(e) => setPasswordConfirmar(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="sima-btn-dark">
            Actualizar contraseña
          </button>
        </form>
      </div>
    </div>
  );
}