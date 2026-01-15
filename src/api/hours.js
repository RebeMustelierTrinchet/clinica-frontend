import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

// export const hoursApi = {
//   getTodayStatus: (userId) =>
//     axios.get(`${API_URL}/hours/status/${userId}`),

//   clockIn: (userId) =>
//     axios.post(`${API_URL}/hours/clock-in`, {
//       userId,
//       checkIn: new Date().toLocaleTimeString(),
//     }),

//   clockOut: (userId) =>
//     axios.post(`${API_URL}/hours/clock-out`, {
//       userId,
//       checkOut: new Date().toLocaleTimeString(),
//     }),

//   getMyHistory: (userId) =>
//     axios.get(`${API_URL}/hours/user/${userId}`),

//   getReportsByUser: () =>
//     axios.get(`${API_URL}/hours/history`),
  
//   getUserWeeklyReport: (userId) =>
//     axios.get(`${API_URL}/hours/user-weekly/${userId}`),


//   mark: async (userId) => {
//     const status = await axios.get(`${API_URL}/hours/status/${userId}`);
//     if (!status.data.entryTime) {
//       return hoursApi.clockIn(userId);
//     } else {
//       return hoursApi.clockOut(userId);
//     }
//   },

  
// };
// export const hoursApi = {
//   getTodayStatus: (userId) =>
//     axios.get(`${API_URL}/hours/status/${userId}`),

//   clockIn: (userId) =>
//     axios.post(`${API_URL}/hours/clock-in`, {
//       userId,
//       checkIn: new Date().toISOString(), // CAMBIA AQUÍ: Usar ISO string
//     }),

//   clockOut: (userId) =>
//     axios.post(`${API_URL}/hours/clock-out`, {
//       userId,
//       checkOut: new Date().toISOString(), // CAMBIA AQUÍ: Usar ISO string
//     }),

//   getMyHistory: (userId) =>
//     axios.get(`${API_URL}/hours/user/${userId}`),

//   getReportsByUser: () =>
//     axios.get(`${API_URL}/hours/history`),

//   getUserWeeklyReport: (userId) =>  // AÑADE ESTE MÉTODO
//     axios.get(`${API_URL}/hours/user/${userId}/weekly`),

//   mark: async (userId) => {
//     const status = await axios.get(`${API_URL}/hours/status/${userId}`);
//     if (!status.data.entryTime) {
//       return hoursApi.clockIn(userId);
//     } else {
//       return hoursApi.clockOut(userId);
//     }
//   },
// };

// En tu archivo api/hours.js

export const hoursApi = {
  // Este SÍ existe
  getHistory: () => axios.get(`${API_URL}/hours/history`),
  
  // Este NO existe - vamos a crearlo basado en getHistory
  getUserHistory: (userId) => 
    axios.get(`${API_URL}/hours/history`).then(res => {
      // Filtrar por userId en el frontend
      const userRecords = res.data.filter(record => record.userId === parseInt(userId));
      return { data: userRecords };
    }),
  
  // Este tampoco existe - vamos a simularlo
  getUserWeeklyReport: (userId) =>
    axios.get(`${API_URL}/hours/history`).then(res => {
      // Filtrar por userId y procesar por semana
      const userRecords = res.data.filter(record => 
        record.userId === parseInt(userId) && record.checkOut !== null
      );
      
      // Procesar para agrupar por semana
      const weeklyData = processWeeklyData(userRecords);
      
      return {
        data: {
          userId: parseInt(userId),
          weeklySummary: weeklyData.weeklySummary,
          dailyRecords: weeklyData.dailyRecords,
          totals: weeklyData.totals
        }
      };
    })
};

// Función auxiliar para procesar datos semanales
const processWeeklyData = (records) => {
  if (!records.length) {
    return { weeklySummary: [], dailyRecords: [], totals: null };
  }
  
  const dailyRecords = records.map(record => {
    const checkInDate = new Date(record.checkIn);
    const checkOutDate = record.checkOut ? new Date(record.checkOut) : null;
    
    // Calcular horas si hay checkOut
    let hours = 0;
    if (checkOutDate) {
      hours = (checkOutDate - checkInDate) / (1000 * 60 * 60); // milisegundos a horas
      hours = Math.round(hours * 100) / 100; // Redondear a 2 decimales
    }
    
    // Calcular pago diario (asumiendo que record tiene salary o usamos un valor fijo)
    const salary = record.salary || 10; // Valor por defecto si no hay salary
    const dailyPay = Math.round(hours * salary * 100) / 100;
    
    return {
      id: record.id,
      userId: record.userId,
      date: checkInDate.toISOString().split('T')[0],
      checkIn: record.checkIn,
      checkOut: record.checkOut,
      hours: hours,
      dailyPay: dailyPay,
      name: record.name,
      username: record.username
    };
  }).filter(record => record.checkOut !== null); // Solo registros completados
  
  // Agrupar por semana
  const weeklyMap = {};
  
  dailyRecords.forEach(record => {
    const date = new Date(record.date);
    
    // Encontrar el lunes de esa semana
    const dayOfWeek = date.getDay(); // 0 = Domingo, 1 = Lunes, etc.
    const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const monday = new Date(date);
    monday.setDate(date.getDate() - diffToMonday);
    const weekStart = monday.toISOString().split('T')[0];
    
    // Calcular domingo
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    const weekEnd = sunday.toISOString().split('T')[0];
    
    if (!weeklyMap[weekStart]) {
      weeklyMap[weekStart] = {
        weekStart,
        weekEndDate: weekEnd,
        totalHours: 0,
        totalPay: 0,
        daysWorked: new Set(),
        dailyRecords: []
      };
    }
    
    weeklyMap[weekStart].totalHours += record.hours;
    weeklyMap[weekStart].totalPay += record.dailyPay;
    weeklyMap[weekStart].daysWorked.add(record.date);
    weeklyMap[weekStart].dailyRecords.push(record);
  });
  
  // Convertir a array
  const weeklySummary = Object.values(weeklyMap).map(week => ({
    ...week,
    daysWorked: week.daysWorked.size,
    dailyRecords: week.dailyRecords.sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    )
  })).sort((a, b) => new Date(b.weekStart) - new Date(a.weekStart));
  
  // Calcular totales
  const totals = {
    totalHours: dailyRecords.reduce((sum, r) => sum + r.hours, 0),
    totalPay: dailyRecords.reduce((sum, r) => sum + r.dailyPay, 0),
    totalWeeks: weeklySummary.length
  };
  
  return { weeklySummary, dailyRecords, totals };
};