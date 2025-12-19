// src/components/ReportsByUser/ReportsByUser.js
import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserWeeklyReport, calculateTotals, clearReport } from "../../redux/reportsSlice";
import { usersApi } from "../../api/users";

export default function ReportsByUser() {
  const dispatch = useDispatch();

  const { weeklyData, dailyRecords, totals, loading } = useSelector(state => state.reports);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedUserName, setSelectedUserName] = useState("");
  const [expandedWeeks, setExpandedWeeks] = useState({});

  useEffect(() => {
    usersApi.getUsersRequest()
      .then(res => setUsers(res.data))
      .catch(err => console.error("Error cargando usuarios:", err));
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  const getDayName = (dateString) => {
    if (!dateString) return "";
    const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const date = new Date(dateString);
    return days[date.getDay()];
  };

  // Función segura para formatear números
  const safeNumber = (value, defaultValue = 0) => {
    const num = Number(value);
    return isNaN(num) ? defaultValue : num;
  };

  // Función segura para formatear con decimales
  const formatDecimal = (value, decimals = 2) => {
    const num = safeNumber(value);
    return num.toFixed(decimals);
  };

  // Calcular total seguro
  const calculateWeekTotal = (week) => {
    const pay = safeNumber(week.totalPay);
    const commission = safeNumber(week.totalCommission);
    return pay + commission;
  };

  // Calcular total diario seguro
  const calculateDayTotal = (day) => {
    const pay = safeNumber(day.dailyPay);
    const commission = safeNumber(day.commission);
    return pay + commission;
  };

  const handleSearch = async () => {
    if (!selectedUserId) return alert("Selecciona un usuario");

    const user = users.find(u => u.id === parseInt(selectedUserId));
    if (!user) return alert("Usuario no encontrado");

    setSelectedUserName(user.name);

    dispatch(clearReport());

    try {
      // Buscar todos los usuarios con mismo username
      const allUserIds = users.filter(u => u.username === user.username).map(u => u.id);

      // Llamar API para todos
      const promises = allUserIds.map(id => dispatch(fetchUserWeeklyReport(id)).unwrap());
      await Promise.all(promises);

      dispatch(calculateTotals());

      // Inicializar expansión de semanas
      const initialExpanded = {};
      weeklyData.forEach(week => { 
        if (week.weekStart) initialExpanded[week.weekStart] = false;
      });
      setExpandedWeeks(initialExpanded);
    } catch (err) {
      console.error("Error cargando reporte:", err);
    }
  };

  const toggleWeekDetails = (weekStart) => {
    setExpandedWeeks(prev => ({ ...prev, [weekStart]: !prev[weekStart] }));
  };

  // DEBUG: Ver estructura de datos
  useEffect(() => {
    if (weeklyData.length > 0) {
      console.log("=== DEBUG WEEKLY DATA ===");
      weeklyData.forEach((week, index) => {
        console.log(`Week ${index}:`, {
          weekStart: week.weekStart,
          totalPay: week.totalPay,
          totalCommission: week.totalCommission,
          typePay: typeof week.totalPay,
          typeCommission: typeof week.totalCommission
        });
      });
      console.log("Totals:", totals);
    }
  }, [weeklyData, totals]);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>📊 Reporte por Usuario</h1>

      <div className={styles.filterCard}>
        <label>Seleccionar usuario:</label>
        <select value={selectedUserId} onChange={e => setSelectedUserId(e.target.value)}>
          <option value="">-- Elegir --</option>
          {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.username})</option>)}
        </select>

        <button className={styles.searchBtn} onClick={handleSearch} disabled={loading || !selectedUserId}>
          {loading ? "Cargando..." : "Generar Reporte"}
        </button>
      </div>

      {selectedUserName && <h2>Reporte de: {selectedUserName}</h2>}

      {loading && <div className={styles.loading}>Cargando reporte...</div>}

      {!loading && weeklyData.length > 0 && (
        <div className={styles.section}>
          <h3>📅 Resumen Semanal</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Semana</th>
                <th>Días Trabajados</th>
                <th>Horas</th>
                <th>Pago</th>
                <th>Comisión</th>
                <th>Total</th>
                <th>Detalles</th>
              </tr>
            </thead>
            <tbody>
              {weeklyData.map((week, index) => (
                <React.Fragment key={week.weekStart || index}>
                  <tr className={styles.weekRow}>
                    <td>
                      {formatDate(week.weekStart)} - {formatDate(week.weekEndDate)}
                      <div className={styles.debugInfo}>
                        <small>ID: {week.id || "N/A"} | Pay: ${week.totalPay} | Comm: ${week.totalCommission}</small>
                      </div>
                    </td>
                    <td>{week.dailyRecords?.length || 0}</td>
                    <td>{formatDecimal(week.totalHours)}h</td>
                    <td>${formatDecimal(week.totalPay)}</td>
                    <td>
                      ${formatDecimal(week.totalCommission)}
                      {(!week.totalCommission && week.totalCommission !== 0) && (
                        <span className={styles.warning}> (¿Sin comisión?)</span>
                      )}
                    </td>
                    <td>
                      <strong>${formatDecimal(calculateWeekTotal(week))}</strong>
                    </td>
                    <td>
                      <button 
                        className={styles.toggleBtn}
                        onClick={() => toggleWeekDetails(week.weekStart)}
                      >
                        {expandedWeeks[week.weekStart] ? "👁️ Ocultar" : "👁️ Ver días"}
                      </button>
                    </td>
                  </tr>

                  {expandedWeeks[week.weekStart] && week.dailyRecords && (
                    <tr className={styles.detailsRow}>
                      <td colSpan="7">
                        <div className={styles.detailsContainer}>
                          <h4>📆 Detalles por día - Semana {formatDate(week.weekStart)}</h4>
                          <table className={styles.innerTable}>
                            <thead>
                              <tr>
                                <th>Día</th>
                                <th>Fecha</th>
                                <th>Check-In</th>
                                <th>Check-Out</th>
                                <th>Horas</th>
                                <th>Pago</th>
                                <th>Comisión</th>
                                <th>Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {week.dailyRecords.map((day, idx) => (
                                <tr key={idx} className={styles.dayRow}>
                                  <td>{getDayName(day.date)}</td>
                                  <td>{formatDate(day.date)}</td>
                                  <td>{day.checkIn ? new Date(day.checkIn).toLocaleTimeString() : "-"}</td>
                                  <td>{day.checkOut ? new Date(day.checkOut).toLocaleTimeString() : "-"}</td>
                                  <td>{formatDecimal(day.hours)}h</td>
                                  <td>${formatDecimal(day.dailyPay)}</td>
                                  <td>
                                    ${formatDecimal(day.commission)}
                                    {(!day.commission && day.commission !== 0) && (
                                      <span className={styles.warningSmall}> ($0)</span>
                                    )}
                                  </td>
                                  <td>
                                    <strong>${formatDecimal(calculateDayTotal(day))}</strong>
                                  </td>
                                </tr>
                              ))}
                              {/* Totales de la semana */}
                              <tr className={styles.weekTotalRow}>
                                <td colSpan="4"><strong>Total Semanal:</strong></td>
                                <td><strong>{formatDecimal(week.totalHours)}h</strong></td>
                                <td><strong>${formatDecimal(week.totalPay)}</strong></td>
                                <td><strong>${formatDecimal(week.totalCommission)}</strong></td>
                                <td><strong>${formatDecimal(calculateWeekTotal(week))}</strong></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}

              {totals && (
                <tr className={styles.finalTotal}>
                  <td colSpan="2"><strong>💰 TOTAL GENERAL</strong></td>
                  <td><strong>{formatDecimal(totals.hours)}h</strong></td>
                  <td><strong>${formatDecimal(totals.payment)}</strong></td>
                  <td><strong>${formatDecimal(totals.commission)}</strong></td>
                  <td>
                    <strong>
                      ${formatDecimal(safeNumber(totals.payment) + safeNumber(totals.commission))}
                    </strong>
                  </td>
                  <td></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Mensaje si no hay datos */}
      {!loading && weeklyData.length === 0 && selectedUserName && (
        <div className={styles.noData}>
          <p>⚠️ No se encontraron registros para {selectedUserName}</p>
        </div>
      )}

      {/* Debug panel opcional */}
      {process.env.NODE_ENV === 'development' && weeklyData.length > 0 && (
        <div className={styles.debugPanel}>
          <h4>🔍 Debug Info</h4>
          <button onClick={() => console.log("Weekly Data:", weeklyData)}>
            Ver datos completos en consola
          </button>
        </div>
      )}
    </div>
  );
}