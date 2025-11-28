import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { Link } from "react-router-dom";
import { usersApi } from "../../api/users";

export default function UsersList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
  const fetchUsers = async () => {
    try {
      const res = await usersApi.getUsersRequest(); // ✔ Usar la función correcta
      setUsers(res.data);
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
    }
  };

  fetchUsers();
}, []);
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Lista de Usuarios</h1>

      <div className={styles.topActions}>
        <Link to="/users/create" className={styles.createBtn}>
          + Crear Usuario
        </Link>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Usuario</th>
            <th>Salario</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.username}</td>
              <td>${u.salary}</td>
              <td>
                <Link to={`/users/edit/${u._id}`} className={styles.editBtn}>
                  Editar
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
