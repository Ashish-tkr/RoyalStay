import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // backend API
  withCredentials: true,            // ✅ keep session cookies
});

export default api;
