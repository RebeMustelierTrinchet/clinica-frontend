import React from "react";
import styles from "./dashboard.module.css";
import { Link } from "react-router-dom";
import Navbar from "../../components/dashbard/navbar";

export default function Dashboard() {
  return (
    <div className={styles.dashboard}>
      <Navbar/>

      <h1 className={styles.title}>Panel de Control</h1>
      <p className={styles.subtitle}>Bienvenida, Rebeca ✨</p>

      <div className={styles.cardsContainer}>
        <Link to="/users" className={styles.card}>
          <h2>Usuarios</h2>
          <p>Administrar empleados y sus datos</p>
        </Link>

        <Link to="/hours/mark" className={styles.card}>
          <h2>Marcar Horas</h2>
          <p>Entrada y salida de trabajadores</p>
        </Link>

        <Link to="/hours/history" className={styles.card}>
          <h2>Historial</h2>
          <p>Horas trabajadas por día y semana</p>
        </Link>

        <Link to="/reports" className={styles.card}>
          <h2>Reportes</h2>
          <p>Reportes generales y por usuario</p>
        </Link>
      </div>
    </div>
  );
}
