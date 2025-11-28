import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { hoursApi } from "../../api/hours";
import { usersApi } from "../../api/users";

export default function ReportsByUser() {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState("");
  const [records, setRecords] = useState([]);

  useEffect(() => {
    usersApi.getAll().then((res) => setUsers(res));
  }, []);

  const handleSearch = async () => {
    if (!selected) return;
    const res = await hoursApi.getReportsByUser(selected);
    setRecords(res);
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Reporte por Usuario</h1>

      <div className={styles.filterCard}>
        <label>Seleccionar usuario:</label>
        <select
          className={styles.select}
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          <option value="">-- Elegir --</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name}
            </option>
          ))}
        </select>

        <button className={styles.searchBtn} onClick={handleSearch}>
          Buscar
        </button>
      </div>

      {records.length > 0 && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Semana</th>
              <th>Total Horas</th>
            </tr>
          </thead>

          <tbody>
            {records.map((rec, i) => (
              <tr key={i}>
                <td>{rec.week}</td>
                <td>{rec.totalHours}h</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
