"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const NetworkContext = createContext<boolean>(true);

export const NetworkProvider = ({ children }: { children: ReactNode }) => {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    setOnline(navigator.onLine);
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return <NetworkContext.Provider value={online}>{children}</NetworkContext.Provider>;
};

export const useNetwork = (): boolean => useContext(NetworkContext);
