import React, { useEffect, useState } from "react";

export default function HoursHistory() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/hours/history")
      .then((res) => res.json())
      .then((data) => setRecords(data))
      .catch((err) => console.error("Error:", err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Historial de Horas Trabajadas</h1>

      <table border="1" cellPadding="8" style={{ width: "100%", marginTop: "20px" }}>
        <thead>
          <tr>
            <th>Trabajador</th>
            <th>Email</th>
            <th>Salario x Hora</th>
            <th>Check-In</th>
            <th>Check-Out</th>
            <th>Horas Trabajadas</th>
            <th>Pago Total</th>
          </tr>
        </thead>

        <tbody>
          {records.map((r) => (
            <tr key={r.id}>
              <td>{r.name}</td>
              <td>{r.username}</td>
              <td>${r.salary}</td>
              <td>{r.checkIn}</td>
              <td>{r.checkOut || "Aún en turno"}</td>
              <td>{r.hours || 0}</td>
              <td>${r.totalPay || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
