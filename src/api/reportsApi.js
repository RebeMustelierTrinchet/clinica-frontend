import axios from "axios";

export const reportsApi = {
  getUserReport: (username) =>
    axios.get(`/reports/user/${username}`)
};
