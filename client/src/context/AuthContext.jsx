import { createContext, useContext, useEffect, useMemo, useState } from "react";
import apiClient from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await apiClient.get("/auth/me");
        setUser(response.data.user);
      } catch (error) {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [token]);

  function storeAuth(authToken, authUser) {
    localStorage.setItem("token", authToken);
    setToken(authToken);
    setUser(authUser);
  }

  async function login(email, password) {
    const response = await apiClient.post("/auth/login", { email, password });
    storeAuth(response.data.token, response.data.user);
    return response.data;
  }

  async function register(payload) {
    const response = await apiClient.post("/auth/register", payload);
    return response.data;
  }

  async function verifyEmail(email, otp) {
    const response = await apiClient.post("/auth/verify-email", { email, otp });
    storeAuth(response.data.token, response.data.user);
    return response.data;
  }

  async function resendVerification(email) {
    const response = await apiClient.post("/auth/resend-verification", { email });
    return response.data;
  }

  async function forgotPassword(email) {
    const response = await apiClient.post("/auth/forgot-password", { email });
    return response.data;
  }

  async function resetPassword(email, otp, newPassword) {
    const response = await apiClient.post("/auth/reset-password", { email, otp, newPassword });
    return response.data;
  }

  async function googleLogin(credential) {
    const response = await apiClient.post("/auth/google", { credential });
    storeAuth(response.data.token, response.data.user);
    return response.data;
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(user && token),
      login,
      register,
      verifyEmail,
      resendVerification,
      forgotPassword,
      resetPassword,
      googleLogin,
      logout
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
