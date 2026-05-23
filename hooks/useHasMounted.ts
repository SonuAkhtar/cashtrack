"use client";

import { useEffect, useState } from "react";

export const useHasMounted = (): boolean => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
};
