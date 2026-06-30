"use client";

import { create } from "zustand";
import { Profile, Scenario, DEFAULT_SCENARIO } from "./types";
import { PROFILE, applyScenario } from "./financialModel";

type State = {
  base: Profile;
  scenario: Scenario;
  /** derived profile with the active scenario applied */
  profile: Profile;
  scenarioActive: boolean;
  setScenario: (patch: Partial<Scenario>) => void;
  resetScenario: () => void;
};

function isActive(s: Scenario): boolean {
  return (
    s.extraInvest !== 0 ||
    s.incomeChangePct !== 0 ||
    s.spendingChangePct !== 0 ||
    s.payoffCreditCard ||
    s.lifeEvent !== "none"
  );
}

export const useFinance = create<State>((set, get) => ({
  base: PROFILE,
  scenario: DEFAULT_SCENARIO,
  profile: PROFILE,
  scenarioActive: false,
  setScenario: (patch) => {
    const scenario = { ...get().scenario, ...patch };
    set({
      scenario,
      profile: applyScenario(PROFILE, scenario),
      scenarioActive: isActive(scenario),
    });
  },
  resetScenario: () =>
    set({
      scenario: DEFAULT_SCENARIO,
      profile: PROFILE,
      scenarioActive: false,
    }),
}));
