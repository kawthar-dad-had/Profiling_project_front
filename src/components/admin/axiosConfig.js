// axiosConfig.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api", // URL de votre backend
  headers: {
    "Content-Type": "application/json",
  },
});

// Ajouter un interceptor pour insérer le token JWT dans chaque requête
axiosInstance.interceptors.request.use(
  (config) => {
    // Vérifiez si un token est disponible dans localStorage ou sessionStorage
    const token = localStorage.getItem("token"); // Assurez-vous d'avoir un moyen de stocker le token
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // Ajouter le token à l'en-tête Authorization
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
