"use client";

import { useEffect } from "react";

interface HotkeyOptions {
  meta?: boolean;
  shift?: boolean;
  preventDefault?: boolean;
}

export const useHotkey = (
  key: string,
  handler: () => void,
  { meta = false, shift = false, preventDefault = true }: HotkeyOptions = {}
) => {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const metaMatch = meta ? event.metaKey || event.ctrlKey : true;
      const shiftMatch = shift ? event.shiftKey : true;
      if (event.key.toLowerCase() === key.toLowerCase() && metaMatch && shiftMatch) {
        if (preventDefault) event.preventDefault();
        handler();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [key, handler, meta, shift, preventDefault]);
};
