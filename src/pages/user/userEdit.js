import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { usersApi } from "../../api/users";
import { useNavigate, useParams } from "react-router-dom";

export default function UsersEdit() {
  const { id } = useParams();
  const [form, setForm] = useState({ name: "", username: "", salary: "" });
  const navigate = useNavigate();

  useEffect(() => {
    usersApi.getById(id).then((res) => setForm(res));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await usersApi.update(id, form);
    navigate("/users");
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Editar Usuario</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label>Nombre:</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <label>Usuario:</label>
        <input
          type="text"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        <label>Salario:</label>
        <input
          type="number"
          value={form.salary}
          onChange={(e) => setForm({ ...form, salary: e.target.value })}
        />

        <button className={styles.saveBtn}>Guardar Cambios</button>
      </form>
    </div>
  );
}
