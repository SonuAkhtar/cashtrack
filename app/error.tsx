"use client";

import { useEffect } from "react";
import { Button } from "@/components/Button/Button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (typeof console !== "undefined") {
      console.error(error);
    }
  }, [error]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "var(--space-4)",
        minHeight: "60vh",
        padding: "var(--space-6)",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-2xl)",
          fontWeight: 700,
          color: "var(--text-primary)",
        }}
      >
        Something went wrong
      </h1>
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-sm)",
          color: "var(--text-secondary)",
          maxWidth: "32ch",
        }}
      >
        Try again, or refresh the page if the issue persists.
      </p>
      <Button variant="primary" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}
