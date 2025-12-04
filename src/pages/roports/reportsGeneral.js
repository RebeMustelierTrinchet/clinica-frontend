// import React, { useEffect, useState } from "react";
// import styles from "./styles.module.css";
// import { hoursApi } from "../../api/hours";

// export default function ReportsGeneral() {
//   const [reports, setReports] = useState([]);

//   useEffect(() => {
//     hoursApi.getGeneralReports().then((res) => setReports(res));
//   }, []);

//   return (
//     <div className={styles.page}>
//       <h1 className={styles.title}>Reporte General</h1>

//       <table className={styles.table}>
//         <thead>
//           <tr>
//             <th>Usuario</th>
//             <th>Semana</th>
//             <th>Total Horas</th>
//           </tr>
//         </thead>

//         <tbody>
//           {reports.map((r) => (
//             <tr key={r._id}>
//               <td>{r.userName}</td>
//               <td>{r.week}</td>
//               <td>{r.totalHours}h</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
