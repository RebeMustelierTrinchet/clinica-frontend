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
import { fetchUsers } from "../../redux/userSlice";

export default function ClinicalHistory() {
  const dispatch = useDispatch();

  // Estado global
  const items = useSelector((state) => state.inventory?.items || []);
  const history = useSelector((state) => state.clinical?.history || []);
  
  // Obtener usuarios
  const userState = useSelector((state) => state.user);
  const allUsers = userState?.users || userState?.list || [];
  
  console.log("=== DEBUG INICIAL ===");
  console.log("Usuarios cargados:", allUsers.length);
  console.log("Primer usuario:", allUsers[0]);

  // Filtrar trabajadores
  const workers = allUsers.filter((user) => {
    const role = user.role || user.userRole;
    return role === "work" || role === "worker";
  });

  console.log("Workers encontrados:", workers);

  // Estados del formulario
  const [form, setForm] = useState({
    patientName: "",
    worker: "",  // ← CAMBIADO: Ahora guarda el NOMBRE del trabajador
    dateTime: new Date().toISOString().slice(0, 16),
    service: "",
    totalCharged: 0,
    itemsUsed: [],
  });

  // Estados para control de envío
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Cargar datos
  useEffect(() => {
    console.log("Cargando datos iniciales...");
    dispatch(fetchInventory());
    dispatch(fetchClinicalHistory());
    dispatch(fetchUsers());
  }, [dispatch]);

  // Handler de cambios
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Cambiando ${name} a: "${value}"`);
    
    setForm(prev => ({ 
      ...prev, 
      [name]: name === "totalCharged" ? Number(value) : value 
    }));
  };

  const handleItemChange = (itemId, qty) => {
    const updated = form.itemsUsed.filter((i) => i.itemId !== itemId);
    if (qty > 0) updated.push({ itemId, qty: Number(qty) });
    setForm({ ...form, itemsUsed: updated });
  };

  // CORREGIDO: handleSubmit que envía lo que el backend espera
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    
    try {
      console.log("=== INICIANDO ENVÍO ===");
      console.log("Formulario actual:", form);
      
      // 1. VALIDACIONES BÁSICAS
      if (!form.patientName.trim()) {
        throw new Error("Nombre del paciente es requerido");
      }
      
      if (!form.worker) {
        throw new Error("Debes seleccionar un trabajador");
      }
      
      if (!form.service.trim()) {
        throw new Error("Servicio es requerido");
      }
      
      if (form.totalCharged <= 0) {
        throw new Error("Total debe ser mayor a 0");
      }
      
      // 2. BUSCAR TRABAJADOR SELECCIONADO
      const selectedWorker = workers.find(w => w.name === form.worker);
      console.log("Trabajador seleccionado:", selectedWorker);
      
      // 3. PREPARAR DATOS PARA EL BACKEND
      const recordToSend = {
        patientName: form.patientName.trim(),
        worker: form.worker,  // ← ENVIAR EL NOMBRE como string
        dateTime: form.dateTime || new Date().toISOString(),
        service: form.service.trim(),
        totalCharged: Number(form.totalCharged),
        itemsUsed: form.itemsUsed.map(item => ({
          itemId: item.itemId,
          qty: Number(item.qty)
        }))
      };
      
      console.log("📤 Enviando al backend:", recordToSend);
      
      // 4. ENVIAR AL BACKEND
      const resultAction = await dispatch(createClinicalRecord(recordToSend));
      
      // Verificar resultado
      if (createClinicalRecord.rejected.match(resultAction)) {
        const errorMsg = resultAction.payload?.error || "Error del servidor";
        console.error("Error del servidor:", resultAction.payload);
        throw new Error(`Error del servidor: ${errorMsg}`);
      }
      
      const newRecord = resultAction.payload;
      console.log("✅ Registro creado:", newRecord);
      
      // 5. ACTUALIZAR INVENTARIO
      if (form.itemsUsed.length > 0) {
        console.log("🔄 Actualizando inventario...");
        
        for (const used of form.itemsUsed) {
          const item = items.find(x => x.id === used.itemId);
          if (item) {
            console.log(`Descontando ${item.name}: ${item.stock} -> ${item.stock - used.qty}`);
            await dispatch(
              updateInventoryItem({
                id: used.itemId,
                item: { ...item, stock: item.stock - used.qty }
              })
            ).unwrap();
          }
        }
      }
      
      // 6. REFRESCAR DATOS
      await Promise.all([
        dispatch(fetchInventory()),
        dispatch(fetchClinicalHistory())
      ]);
      
      // 7. LIMPIAR FORMULARIO
      setForm({
        patientName: "",
        worker: "",  // ← Mantener como string vacío
        dateTime: new Date().toISOString().slice(0, 16),
        service: "",
        totalCharged: 0,
        itemsUsed: [],
      });
      
      console.log("✅ Proceso completado exitosamente");
      alert("✅ Registro guardado exitosamente");
      
    } catch (error) {
      console.error("❌ Error:", error);
      setSubmitError(error.message);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // CORREGIDO: Función para mostrar trabajador
  const getWorkerDisplay = (workerName) => {
    if (!workerName) {
      return <span style={{ color: "red", fontWeight: "bold" }}>NO ESPECIFICADO</span>;
    }
    
    return workerName;
  };

  // Función para debug
  const debugCurrentState = () => {
    console.log("=== DEBUG ESTADO ===");
    console.log("Form:", form);
    console.log("Workers:", workers);
    console.log("Historial:", history);
  };

  return (
    <div className={styles.page}>
      <h1>👨‍⚕️ Registro Clínico</h1>
      
      <button onClick={debugCurrentState} className={styles.debugBtn}>
        🔍 Debug Estado
      </button>

      <form className={styles.form} onSubmit={handleSubmit}>
        {/* Campo Patient Name */}
        <div className={styles.formGroup}>
          <label>Nombre del paciente *</label>
          <input
            type="text"
            placeholder="Ej: Juan Pérez"
            name="patientName"
            value={form.patientName}
            onChange={handleChange}
            required
          />
        </div>

        {/* Campo Worker - CORREGIDO: Ahora guarda el NOMBRE */}
        <div className={styles.formGroup}>
          <label>Trabajador responsable *</label>
          <select
            name="worker"  // ← CAMBIADO: name="worker" no "workerId"
            value={form.worker}
            onChange={handleChange}
            required
          >
            <option value="">-- SELECCIONA TRABAJADOR --</option>
            {workers.length > 0 ? (
              workers.map((w) => (
                <option key={w.id} value={w.name}>  {/* value es el NOMBRE */}
                  {w.name} ({w.username})
                </option>
              ))
            ) : (
              <option value="" disabled>
                {allUsers.length > 0 ? "No hay trabajadores" : "Cargando..."}
              </option>
            )}
          </select>
          
          <div className={styles.debugInfo}>
            Valor seleccionado: <code>{form.worker || "Ninguno"}</code>
          </div>
        </div>

        {/* Campo Fecha */}
        <div className={styles.formGroup}>
          <label>Fecha y hora *</label>
          <input
            type="datetime-local"
            name="dateTime"
            value={form.dateTime}
            onChange={handleChange}
            required
          />
        </div>

        {/* Campo Servicio */}
        <div className={styles.formGroup}>
          <label>Servicio *</label>
          <input
            type="text"
            placeholder="Ej: Scan, Consulta, Tratamiento"
            name="service"
            value={form.service}
            onChange={handleChange}
            required
          />
        </div>

        {/* Campo Total */}
        <div className={styles.formGroup}>
          <label>Total cobrado ($) *</label>
          <input
            type="number"
            placeholder="0"
            name="totalCharged"
            value={form.totalCharged}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
          />
        </div>

        {/* Items utilizados */}
        <div className={styles.section}>
          <h3>📦 Items utilizados</h3>
          {items.length > 0 ? (
            items.map((item) => (
              <div key={item.id} className={styles.itemRow}>
                <label>
                  {item.name} <small>(stock: {item.stock})</small>
                </label>
                <input
                  type="number"
                  min="0"
                  max={item.stock}
                  value={
                    form.itemsUsed.find((i) => i.itemId === item.id)?.qty || 0
                  }
                  onChange={(e) => handleItemChange(item.id, e.target.value)}
                />
              </div>
            ))
          ) : (
            <p>Cargando inventario...</p>
          )}
        </div>

        {/* Mensaje de error */}
        {submitError && (
          <div className={styles.errorAlert}>
            ❌ {submitError}
          </div>
        )}

        {/* Botón de enviar */}
        <button 
          type="submit" 
          className={styles.submitBtn}
          disabled={!form.worker || isSubmitting}
        >
          {isSubmitting ? "Guardando..." : "💾 Guardar registro"}
        </button>
      </form>

      <h2>📜 Historial Clínico</h2>
      
      {/* Estadísticas */}
      <div className={styles.stats}>
        <div>📋 Registros: {history.length}</div>
        <div>👥 Trabajadores: {workers.length}</div>
        <div>📦 Items: {items.length}</div>
      </div>
      
      {/* Lista de registros */}
      {history.length > 0 ? (
        <div className={styles.historyContainer}>
          {history.map((record) => (
            <div key={record.id} className={styles.recordCard}>
              <div className={styles.recordHeader}>
                <div className={styles.date}>
                  📅 {new Date(record.dateTime).toLocaleString()}
                </div>
                <div className={styles.patient}>
                  <strong>👤 {record.patientName}</strong>
                </div>
                <div className={styles.worker}>
                  <strong>👨‍⚕️ {getWorkerDisplay(record.worker)}</strong>
                </div>
              </div>
              
              <div className={styles.recordBody}>
                <div><strong>Servicio:</strong> {record.service}</div>
                <div><strong>Total:</strong> ${record.totalCharged?.toFixed(2)}</div>
                
                {record.itemsUsed?.length > 0 && (
                  <div>
                    <strong>Items usados:</strong>
                    <ul>
                      {record.itemsUsed.map((item, idx) => (
                        <li key={idx}>
                          {items.find(i => i.id === item.itemId)?.name || `Item ${item.itemId}`} 
                          × {item.qty}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No hay registros clínicos aún</p>
      )}
    </div>
  );
}