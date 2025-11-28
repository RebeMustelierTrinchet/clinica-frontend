import React from "react";
import styles from "./input.module.css";

export default function Input({ label, ...props }) {
  return (
    <div className={styles.container}>
      <label>{label}</label>
      <input className={styles.input} {...props} />
    </div>
  );
}
