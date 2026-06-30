"use client";

import { create } from "zustand";

type UIState = {
  // First-run flow
  welcomeOpen: boolean;
  onboardingOpen: boolean;
  tutorialOpen: boolean;
  // What-If simulator
  whatIfOpen: boolean;

  closeWelcome: () => void;
  startDemo: () => void; // explore with demo data + show the tour
  openOnboarding: () => void;
  closeOnboarding: () => void;
  openTutorial: () => void;
  closeTutorial: () => void;

  openWhatIf: () => void;
  closeWhatIf: () => void;
  toggleWhatIf: () => void;
};

export const useUI = create<UIState>((set, get) => ({
  welcomeOpen: true,
  onboardingOpen: false,
  tutorialOpen: false,
  whatIfOpen: false,

  closeWelcome: () => set({ welcomeOpen: false }),
  startDemo: () => set({ welcomeOpen: false, onboardingOpen: false, tutorialOpen: true }),
  openOnboarding: () => set({ onboardingOpen: true }),
  closeOnboarding: () => set({ onboardingOpen: false }),
  openTutorial: () => set({ tutorialOpen: true, welcomeOpen: false }),
  closeTutorial: () => set({ tutorialOpen: false }),

  openWhatIf: () => set({ whatIfOpen: true }),
  closeWhatIf: () => set({ whatIfOpen: false }),
  toggleWhatIf: () => set({ whatIfOpen: !get().whatIfOpen }),
}));
