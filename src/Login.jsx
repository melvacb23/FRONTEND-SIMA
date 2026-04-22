import { useState } from "react";
import "./Login.css";
import OlvidePassword from "./OlvidePassword";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [mostrarOlvide, setMostrarOlvide] = useState(false);

  const URL_LOGIN = "/api/auth/login";

  function iniciarSesion(e) {
    setMensaje("");

    const data = {
      numero_documento: username.trim(),
      password: password
    };

    fetch(URL_LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then((res) => {
        return res.json().then((data) => {
          if (!res.ok) throw data;
          return data;
        });
      })
      .then((data) => {
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
        localStorage.setItem("username", username.trim());

        setMensaje("Inicio de sesión correcto");

        if (onLogin) {
          onLogin();
        }
      })
      .catch((error) => {
        console.log("Error login:", error);

        if (error.detail) {
          setMensaje(error.detail);
        } else if (error.username) {
          setMensaje(error.username[0]);
        } else if (error.password) {
          setMensaje(error.password[0]);
        } else {
          setMensaje("Error al iniciar sesión");
        }
      });
  }

  function manejarCambioUsername(e) {
    setUsername(e.target.value);
    if (mensaje) setMensaje("");
  }

  function manejarCambioPassword(e) {
    setPassword(e.target.value);
    if (mensaje) setMensaje("");
  }

  if (mostrarOlvide) {
    return <OlvidePassword onVolver={() => setMostrarOlvide(false)} />;
  }

  return (
    <div className="login-sima-container">
      <div className="login-sima-logo">SIMA</div>

      <div className="login-sima-card">
        <h2 className="login-sima-title">INICIAR SESIÓN</h2>

        {mensaje && (
          <div className="alert alert-info mt-3">
            {mensaje}
          </div>
        )}

        <form onSubmit={iniciarSesion}>
          <div className="mb-3">
            <label className="login-sima-label">NÚMERO DE DOCUMENTO</label>
            <input
              type="text"
              className="form-control login-sima-input"
              placeholder="Ingrese su número de documento"
              value={username}
              onChange={manejarCambioUsername}
              required
            />
          </div>

          <div className="mb-3">
            <label className="login-sima-label">CONTRASEÑA</label>
            <input
              type="password"
              className="form-control login-sima-input"
              placeholder="Ingrese su contraseña"
              value={password}
              onChange={manejarCambioPassword}
              required
            />
          </div>

          <div className="login-sima-extra">
            <label className="login-sima-check">
              <input type="checkbox" /> Recuérdame
            </label>

            <button
              type="button"
              className="login-sima-link-btn"
              onClick={() => setMostrarOlvide(true)}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <button type="submit" className="login-sima-btn">
            Iniciar
          </button>
        </form>
      </div>

      <div className="login-sima-wave"></div>
    </div>
  );
}