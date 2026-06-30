"use client";

import { create } from "zustand";

type UIState = {
  whatIfOpen: boolean;
  openWhatIf: () => void;
  closeWhatIf: () => void;
  toggleWhatIf: () => void;
};

export const useUI = create<UIState>((set, get) => ({
  whatIfOpen: false,
  openWhatIf: () => set({ whatIfOpen: true }),
  closeWhatIf: () => set({ whatIfOpen: false }),
  toggleWhatIf: () => set({ whatIfOpen: !get().whatIfOpen }),
}));
