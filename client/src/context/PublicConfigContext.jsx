import { createContext, useContext, useEffect, useMemo, useState } from "react";
import apiClient from "../api/client";

const PublicConfigContext = createContext(null);

export function PublicConfigProvider({ children }) {
  const [googleClientId, setGoogleClientId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadPublicConfig() {
      try {
        const response = await apiClient.get("/config/public");
        if (!cancelled) {
          setGoogleClientId(response.data.googleClientId || "");
        }
      } catch (error) {
        console.error("Failed to load public config:", error);
        if (!cancelled) {
          setGoogleClientId("");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPublicConfig();

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({
      googleClientId,
      loading
    }),
    [googleClientId, loading]
  );

  return <PublicConfigContext.Provider value={value}>{children}</PublicConfigContext.Provider>;
}

export function usePublicConfig() {
  const context = useContext(PublicConfigContext);
  if (!context) {
    throw new Error("usePublicConfig must be used inside PublicConfigProvider");
  }

  return context;
}
