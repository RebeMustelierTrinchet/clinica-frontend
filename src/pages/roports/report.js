import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { hoursApi } from "../../api/hours";
import { usersApi } from "../../api/users";

export default function ReportsByUser() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedUserName, setSelectedUserName] = useState("");
  const [weeklyData, setWeeklyData] = useState([]);
  const [dailyRecords, setDailyRecords] = useState([]);
  const [totals, setTotals] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedWeeks, setExpandedWeeks] = useState({});

  useEffect(() => {
    usersApi.getUsersRequest()
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error cargando usuarios:", err));
  }, []);

  const groupWeeksByDateRange = (weeks) => {
    const grouped = {};

    weeks.forEach((week) => {
      const key = `${week.weekStart}_${week.weekEndDate}`;

      if (!grouped[key]) {
        grouped[key] = {
          ...week,
          dailyRecords: [],
        };
      }

      // Agregar registros diarios
      if (week.dailyRecords) {
        grouped[key].dailyRecords = [
          ...grouped[key].dailyRecords,
          ...week.dailyRecords,
        ];
      }

      // Sumar horas, pago y comisiones
      grouped[key].totalHours = (grouped[key].totalHours || 0) + (week.totalHours || 0);
      grouped[key].totalPay = (grouped[key].totalPay || 0) + ((week.totalPay || 0) + (week.totalCommission || 0));

      // Contar días únicos
      const uniqueDays = new Set([
        ...(grouped[key].dailyRecords?.map((r) => r.date) || []),
        ...(week.dailyRecords?.map((r) => r.date) || []),
      ]);
      grouped[key].daysWorked = uniqueDays.size;
    });

    return Object.values(grouped).sort(
      (a, b) => new Date(b.weekStart) - new Date(a.weekStart)
    );
  };

  const handleSearch = async () => {
    if (!selectedUserId) {
      alert("Por favor selecciona un usuario");
      return;
    }

    setLoading(true);
    try {
      const user = users.find((u) => u.id === parseInt(selectedUserId));
      if (!user) {
        alert("Usuario no encontrado");
        return;
      }

      setSelectedUserName(user?.name || "");

      // Todos los usuarios con el mismo username
      const allUserIdsWithSameUsername = users
        .filter((u) => u.username === user.username)
        .map((u) => u.id);

      // Llamar al endpoint para cada usuario
      const allResults = await Promise.all(
        allUserIdsWithSameUsername.map((id) => hoursApi.getUserWeeklyReport(id))
      );

      const combinedWeeklyData = [];
      const combinedDailyRecords = [];

      allResults.forEach((res, index) => {
        const userId = allUserIdsWithSameUsername[index];

        if (res.data.weeklySummary) {
          res.data.weeklySummary.forEach((week) => {
            combinedWeeklyData.push({
              ...week,
              sourceUserId: userId,
            });
          });
        }

        if (res.data.dailyRecords) {
          res.data.dailyRecords.forEach((record) => {
            combinedDailyRecords.push({
              ...record,
              sourceUserId: userId,
            });
          });
        }
      });

      combinedWeeklyData.sort((a, b) => new Date(b.weekStart) - new Date(a.weekStart));
      combinedDailyRecords.sort((a, b) => new Date(b.date) - new Date(a.date));

      const groupedWeeklyData = groupWeeksByDateRange(combinedWeeklyData);

      setWeeklyData(groupedWeeklyData);
      setDailyRecords(combinedDailyRecords);

      // Totales incluyendo comisiones
      const newTotals = {
        totalHours: combinedDailyRecords.reduce((sum, r) => sum + (r.hours || 0), 0),
        totalPay: combinedDailyRecords.reduce((sum, r) => sum + ((r.dailyPay || 0) + (r.commission || 0)), 0),
        totalWeeks: groupedWeeklyData.length,
        totalUsers: allUserIdsWithSameUsername.length,
      };
      setTotals(newTotals);

      // Inicializar expansión
      const initialExpanded = {};
      groupedWeeklyData.forEach((week) => {
        initialExpanded[week.weekStart] = false;
      });
      setExpandedWeeks(initialExpanded);
    } catch (err) {
      console.error("Error cargando reporte:", err);
      alert("Error al cargar el reporte");
    } finally {
      setLoading(false);
    }
  };

  const toggleWeekDetails = (weekStart) => {
    setExpandedWeeks((prev) => ({
      ...prev,
      [weekStart]: !prev[weekStart],
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getDayName = (dateString) => {
    const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const date = new Date(dateString);
    return days[date.getDay()];
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Reporte por Usuario</h1>

      <div className={styles.filterCard}>
        <label>Seleccionar usuario:</label>
        <select
          className={styles.select}
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
        >
          <option value="">-- Elegir --</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name} ({u.username})
            </option>
          ))}
        </select>

        <button
          className={styles.searchBtn}
          onClick={handleSearch}
          disabled={loading || !selectedUserId}
        >
          {loading ? "Cargando..." : "Generar Reporte"}
        </button>
      </div>

      {selectedUserName && (
        <div className={styles.userInfo}>
          <h2>Reporte de: {selectedUserName}</h2>
          {totals && totals.totalUsers > 1 && (
            <div className={styles.userNote}>
              <small>
                (Combinando datos de {totals.totalUsers} registros con el mismo username)
              </small>
            </div>
          )}
        </div>
      )}

      {loading ? (
        <div className={styles.loading}>Cargando reporte...</div>
      ) : (
        <>
          {weeklyData.length > 0 && (
            <div className={styles.section}>
              <h3>Resumen Semanal (Corte cada Lunes)</h3>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Semana</th>
                    <th>Días Trabajados</th>
                    <th>Total Horas</th>
                    <th>Pago Total</th>
                    <th>Detalles</th>
                  </tr>
                </thead>
                <tbody>
                  {weeklyData.map((week) => (
                    <React.Fragment key={week.weekStart}>
                      <tr>
                        <td>
                          <strong>
                            {formatDate(week.weekStart)} - {formatDate(week.weekEndDate)}
                          </strong>
                        </td>
                        <td>{week.daysWorked} días</td>
                        <td>{week.totalHours.toFixed(2)}h</td>
                        <td>${week.totalPay.toFixed(2)}</td>
                        <td>
                          <button
                            className={styles.detailBtn}
                            onClick={() => toggleWeekDetails(week.weekStart)}
                          >
                            {expandedWeeks[week.weekStart] ? "Ocultar" : "Ver días"}
                          </button>
                        </td>
                      </tr>

                      {expandedWeeks[week.weekStart] && week.dailyRecords && (
                        <tr>
                          <td colSpan="5" className={styles.detailsCell}>
                            <table className={styles.innerTable}>
                              <thead>
                                <tr>
                                  <th>Día</th>
                                  <th>Fecha</th>
                                  <th>Check-In</th>
                                  <th>Check-Out</th>
                                  <th>Horas</th>
                                  <th>Pago del día</th>
                                </tr>
                              </thead>
                              <tbody>
                                {week.dailyRecords.map((day, idx) => (
                                  <tr key={idx}>
                                    <td>{getDayName(day.date)}</td>
                                    <td>{formatDate(day.date)}</td>
                                    <td>{new Date(day.checkIn).toLocaleTimeString()}</td>
                                    <td>{new Date(day.checkOut).toLocaleTimeString()}</td>
                                    <td>{day.hours.toFixed(2)}h</td>
                                    <td>${((day.dailyPay || 0) + (day.commission || 0)).toFixed(2)}</td>
                                  </tr>
                                ))}
                                <tr className={styles.dayTotal}>
                                  <td colSpan="4"><strong>Total de la semana:</strong></td>
                                  <td><strong>{week.totalHours.toFixed(2)}h</strong></td>
                                  <td><strong>${week.totalPay.toFixed(2)}</strong></td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}

                  {totals && (
                    <tr className={styles.finalTotal}>
                      <td colSpan="2"><strong>TOTAL GENERAL:</strong></td>
                      <td><strong>{totals.totalHours.toFixed(2)}h</strong></td>
                      <td><strong>${totals.totalPay.toFixed(2)}</strong></td>
                      <td>{totals.totalWeeks} semanas</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {dailyRecords.length > 0 && (
            <div className={styles.section}>
              <h3>Registros Diarios Completos</h3>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Día</th>
                    <th>Check-In</th>
                    <th>Check-Out</th>
                    <th>Horas</th>
                    <th>Pago</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyRecords.map((record, index) => (
                    <tr key={index}>
                      <td>{formatDate(record.date)}</td>
                      <td>{getDayName(record.date)}</td>
                      <td>{new Date(record.checkIn).toLocaleTimeString()}</td>
                      <td>{new Date(record.checkOut).toLocaleTimeString()}</td>
                      <td>{record.hours.toFixed(2)}h</td>
                      <td>${((record.dailyPay || 0) + (record.commission || 0)).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {weeklyData.length === 0 && !loading && selectedUserId && (
            <div className={styles.noData}>
              No se encontraron registros para este usuario.
            </div>
          )}
        </>
      )}
    </div>
  );
}
