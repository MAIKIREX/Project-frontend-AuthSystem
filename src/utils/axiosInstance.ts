import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000", // URL base del backend
  timeout: 5000, // Tiempo de espera para las solicitudes
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
