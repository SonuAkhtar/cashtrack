"use client";

import { Toaster } from "react-hot-toast";

export const ToastProvider = () => (
  <Toaster
    position="top-center"
    gutter={10}
    toastOptions={{
      duration: 2800,
      style: {
        background: "var(--surface)",
        color: "var(--text)",
        border: "1px solid var(--border)",
        borderRadius: "14px",
        boxShadow: "var(--shadow-md)",
        fontSize: "14px",
        fontWeight: 500,
        padding: "12px 16px",
        maxWidth: "92vw",
      },
      success: { iconTheme: { primary: "var(--success)", secondary: "var(--surface)" } },
      error: { iconTheme: { primary: "var(--danger)", secondary: "var(--surface)" } },
    }}
  />
);
