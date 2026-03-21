import { createContext, useContext, useEffect, useMemo, useState } from "react";
import apiClient from "../api/client";

const PublicConfigContext = createContext(null);
<<<<<<< HEAD

export function PublicConfigProvider({ children }) {
  const [googleClientId, setGoogleClientId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
=======
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
>>>>>>> 3c0c81c (updates)

    async function loadPublicConfig() {
      try {
        const response = await apiClient.get("/config/public");
<<<<<<< HEAD
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
=======
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
>>>>>>> 3c0c81c (updates)
          setLoading(false);
        }
      }
    }

    loadPublicConfig();

    return () => {
<<<<<<< HEAD
      cancelled = true;
=======
      isActive = false;
>>>>>>> 3c0c81c (updates)
    };
  }, []);

  const value = useMemo(
    () => ({
      googleClientId,
<<<<<<< HEAD
=======
      googleEnabled: Boolean(googleClientId),
>>>>>>> 3c0c81c (updates)
      loading
    }),
    [googleClientId, loading]
  );

  return <PublicConfigContext.Provider value={value}>{children}</PublicConfigContext.Provider>;
}

export function usePublicConfig() {
  const context = useContext(PublicConfigContext);
<<<<<<< HEAD
=======

>>>>>>> 3c0c81c (updates)
  if (!context) {
    throw new Error("usePublicConfig must be used inside PublicConfigProvider");
  }

  return context;
}
