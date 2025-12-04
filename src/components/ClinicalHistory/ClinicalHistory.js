// src/components/ClinicalHistory/ClinicalHistory.js
import React, { useEffect, useState } from "react";
import styles from "./ClinicalHistory.module.css";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchClinicalHistory,
  createClinicalRecord,
} from "../../redux/clinicalSlice";
import {
  fetchInventory,
  updateInventoryItem,
} from "../../redux/inventorySlice";

export default function ClinicalHistory() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.inventory.items) || [];
  const history = useSelector((state) => state.clinical.history) || [];

  const [form, setForm] = useState({
    patientName: "",
    workerId: "",
    dateTime: "",
    service: "",
    totalCharged: 0,
    itemsUsed: [],
  });

  // Traer inventario e historial clínico
  useEffect(() => {
    dispatch(fetchInventory());
    dispatch(fetchClinicalHistory());
  }, [dispatch]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleItemChange = (itemId, qty) => {
    const updated = form.itemsUsed.filter((i) => i.itemId !== itemId);
    if (qty > 0) updated.push({ itemId, qty: Number(qty) });
    setForm({ ...form, itemsUsed: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1️⃣ Crear registro clínico
      await dispatch(createClinicalRecord(form)).unwrap();

      // 2️⃣ Actualizar inventario en la DB
      for (const used of form.itemsUsed) {
        const item = items.find((x) => x.id === used.itemId);
        if (!item) continue;

        await dispatch(
          updateInventoryItem({
            id: used.itemId,
            item: { ...item, stock: item.stock - used.qty },
          })
        ).unwrap();
      }

      // 3️⃣ Refrescar inventario y historial para reflejar cambios
      await dispatch(fetchInventory());
      await dispatch(fetchClinicalHistory());

      // 4️⃣ Limpiar formulario
      setForm({
        patientName: "",
        workerId: "",
        dateTime: "",
        service: "",
        totalCharged: 0,
        itemsUsed: [],
      });
    } catch (err) {
      console.error("Error al guardar registro o actualizar inventario:", err);
    }
  };

  return (
    <div className={styles.page}>
      <h1>Registro Clínico</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre del paciente"
          name="patientName"
          value={form.patientName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          placeholder="ID del trabajador"
          name="workerId"
          value={form.workerId}
          onChange={handleChange}
          required
        />
        <input
          type="datetime-local"
          name="dateTime"
          value={form.dateTime}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          placeholder="Servicio realizado"
          name="service"
          value={form.service}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          placeholder="Total cobrado"
          name="totalCharged"
          value={form.totalCharged}
          onChange={handleChange}
          required
        />

        <h3>Items utilizados</h3>
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item.id}>
              <label>
                {item.name} (stock: {item.stock})
              </label>
              <input
                type="number"
                min="0"
                max={item.stock}
                value={
                  form.itemsUsed.find((i) => i.itemId === item.id)?.qty || 0
                }
                onChange={(e) =>
                  handleItemChange(item.id, e.target.value)
                }
              />
            </div>
          ))
        ) : (
          <p>No hay items en el inventario</p>
        )}

        <button type="submit">Guardar registro</button>
      </form>

      <h2>Historial Clínico</h2>
      {history.length > 0 ? (
        <ul>
          {history.map((r) => (
            <li key={r.id}>
              {r.dateTime} - {r.patientName} - {r.service} - Items usados:{" "}
              {r.itemsUsed
                ?.map(
                  (i) =>
                    `${items.find((x) => x.id === i.itemId)?.name || i.itemId} x${i.qty}`
                )
                .join(", ")}
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay registros clínicos aún</p>
      )}
    </div>
  );
}
