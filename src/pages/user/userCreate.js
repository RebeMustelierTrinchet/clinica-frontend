import React, { useState } from "react";
import styles from "./styles.module.css";
import { usersApi } from "../../api/users";
import { useNavigate } from "react-router-dom";

export default function UsersCreate() {
  const [form, setForm] = useState({ name: "", username: "", password: "", salary: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await usersApi.createUserRequest(form); // ✔ cambiar aquí
    navigate("/users");
  } catch (err) {
    console.error("Error al crear usuario:", err);
  }
};

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Crear Usuario</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label>Nombre:</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <label>Email:</label>
        <input
          type="text"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        <label>Contraseña:</label>
        <input
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <label>Salario:</label>
        <input
          type="number"
          value={form.salary}
          onChange={(e) => setForm({ ...form, salary: e.target.value })}
        />

        <button className={styles.saveBtn}>Guardar</button>
      </form>
    </div>
  );
}
