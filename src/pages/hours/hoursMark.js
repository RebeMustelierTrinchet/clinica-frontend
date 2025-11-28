import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import { hoursApi } from "../../api/hours";

export default function HoursMark() {
  const [status, setStatus] = useState(""); // "IN", "OUT" o ""
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    hoursApi.getTodayStatus().then((res) => setStatus(res.status));
  }, []);

  const handleMark = async (type) => {
    setLoading(true);
    await hoursApi.mark(type); // "in" or "out"
    const res = await hoursApi.getTodayStatus();
    setStatus(res.status);
    setLoading(false);
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Marcar Horas</h1>

      <div className={styles.card}>
        <p className={styles.status}>
          Estado actual:{" "}
          <span className={styles.stateTag}>
            {status === "IN" ? "Dentro" : status === "OUT" ? "Fuera" : "Sin marcar"}
          </span>
        </p>

        <div className={styles.buttons}>
          <button
            disabled={status === "IN" || loading}
            className={styles.btnIn}
            onClick={() => handleMark("in")}
          >
            Entrar
          </button>

          <button
            disabled={status === "OUT" || status === "" || loading}
            className={styles.btnOut}
            onClick={() => handleMark("out")}
          >
            Salir
          </button>
        </div>
      </div>
    </div>
  );
}
