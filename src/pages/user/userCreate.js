import React, { useState } from "react";
import styles from "./styles.module.css";
import { useDispatch } from "react-redux";
import { addUser } from "../../redux/userSlice";
import { usersApi } from "../../api/users";
import { useNavigate } from "react-router-dom";

export default function UsersCreate() {
  const [form, setForm] = useState({ name: "", username: "", password: "", salary: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await usersApi.createUserRequest(form); // guarda en backend
      dispatch(addUser(res.data)); // actualiza Redux
      navigate("/users");
    } catch (err) {
      console.error("Error al crear usuario:", err);
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Crear Usuario</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input type="text" placeholder="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input type="text" placeholder="Email" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
        <input type="text" placeholder="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
        <input type="password" placeholder="Contraseña" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <input type="number" placeholder="Salario" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} />
        <button className={styles.saveBtn}>Guardar</button>
      </form>
    </div>
  );
}
