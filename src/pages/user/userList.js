import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUsers, removeUser } from "../../redux/userSlice";
import { usersApi } from "../../api/users";
import { Link } from "react-router-dom";

export default function UsersList() {
  const users = useSelector((state) => state.user.users);
  const dispatch = useDispatch();

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    username: "",
    email: "",
    role: "",
    salary: ""
  });

  useEffect(() => {
    usersApi.getUsersRequest().then((res) => dispatch(setUsers(res.data)));
  }, [dispatch]);

  const handleDelete = async (id) => {
    await usersApi.deleteUserRequest(id);
    dispatch(removeUser(id));
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setEditForm({
      name: user.name ?? "",
      username: user.username ?? "",
      email: user.email ?? "",
      role: user.role ?? "",
      salary: user.salary ?? ""
    });
  };

  const handleSave = async (id) => {
    await usersApi.updateUserRequest(id, editForm);

    // refrescar estado local
    const updatedUsers = users.map((u) =>
      u.id === id ? { ...u, ...editForm } : u
    );
    dispatch(setUsers(updatedUsers));

    setEditingId(null); // cerrar formulario
  };

  return (
    <div>
      <h1>Usuarios</h1>

      <Link to="/users/create">
        <button>Crear Usuario</button>
      </Link>

      <ul>
        {users.map((u) => (
          <li key={u.id}>
            <strong>ID:</strong> {u.id} —{" "}
            <strong>Nombre:</strong> {u.name} —{" "}
            <strong>Usuario:</strong> {u.username} —{" "}
            <strong>Email:</strong> {u.email} —{" "}
            <strong>Rol:</strong> {u.role} —{" "}
            <strong>Salario:</strong> ${u.salary}

            <button onClick={() => handleDelete(u.id)}>Eliminar</button>

            <button onClick={() => handleEdit(u)}>
              Editar
            </button>

            {/* FORMULARIO INLINE */}
            {editingId === u.id && (
              <div style={{ marginTop: "10px" }}>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  placeholder="Nombre"
                />
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) =>
                    setEditForm({ ...editForm, username: e.target.value })
                  }
                  placeholder="Usuario"
                />
                <input
                  type="text"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                  placeholder="Email"
                />
                <input
                  type="text"
                  value={editForm.role}
                  onChange={(e) =>
                    setEditForm({ ...editForm, role: e.target.value })
                  }
                  placeholder="Rol"
                />
                <input
                  type="number"
                  value={editForm.salary}
                  onChange={(e) =>
                    setEditForm({ ...editForm, salary: e.target.value })
                  }
                  placeholder="Salario"
                />

                <button onClick={() => handleSave(u.id)}>
                  Guardar
                </button>
                <button onClick={() => setEditingId(null)}>
                  Cancelar
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
