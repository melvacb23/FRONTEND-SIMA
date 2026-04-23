import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const URL_LOGIN = "http://127.0.0.1:8000/api/auth/login";

  function iniciarSesion(e) {
    e.preventDefault();
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
      .then((resData) => {
        // El token puede venir en resData.data.token o resData.token
        const token = resData.data ? resData.data.token : resData.token;

        // El rol puede venir en resData.data.rol o resData.rol
        const rol = resData.data?.rol || resData.rol || "";

        // Guardamos token, usuario y rol en localStorage
        localStorage.setItem("access", token);
        localStorage.setItem("username", username.trim());
        localStorage.setItem("rol", rol);

        setMensaje("Inicio de sesión correcto");

        // Redirigimos según el rol del usuario
        if (rol === "coordinador") {
          navigate("/coordinador");
        } else {
          navigate("/dashboard");
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
            <label className="login-sima-label">USUARIO</label>
            <input
              type="text"
              className="form-control login-sima-input"
              placeholder="Ingrese su usuario"
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
              onClick={() => navigate("/olvide-password")}
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