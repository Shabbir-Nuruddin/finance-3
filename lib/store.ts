"use client";

import { create } from "zustand";
import { Profile, Scenario, DEFAULT_SCENARIO } from "./types";
import { PROFILE, applyScenario } from "./financialModel";

export type OnboardingInput = {
  name: string;
  monthlyIncome: number;
  monthlySpending: number;
  goalIds: string[];
};

type State = {
  base: Profile;
  scenario: Scenario;
  /** derived profile with the active scenario applied */
  profile: Profile;
  scenarioActive: boolean;
  personalized: boolean;
  setScenario: (patch: Partial<Scenario>) => void;
  resetScenario: () => void;
  applyOnboarding: (input: OnboardingInput) => void;
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
  personalized: false,
  setScenario: (patch) => {
    const scenario = { ...get().scenario, ...patch };
    set({
      scenario,
      profile: applyScenario(get().base, scenario),
      scenarioActive: isActive(scenario),
    });
  },
  resetScenario: () =>
    set({
      scenario: DEFAULT_SCENARIO,
      profile: get().base,
      scenarioActive: false,
    }),
  applyOnboarding: (input) => {
    const src = PROFILE;
    const curSpend = src.expenses.reduce((a, e) => a + e.amount, 0) || 1;
    const factor = input.monthlySpending / curSpend;
    const expenses = src.expenses.map((e) => ({
      ...e,
      amount: Math.round(e.amount * factor),
      budget: Math.round(e.budget * factor),
    }));
    const goals = input.goalIds.length
      ? src.goals.filter((g) => input.goalIds.includes(g.id))
      : src.goals;

    const base: Profile = {
      ...src,
      name: input.name.trim() || src.name,
      monthlyIncome: Math.round(input.monthlyIncome),
      expenses,
      goals,
    };
    set({
      base,
      scenario: DEFAULT_SCENARIO,
      profile: base,
      scenarioActive: false,
      personalized: true,
    });
  },
}));
