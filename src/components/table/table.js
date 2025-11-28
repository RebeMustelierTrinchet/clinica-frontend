import React from "react";
import styles from "./table.module.css";

export default function Table({ columns = [], data = [] }) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {columns.map((col, i) => (
            <th key={i}>{col}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            {Object.values(row).map((value, j) => (
              <td key={j}>{value}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
