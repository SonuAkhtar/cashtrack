"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AppPreferences } from "@/types";

interface PreferencesState extends AppPreferences {
  setTheme: (theme: AppPreferences["theme"]) => void;
  toggleNotification: (
    key: keyof AppPreferences["notifications"],
  ) => void;
  updateProfile: (patch: Partial<AppPreferences["profile"]>) => void;
}

export const PREFERENCES_STORAGE_KEY = "cashtrack:preferences";

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      theme: "light",
      currency: "INR",
      notifications: {
        dueReminders: true,
        weeklyDigest: true,
        paymentReceived: false,
      },
      profile: {
        name: "Alex Morgan",
        email: "alex@cashtrack.app",
      },
      setTheme: (theme) => set({ theme }),
      toggleNotification: (key) =>
        set((s) => ({
          notifications: { ...s.notifications, [key]: !s.notifications[key] },
        })),
      updateProfile: (patch) =>
        set((s) => ({ profile: { ...s.profile, ...patch } })),
    }),
    {
      name: PREFERENCES_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        notifications: state.notifications,
        profile: state.profile,
      }),
    },
  ),
);
