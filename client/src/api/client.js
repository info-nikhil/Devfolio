import axios from "axios";

function getDefaultApiBaseUrl() {
  if (typeof window === "undefined") {
    return "/api";
  }

  const hostname = window.location.hostname;
  const isLocalHost = hostname === "localhost" || hostname === "127.0.0.1";

  return isLocalHost ? "http://localhost:5000/api" : "/api";
}

function normalizeApiBaseUrl(value) {
  const rawValue = (value || getDefaultApiBaseUrl()).trim().replace(/\/+$/, "");

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

export function getApiBaseUrl() {
  const viteEnv = typeof import.meta !== "undefined" ? import.meta.env : undefined;
  return normalizeApiBaseUrl(viteEnv?.VITE_API_URL);
}

const baseURL = getApiBaseUrl();
const publicAuthRoutes = new Set([
  "/config/public",
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
      error.message = "Request timed out. Check VITE_API_URL and your API deployment.";
    }

    return Promise.reject(error);
  }
);

export default apiClient;
