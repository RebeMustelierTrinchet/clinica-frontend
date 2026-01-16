import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./login.module.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [isOk, setIsOk] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      setMsg(data.msg || data.message || "Error desconocido");
      setIsOk(res.ok);

      if (res.ok) {
        // Guardamos token y datos del usuario
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role);
        localStorage.setItem("userId", data.user.id);

        // Redirigir al dashboard
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Error al conectarse al servidor:", err);
      setMsg("Error de conexión al servidor");
      setIsOk(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Welcome Back</h1>

        <form className={styles.form} onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {msg && (
            <p style={{ color: isOk ? "green" : "red" }}>{msg}</p>
          )}

          <button className={styles.btn} type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
