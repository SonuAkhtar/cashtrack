import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ThemeMode } from "@/types";

interface SettingsState {
  theme: ThemeMode;
  onboarded: boolean;
  pinEnabled: boolean;
  biometricEnabled: boolean;
  remindersEnabled: boolean;
  profileName: string;
  profileEmail: string;
  profilePhoto: string;
  profileFocus: string[];
  hydrated: boolean;
  setTheme: (theme: ThemeMode) => void;
  completeOnboarding: () => void;
  togglePin: (value: boolean) => void;
  toggleBiometric: (value: boolean) => void;
  toggleReminders: (value: boolean) => void;
  setProfile: (profile: { name: string; email: string }) => void;
  setProfilePhoto: (photo: string) => void;
  setProfileFocus: (focus: string[]) => void;
  setHydrated: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: "system",
      onboarded: false,
      pinEnabled: false,
      biometricEnabled: false,
      remindersEnabled: true,
      profileName: "CashTrack User",
      profileEmail: "",
      profilePhoto: "",
      profileFocus: [],
      hydrated: false,
      setTheme: (theme) => set({ theme }),
      completeOnboarding: () => set({ onboarded: true }),
      togglePin: (pinEnabled) => set({ pinEnabled }),
      toggleBiometric: (biometricEnabled) => set({ biometricEnabled }),
      toggleReminders: (remindersEnabled) => set({ remindersEnabled }),
      setProfile: ({ name, email }) => set({ profileName: name, profileEmail: email }),
      setProfilePhoto: (profilePhoto) => set({ profilePhoto }),
      setProfileFocus: (profileFocus) => set({ profileFocus }),
      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: "cashtrack:settings",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
      partialize: ({ theme, onboarded, pinEnabled, biometricEnabled, remindersEnabled, profileName, profileEmail, profilePhoto, profileFocus }) => ({
        theme,
        onboarded,
        pinEnabled,
        biometricEnabled,
        remindersEnabled,
        profileName,
        profileEmail,
        profilePhoto,
        profileFocus,
      }),
    }
  )
);
