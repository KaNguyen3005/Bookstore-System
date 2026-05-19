import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./features/auth/context/AuthContext";
import "./styles/index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <GoogleOAuthProvider
      clientId="565707011763-vfn6902cveuuot57ll5vmuic7b4ho9vr.apps.googleusercontent.com"
    >
      <AuthProvider>
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);