import React from "react";
import styles from "./footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <h3>QR Generator</h3>
        <p>Generate your QR codes quickly and for free ✨</p>
      </div>

      <div className={styles.bottom}>
        {/* <p>© {new Date().getFullYear()} QR Generator. All rights reserved.</p> */}
      </div>
    </footer>
  );
}
