"use client";

import type { ReactNode } from "react";
import { QueryProvider } from "./QueryProvider";
import { ThemeProvider } from "./ThemeProvider";
import { NetworkProvider } from "./NetworkProvider";
import { ServiceWorkerProvider } from "./ServiceWorkerProvider";
import { ToastProvider } from "./ToastProvider";

export const AppProviders = ({ children }: { children: ReactNode }) => (
  <QueryProvider>
    <ThemeProvider>
      <NetworkProvider>
        <ServiceWorkerProvider>
          {children}
          <ToastProvider />
        </ServiceWorkerProvider>
      </NetworkProvider>
    </ThemeProvider>
  </QueryProvider>
);
