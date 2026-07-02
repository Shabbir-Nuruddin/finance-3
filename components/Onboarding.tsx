"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useUI } from "@/lib/ui";
import { useFinance } from "@/lib/store";
import { money } from "@/lib/format";
import { CloseIcon } from "./icons";

const GOAL_OPTIONS = [
  { id: "emergency", icon: "🛟", label: "Emergency fund" },
  { id: "home", icon: "🏡", label: "Buy a home" },
  { id: "retirement", icon: "🌴", label: "Retirement" },
  { id: "travel", icon: "✈️", label: "Travel" },
  { id: "education", icon: "🎓", label: "Education" },
];

const STEPS = 4;

export default function Onboarding() {
  const { onboardingOpen, closeOnboarding, closeWelcome, openTutorial } = useUI();
  const applyOnboarding = useFinance((s) => s.applyOnboarding);

  const [step, setStep] = useState(0);
  const [name, setName] = useState("Alex");
  const [income, setIncomeRaw] = useState(7200);
  const [spending, setSpending] = useState(5400);
  const [goals, setGoals] = useState<string[]>(["emergency", "home", "retirement"]);

  // Keep spending <= income even if the user goes back and lowers income.
  const setIncome = (v: number) => {
    setIncomeRaw(v);
    setSpending((s) => Math.min(s, v));
  };

  if (!onboardingOpen) return null;

  const finish = () => {
    applyOnboarding({ name, monthlyIncome: income, monthlySpending: spending, goalIds: goals });
    closeOnboarding();
    closeWelcome();
    openTutorial();
  };

  const next = () => (step < STEPS - 1 ? setStep(step + 1) : finish());
  const back = () => (step > 0 ? setStep(step - 1) : closeOnboarding());

  const toggleGoal = (id: string) =>
    setGoals((g) => (g.includes(id) ? g.filter((x) => x !== id) : [...g, id]));

  const savingsRate = income > 0 ? Math.max(0, Math.round(((income - spending) / income) * 100)) : 0;

  return (
    <motion.div
      className="absolute inset-0 z-[70] flex flex-col bg-[var(--phone-bg)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* top bar: progress + close */}
      <div className="flex items-center gap-3 px-5 pt-12 pb-4">
        <button onClick={closeOnboarding} className="text-[var(--text-muted)]">
          <CloseIcon width={22} height={22} />
        </button>
        <div className="flex-1 flex gap-1.5">
          {Array.from({ length: STEPS }).map((_, i) => (
            <div
              key={i}
              className="h-1.5 flex-1 rounded-full transition-colors"
              style={{ background: i <= step ? "var(--accent)" : "var(--surface-2)" }}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6" style={{ scrollbarWidth: "none" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ x: 24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -24, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {step === 0 && (
              <div>
                <p className="text-[13px] font-semibold text-[var(--accent)]">Step 1 of 4</p>
                <h2 className="mt-1 text-[24px] font-bold leading-tight">What should I call you?</h2>
                <p className="mt-1.5 text-[13px] text-[var(--text-muted)]">
                  Just a first name is perfect.
                </p>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                  placeholder="Your name"
                  className="mt-6 w-full rounded-2xl border border-[var(--border-strong)] bg-[var(--surface)] px-4 py-4 text-[18px] outline-none focus:border-[var(--accent)]"
                />
              </div>
            )}

            {step === 1 && (
              <div>
                <p className="text-[13px] font-semibold text-[var(--accent)]">Step 2 of 4</p>
                <h2 className="mt-1 text-[24px] font-bold leading-tight">
                  What&apos;s your monthly take-home pay?
                </h2>
                <p className="mt-6 text-center text-[36px] font-bold">{money(income)}</p>
                <input
                  type="range"
                  min={1500}
                  max={20000}
                  step={100}
                  value={income}
                  onChange={(e) => setIncome(Number(e.target.value))}
                  className="mt-3"
                />
                <div className="mt-5 flex flex-wrap gap-2 justify-center">
                  {[4000, 6000, 8000, 12000].map((v) => (
                    <button
                      key={v}
                      onClick={() => setIncome(v)}
                      className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-[13px] font-medium"
                    >
                      {money(v)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <p className="text-[13px] font-semibold text-[var(--accent)]">Step 3 of 4</p>
                <h2 className="mt-1 text-[24px] font-bold leading-tight">
                  Roughly how much do you spend a month?
                </h2>
                <p className="mt-6 text-center text-[36px] font-bold">{money(spending)}</p>
                <input
                  type="range"
                  min={800}
                  max={Math.max(income, 2000)}
                  step={100}
                  value={spending}
                  onChange={(e) => setSpending(Number(e.target.value))}
                  className="mt-3"
                />
                <p
                  className="mt-5 text-center text-[14px] font-semibold"
                  style={{ color: savingsRate >= 15 ? "var(--pos)" : "var(--warn)" }}
                >
                  That&apos;s a {savingsRate}% savings rate {savingsRate >= 15 ? "💪" : "(room to grow)"}
                </p>
              </div>
            )}

            {step === 3 && (
              <div>
                <p className="text-[13px] font-semibold text-[var(--accent)]">Step 4 of 4</p>
                <h2 className="mt-1 text-[24px] font-bold leading-tight">
                  What are you working toward?
                </h2>
                <p className="mt-1.5 text-[13px] text-[var(--text-muted)]">Pick any that apply.</p>
                <div className="mt-5 grid grid-cols-2 gap-2.5">
                  {GOAL_OPTIONS.map((g) => {
                    const on = goals.includes(g.id);
                    return (
                      <button
                        key={g.id}
                        onClick={() => toggleGoal(g.id)}
                        className="flex items-center gap-2 rounded-2xl border p-3.5 text-left transition"
                        style={{
                          borderColor: on ? "var(--accent)" : "var(--border)",
                          background: on ? "var(--accent-soft)" : "var(--surface)",
                        }}
                      >
                        <span className="text-[20px]">{g.icon}</span>
                        <span className="text-[13px] font-semibold">{g.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-3 px-6 pb-[max(22px,env(safe-area-inset-bottom))] pt-3">
        <button
          onClick={back}
          className="rounded-2xl border border-[var(--border-strong)] bg-[var(--surface)] px-5 py-3.5 text-[15px] font-semibold"
        >
          {step === 0 ? "Cancel" : "Back"}
        </button>
        <button
          onClick={next}
          className="flex-1 rounded-2xl brand-grad py-3.5 text-[15px] font-semibold text-white shadow active:scale-[0.99] transition"
        >
          {step === STEPS - 1 ? "Build my plan ✨" : "Continue"}
        </button>
      </div>
    </motion.div>
  );
}
