import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./navbar.module.css";
import { hoursApi } from "../../api/hours";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen(!open);
  const close = () => setOpen(false);

  const handleClockOut = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return alert("No estás logueado.");

    try {
      await hoursApi.mark(user.id, "out");
      alert("Salida registrada correctamente");
      close();
    } catch (err) {
      alert("Error al registrar salida");
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/" onClick={close}>ClinicSys</Link>
      </div>

      {/* HAMBURGER */}
      <div
        className={`${styles.hamburger} ${open ? styles.active : ""}`}
        onClick={toggle}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* MENU LINKS */}
      <ul className={`${styles.navLinks} ${open ? styles.open : ""}`}>
        <li><Link to="/" onClick={close}>Inicio</Link></li>
        <li><Link to="/hours" onClick={close}>Marcar Horas</Link></li>
        <li><Link to="/admin" onClick={close}>Admin</Link></li>
        <li><Link to="/users" onClick={close}>Usuarios</Link></li>

        {/* 🔥 CLOCK OUT BUTTON */}
        <li>
          <button className={styles.clockOutBtn} onClick={handleClockOut}>
            Clock Out
          </button>
        </li>
      </ul>
    </nav>
  );
}
