import axios from "axios";

const baseURL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/+$/, "");
const publicAuthRoutes = new Set([
  "/auth/register",
  "/auth/login",
  "/auth/verify-email",
  "/auth/resend-verification",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/google"
]);

const apiClient = axios.create({
  baseURL
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const requestPath = config.url || "";

  if (token && !publicAuthRoutes.has(requestPath)) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (config.headers?.Authorization) {
    delete config.headers.Authorization;
  }

  return config;
});

export default apiClient;
