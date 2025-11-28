import React from "react";
import styles from "./profile.module.css";

export default function Profile() {
  return (
    <div className={styles.profileContainer}>
      <h1 className={styles.title}>My Profile</h1>

      <div className={styles.card}>
        <div className={styles.avatar}>
          <img
            src="https://via.placeholder.com/120"
            alt="User Avatar"
          />
        </div>

        <div className={styles.info}>
          <div className={styles.field}>
            <label>Name:</label>
            <input type="text" value="Rebeca" readOnly />
          </div>

          <div className={styles.field}>
            <label>Email:</label>
            <input type="text" value="rebeca@email.com" readOnly />
          </div>

          <div className={styles.field}>
            <label>Role:</label>
            <input type="text" value="Administrator" readOnly />
          </div>

          <button className={styles.btn}>Edit Profile</button>
        </div>
      </div>
    </div>
  );
}
