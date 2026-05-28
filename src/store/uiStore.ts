import { create } from "zustand";
import type { FilterKey, SortKey } from "@/types";

type ModalKind =
  | { type: "person"; personId?: string }
  | { type: "transaction"; personId?: string; transactionId?: string; defaultType?: "lend" | "repayment" }
  | { type: "confirm"; title: string; message: string; confirmLabel?: string; onConfirm: () => void }
  | null;

interface UIState {
  commandOpen: boolean;
  modal: ModalKind;
  peopleQuery: string;
  peopleFilter: FilterKey;
  peopleSort: SortKey;
  openCommand: () => void;
  closeCommand: () => void;
  toggleCommand: () => void;
  openModal: (modal: NonNullable<ModalKind>) => void;
  closeModal: () => void;
  setPeopleQuery: (query: string) => void;
  setPeopleFilter: (filter: FilterKey) => void;
  setPeopleSort: (sort: SortKey) => void;
}

export const useUIStore = create<UIState>((set) => ({
  commandOpen: false,
  modal: null,
  peopleQuery: "",
  peopleFilter: "all",
  peopleSort: "recent",
  openCommand: () => set({ commandOpen: true }),
  closeCommand: () => set({ commandOpen: false }),
  toggleCommand: () => set((s) => ({ commandOpen: !s.commandOpen })),
  openModal: (modal) => set({ modal }),
  closeModal: () => set({ modal: null }),
  setPeopleQuery: (peopleQuery) => set({ peopleQuery }),
  setPeopleFilter: (peopleFilter) => set({ peopleFilter }),
  setPeopleSort: (peopleSort) => set({ peopleSort }),
}));
