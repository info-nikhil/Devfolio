import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { PublicConfigProvider, usePublicConfig } from "./context/PublicConfigContext";
import "./styles/app.css";

function AppShell() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  );
}

function RootProviders() {
  const { googleClientId } = usePublicConfig();
  const app = <AppShell />;

  return googleClientId ? <GoogleOAuthProvider clientId={googleClientId}>{app}</GoogleOAuthProvider> : app;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PublicConfigProvider>
      <RootProviders />
    </PublicConfigProvider>
  </React.StrictMode>
);
