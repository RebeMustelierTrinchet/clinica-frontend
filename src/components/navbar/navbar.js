import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./navbar.module.css";
// import { hoursApi } from "../../api/hours";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  // const navigate = useNavigate();

  const toggle = () => setOpen(!open);
  const close = () => setOpen(true);

  // const handleClockOut = async () => {
  //   const user = JSON.parse(localStorage.getItem("id"));
  //   // if (!user) return alert("No estás logueado.");

  //   try {
  //     // Marca la salida en tu API
  //     await hoursApi.mark(user.id, "out");

  //     // Limpiar sesión local y redirigir a login
  //     localStorage.removeItem("user");
  //     alert("Salida registrada correctamente. Sesión cerrada.");
  //     close();
  //     navigate("/login"); // redirige al login
  //   } catch (err) {
  //     console.error(err);
  //     alert("Error al registrar salida");
  //   }
  // };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
  <button
    className={styles.logoBtn}
    onClick={() => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        close();
        window.location.href = "/dashboard"; // o useNavigate()
      } else {
        alert("No estás logueado. No puedes acceder al dashboard.");
      }
    }}
  >
    ClinicSys
  </button>
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
        <li>
          <Link to="/" >Home</Link>
        </li>
      </ul>
    </nav>
  );
}
