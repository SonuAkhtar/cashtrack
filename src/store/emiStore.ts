import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nowISO } from "@/utils/date";
import { createId } from "@/utils/id";

export type EmiType = "home" | "car" | "personal" | "education" | "credit" | "other";

export interface EmiEntry {
  id: string;
  name: string;
  amount: number;
  type: EmiType;
  date: string;
  createdAt: string;
}

export type EmiDraft = Omit<EmiEntry, "id" | "createdAt">;

interface EmiState {
  emis: EmiEntry[];
  addEmi: (draft: EmiDraft) => void;
  updateEmi: (id: string, patch: EmiDraft) => void;
  removeEmi: (id: string) => void;
}

export const useEmiStore = create<EmiState>()(
  persist(
    (set) => ({
      emis: [],
      addEmi: (draft) =>
        set((s) => ({
          emis: [...s.emis, { ...draft, id: createId("emi"), createdAt: nowISO() }],
        })),
      updateEmi: (id, patch) =>
        set((s) => ({
          emis: s.emis.map((e) => (e.id === id ? { ...e, ...patch } : e)),
        })),
      removeEmi: (id) => set((s) => ({ emis: s.emis.filter((e) => e.id !== id) })),
    }),
    { name: "cashtrack:emis" }
  )
);
