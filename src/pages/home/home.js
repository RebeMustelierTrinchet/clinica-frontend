import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./home.module.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Bienvenido a la Clínica</h1>
      <p className={styles.subtitle}>
        Administra empleados, horas y reportes fácilmente
      </p>
      <button
        className={styles.btn}
        onClick={() => navigate("/login")}
      >
        Iniciar Sesión
      </button>
    </div>
  );
}
