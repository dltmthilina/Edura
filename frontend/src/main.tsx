import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.tsx";
import AppProvider from "./context/AppProvider.tsx";
import MessageTile from "./components/MessageTile.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProvider>
      <BrowserRouter>
        <App />
        <MessageTile />
      </BrowserRouter>
    </AppProvider>
  </StrictMode>
);
