import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { hoursApi } from "../../api/hours";

export default function HoursHistory() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    hoursApi.getMyHistory().then((res) => setRecords(res));
  }, []);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Historial de Horas</h1>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Entrada</th>
            <th>Salida</th>
            <th>Total</th>
          </tr>
        </thead>

        <tbody>
          {records.map((r) => (
            <tr key={r._id}>
              <td>{r.date}</td>
              <td>{r.checkIn || "-"}</td>
              <td>{r.checkOut || "-"}</td>
              <td>{r.totalHours || "0h"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
