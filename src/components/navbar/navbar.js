import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./../dashbard/navbar.module.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen(!open);
  const close = () => setOpen(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/" onClick={close}>ClinicSys</Link>
      </div>
    </nav>
  );
}
