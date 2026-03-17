import axios from "axios";

function normalizeApiBaseUrl(value) {
  const rawValue = (value || "http://localhost:5000/api").trim().replace(/\/+$/, "");

  if (/^https?:\/\//i.test(rawValue) || rawValue.startsWith("/")) {
    return rawValue;
  }

  if (/^(localhost|127\.0\.0\.1)(:\d+)?(\/.*)?$/i.test(rawValue)) {
    return `http://${rawValue}`;
  }

  if (/^[a-z0-9.-]+\.[a-z]{2,}(\/.*)?$/i.test(rawValue)) {
    return `https://${rawValue}`;
  }

  return rawValue;
}

const baseURL = normalizeApiBaseUrl(import.meta.env.VITE_API_URL);
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
  baseURL,
  timeout: 15000
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

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED") {
      error.message = "Request timed out. Check VITE_API_URL and backend availability.";
    }

    return Promise.reject(error);
  }
);

export default apiClient;
