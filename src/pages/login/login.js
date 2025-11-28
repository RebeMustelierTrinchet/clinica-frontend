import React, { useState, useEffect } from "react";
import styles from "./login.module.css";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token && role === "admin") {
      setTimeout(() => navigate("/dashboard"), 0);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Login:", email, password);

    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("Respuesta del backend:", data);

      if (!res.ok) {
        setError(data.msg || "Login failed");
        setSuccess("");
        return;
      }

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role); // Guardamos el rol
        navigate("/dashboard"); // redirigimos al dashboard
    }
      setSuccess("Login exitoso!");
      setError("");
      // Aquí puedes guardar el token en localStorage o contexto
      // localStorage.setItem("token", data.token);
    } catch (err) {
      console.error("Error de login:", err);
      setError("Error de conexión con el servidor");
      setSuccess("");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Please sign in to continue</p>

        <form className={styles.form} onSubmit={handleLogin}>
          <div className={styles.field}>
            <label>Email</label>
            <input
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </div>

          <div className={styles.field}>
            <label>Password</label>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}

          <button className={styles.btn} type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
