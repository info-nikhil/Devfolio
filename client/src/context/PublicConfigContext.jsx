import { createContext, useContext, useEffect, useMemo, useState } from "react";
import apiClient from "../api/client";

const PublicConfigContext = createContext(null);
const envGoogleClientId = (import.meta.env.VITE_GOOGLE_CLIENT_ID || "").trim();

export function PublicConfigProvider({ children }) {
  const [googleClientId, setGoogleClientId] = useState(envGoogleClientId);
  const [loading, setLoading] = useState(!envGoogleClientId);

  useEffect(() => {
    if (envGoogleClientId) {
      setLoading(false);
      return undefined;
    }

    let isActive = true;

    async function loadPublicConfig() {
      try {
        const response = await apiClient.get("/config/public");
        const nextGoogleClientId = (response.data?.googleClientId || "").trim();

        if (isActive) {
          setGoogleClientId(nextGoogleClientId);
        }
      } catch (error) {
        if (isActive) {
          setGoogleClientId("");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    loadPublicConfig();

    return () => {
      isActive = false;
    };
  }, []);

  const value = useMemo(
    () => ({
      googleClientId,
      googleEnabled: Boolean(googleClientId),
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
