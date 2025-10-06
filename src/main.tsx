// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import "./index.css"; // Tailwind v4 entra por aqui (@import "tailwindcss")

declare global {
  interface Window {
    __dc_root_mounted?: boolean;
  }
}

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Elemento #root não encontrado");

// 1) Limpa qualquer conteúdo antigo do root (resíduos de HMR etc.)
rootEl.replaceChildren();

// 2) Garante montagem única
if (!window.__dc_root_mounted) {
  window.__dc_root_mounted = true;

  ReactDOM.createRoot(rootEl).render(
    <HashRouter>
      <App />
    </HashRouter>
  );
} else {
  console.warn("DevCodeHub: tentativa de segunda montagem bloqueada.");
}
