import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { PublicConfigProvider, usePublicConfig } from "./context/PublicConfigContext";
import "./styles/app.css";

function AppProviders() {
  const { googleClientId, loading } = usePublicConfig();

  if (loading) {
    return <div className="page-center">Loading application...</div>;
  }

  const app = (
    <AuthProvider>
      <App />
    </AuthProvider>
  );

  return googleClientId ? <GoogleOAuthProvider clientId={googleClientId}>{app}</GoogleOAuthProvider> : app;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <PublicConfigProvider>
        <AppProviders />
      </PublicConfigProvider>
    </BrowserRouter>
  </React.StrictMode>
);
