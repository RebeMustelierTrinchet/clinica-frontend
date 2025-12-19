import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchInventory,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
} from "../../redux/inventorySlice";
import styles from "./inventory.module.css";

export default function InventoryPage() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.inventory.items);
  const loading = useSelector((state) => state.inventory.loading);
  const error = useSelector((state) => state.inventory.error);

  const [newItem, setNewItem] = useState({
    name: "",
    type: "",
    unit: "",
    stock: "",
    costPerUnit: "", 
    salary: ""
  });

  const [editingId, setEditingId] = useState(null);
  const [editItemData, setEditItemData] = useState({});

  useEffect(() => {
    dispatch(fetchInventory());
  }, [dispatch]);

  // --- Manejar cambios en nuevo item ---
  const handleNewChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  // --- Agregar nuevo item ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(
        createInventoryItem({
          name: newItem.name,
          type: newItem.type,
          unit: newItem.unit,
          stock: Number(newItem.stock),
          costPerUnit: Number(newItem.costPerUnit), // ← CAMBIADO: costPerUnit en lugar de cost
          salary: Number(newItem.salary), // ← CONSISTENTE
        
        })
      ).unwrap();
      setNewItem({
        name: "",
        type: "",
        unit: "",
        stock: "",
        costPerUnit: "",
        salary: "", // ← CONSISTENTE
       
      });
    } catch (err) {
      alert(err.error || "Error al crear item");
    }
  };

  // --- Editar item ---
  const handleEditClick = (item) => {
    setEditingId(item.id);
    setEditItemData({
      name: item.name,
      type: item.type,
      unit: item.unit,
      stock: item.stock.toString(),
      costPerUnit: item.costPerUnit.toString(), // ← CAMBIADO: item.costPerUnit en lugar de item.cost
      salary: item.salary.toString(), // ← CONSISTENTE
   
    });
  };

  const handleEditChange = (e) => {
    setEditItemData({ ...editItemData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (id) => {
    try {
      await dispatch(
        updateInventoryItem({
          id,
          item: {
            name: editItemData.name,
            type: editItemData.type,
            unit: editItemData.unit,
            stock: Number(editItemData.stock),
            costPerUnit: Number(editItemData.costPerUnit), // ← CAMBIADO: costPerUnit en lugar de cost
            salary: Number(editItemData.salary), // ← CONSISTENTE
          },
        })
      ).unwrap();
      setEditingId(null);
    } catch (err) {
      alert(err.error || "Error al actualizar item");
    }
  };

  // --- Eliminar item ---
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este item?")) return;
    try {
      await dispatch(deleteInventoryItem(id)).unwrap();
    } catch (err) {
      alert(err.error || "Error al eliminar item");
    }
  };

  if (loading) return <p>Cargando inventario...</p>;

  return (
    <div className={styles.page}>
      <h1>Inventario de la Clínica</h1>
      {error && <p className={styles.error}>{error}</p>}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Unidad</th>
            <th>Stock</th>
            <th>Costo por Unidad (USD)</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              {editingId === item.id ? (
                <>
                  <td>
                    <input
                      name="name"
                      value={editItemData.name}
                      onChange={handleEditChange}
                      className={styles.input}
                    />
                  </td>
                  <td>
                    <input
                      name="type"
                      value={editItemData.type}
                      onChange={handleEditChange}
                      className={styles.input}
                    />
                  </td>
                  <td>
                    <input
                      name="unit"
                      value={editItemData.unit}
                      onChange={handleEditChange}
                      className={styles.input}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="stock"
                      value={editItemData.stock}
                      onChange={handleEditChange}
                      className={styles.input}
                      min="0"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      step="0.01"
                      name="costPerUnit"
                      value={editItemData.costPerUnit}
                      onChange={handleEditChange}
                      className={styles.input}
                      min="0"
                    />
                  </td>
                  <td>
                 <input
                    type="number"
                    step="0.01"
                    name="salary"
                    value={newItem.salary}
                    onChange={handleNewChange}
                    placeholder="Salario por unidad (USD)"
                    min="0"
                  />
                  </td>
                  <td>
                    <button 
                      onClick={() => handleEditSubmit(item.id)}
                      className={`${styles.button} ${styles.saveButton}`}
                    >
                      Guardar
                    </button>
                    <button 
                      onClick={() => setEditingId(null)}
                      className={`${styles.button} ${styles.cancelButton}`}
                    >
                      Cancelar
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>{item.name}</td>
                  <td>{item.type || "-"}</td>
                  <td>{item.unit || "-"}</td>
                  <td>{item.stock}</td>
                  <td>${parseFloat(item.costPerUnit).toFixed(2)}</td> {/* ← CAMBIADO: item.costPerUnit */}
                  <td>${parseFloat(item.salary).toFixed(2)}</td>
                  <td>
                    <button 
                      onClick={() => handleEditClick(item)}
                      className={`${styles.button} ${styles.editButton}`}
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className={`${styles.button} ${styles.deleteButton}`}
                    >
                      Eliminar
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Agregar Nuevo Item</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <input
            type="text"
            name="name"
            value={newItem.name}
            onChange={handleNewChange}
            placeholder="Nombre *"
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <input
            type="text"
            name="type"
            value={newItem.type}
            onChange={handleNewChange}
            placeholder="Tipo"
            className={styles.input}
          />
        </div>
        
        <div className={styles.formGroup}>
          <input
            type="text"
            name="unit"
            value={newItem.unit}
            onChange={handleNewChange}
            placeholder="Unidad (ej: ml, pza, caja)"
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <input
            type="number"
            name="stock"
            value={newItem.stock}
            onChange={handleNewChange}
            placeholder="Stock *"
            required
            min="0"
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <input
            type="number"
            step="0.01"
            name="costPerUnit"
            value={newItem.costPerUnit}
            onChange={handleNewChange}
            placeholder="Costo por unidad (USD) *"
            required
            min="0"
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <input
            type="number"
            step="0.01"
            name="salary"
            value={newItem.salary}
            onChange={handleNewChange}
            placeholder="Salario por unidad (USD)"
            min="0"
            className={styles.input}
          />
        </div>
       
        <button 
          type="submit" 
          className={`${styles.button} ${styles.submitButton}`}
          disabled={loading}
        >
          {loading ? "Agregando..." : "Agregar Item"}
        </button>
      </form>
    </div>
  );
}