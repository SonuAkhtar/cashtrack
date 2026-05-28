"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface Options {
  onRefresh: () => Promise<void> | void;
  threshold?: number;
  enabled?: boolean;
}

export const usePullToRefresh = ({ onRefresh, threshold = 72, enabled = true }: Options) => {
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(0);
  const active = useRef(false);

  const handleStart = useCallback(
    (event: TouchEvent) => {
      if (!enabled || refreshing) return;
      if (window.scrollY > 4) return;
      startY.current = event.touches[0].clientY;
      active.current = true;
    },
    [enabled, refreshing]
  );

  const handleMove = useCallback(
    (event: TouchEvent) => {
      if (!active.current) return;
      const delta = event.touches[0].clientY - startY.current;
      if (delta > 0 && window.scrollY <= 0) {
        setPull(Math.min(delta * 0.5, threshold * 1.5));
      }
    },
    [threshold]
  );

  const handleEnd = useCallback(async () => {
    if (!active.current) return;
    active.current = false;
    if (pull >= threshold) {
      setRefreshing(true);
      setPull(threshold);
      try {
        await onRefresh();
      } finally {
        setRefreshing(false);
        setPull(0);
      }
    } else {
      setPull(0);
    }
  }, [pull, threshold, onRefresh]);

  useEffect(() => {
    if (!enabled) return;
    window.addEventListener("touchstart", handleStart, { passive: true });
    window.addEventListener("touchmove", handleMove, { passive: true });
    window.addEventListener("touchend", handleEnd);
    return () => {
      window.removeEventListener("touchstart", handleStart);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [enabled, handleStart, handleMove, handleEnd]);

  return { pull, refreshing, threshold, progress: Math.min(pull / threshold, 1) };
};
