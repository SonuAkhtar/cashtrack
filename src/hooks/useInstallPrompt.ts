"use client";

import { useCallback, useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "cashtrack:install-dismissed";

export const useInstallPrompt = () => {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [standalone, setStandalone] = useState(false);

  useEffect(() => {
    const ua = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(ua));
    const matchStandalone = window.matchMedia("(display-mode: standalone)").matches;
    const iosStandalone = (window.navigator as unknown as { standalone?: boolean }).standalone;
    setStandalone(matchStandalone || Boolean(iosStandalone));

    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferred) return false;
    await deferred.prompt();
    const choice = await deferred.userChoice;
    setDeferred(null);
    return choice.outcome === "accepted";
  }, [deferred]);

  const dismiss = useCallback(() => {
    setDeferred(null);
    localStorage.setItem(DISMISS_KEY, "1");
  }, []);

  const dismissed = typeof window !== "undefined" && localStorage.getItem(DISMISS_KEY) === "1";

  return {
    canInstall: Boolean(deferred) && !standalone,
    isIOS: isIOS && !standalone,
    standalone,
    installed,
    dismissed,
    promptInstall,
    dismiss,
  };
};
