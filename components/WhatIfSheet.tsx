"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useUI } from "@/lib/ui";
import { useFinance } from "@/lib/store";
import { LifeEvent } from "@/lib/types";
import {
  PROFILE,
  projectNetWorth,
  healthScore,
  savingsRate,
  emergencyMonths,
  netWorth,
  lifeEventInfo,
} from "@/lib/financialModel";
import { money, pct } from "@/lib/format";
import { CloseIcon, SlidersIcon } from "./icons";

const HORIZON = 10;

const EVENTS: LifeEvent[] = ["none", "baby", "newCar", "jobLoss", "raise"];

function Delta({ base, now, fmt, goodUp = true }: { base: number; now: number; fmt: (n: number) => string; goodUp?: boolean }) {
  const diff = now - base;
  const flat = Math.abs(diff) < 0.0001;
  const good = goodUp ? diff > 0 : diff < 0;
  const color = flat ? "var(--text-muted)" : good ? "var(--accent)" : "var(--danger)";
  return (
    <span className="text-[11px] font-semibold" style={{ color }}>
      {flat ? "no change" : `${diff > 0 ? "▲" : "▼"} ${fmt(Math.abs(diff))}`}
    </span>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (n: number) => void;
}) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[13px] text-[var(--text-muted)]">{label}</span>
        <span className="text-[13px] font-semibold">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

export default function WhatIfSheet() {
  const { whatIfOpen, closeWhatIf } = useUI();
  const { scenario, profile, setScenario, resetScenario, scenarioActive } = useFinance();

  // baseline vs scenario metrics
  const baseNW = projectNetWorth(PROFILE, HORIZON).at(-1)!.netWorth;
  const scNW = projectNetWorth(profile, HORIZON).at(-1)!.netWorth;

  const metrics = [
    {
      label: `Net worth in ${HORIZON}y`,
      base: baseNW,
      now: scNW,
      fmt: (n: number) => money(n, { compact: true }),
      goodUp: true,
    },
    {
      label: "Health score",
      base: healthScore(PROFILE),
      now: healthScore(profile),
      fmt: (n: number) => `${Math.round(n)}`,
      goodUp: true,
    },
    {
      label: "Savings rate",
      base: savingsRate(PROFILE),
      now: savingsRate(profile),
      fmt: (n: number) => pct(n),
      goodUp: true,
    },
    {
      label: "Emergency cover",
      base: emergencyMonths(PROFILE),
      now: emergencyMonths(profile),
      fmt: (n: number) => `${n.toFixed(1)} mo`,
      goodUp: true,
    },
  ];

  return (
    <AnimatePresence>
      {whatIfOpen && (
        <>
          <motion.div
            className="absolute inset-0 z-40 bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeWhatIf}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 z-50 rounded-t-[28px] border-t border-[var(--border-strong)] bg-[var(--bg-2)] max-h-[88%] flex flex-col"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
          >
            <div className="flex items-center justify-between px-5 pt-4 pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full"
                  style={{ background: "var(--ai-soft)", color: "var(--ai)" }}
                >
                  <SlidersIcon width={18} height={18} />
                </span>
                <div>
                  <h3 className="text-[16px] font-bold leading-none">What-If Simulator</h3>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                    Stress-test your life — everything recalculates live
                  </p>
                </div>
              </div>
              <button onClick={closeWhatIf} className="text-[var(--text-muted)] p-1">
                <CloseIcon width={22} height={22} />
              </button>
            </div>

            {/* live impact strip */}
            <div className="px-4 shrink-0">
              <div className="grid grid-cols-2 gap-2">
                {metrics.map((m) => (
                  <div key={m.label} className="card p-3">
                    <p className="text-[11px] text-[var(--text-muted)]">{m.label}</p>
                    <p className="text-[18px] font-bold leading-tight mt-0.5">{m.fmt(m.now)}</p>
                    <Delta base={m.base} now={m.now} fmt={m.fmt} goodUp={m.goodUp} />
                  </div>
                ))}
              </div>
            </div>

            <div className="phone-scroll px-5 pt-4 pb-6 mt-2">
              {/* life events */}
              <p className="text-[13px] text-[var(--text-muted)] mb-2">Life event</p>
              <div className="flex flex-wrap gap-2 mb-5">
                {EVENTS.map((e) => {
                  const info = lifeEventInfo(e);
                  const active = scenario.lifeEvent === e;
                  return (
                    <button
                      key={e}
                      onClick={() => setScenario({ lifeEvent: e })}
                      className="rounded-full px-3 py-2 text-[12px] font-semibold transition border"
                      style={{
                        background: active ? "var(--ai-soft)" : "var(--surface)",
                        borderColor: active ? "var(--ai)" : "var(--border)",
                        color: active ? "var(--ai)" : "var(--text-muted)",
                      }}
                    >
                      {info.icon} {info.label}
                    </button>
                  );
                })}
              </div>
              {scenario.lifeEvent !== "none" && (
                <p className="-mt-3 mb-4 text-[12px] text-[var(--text-muted)] italic">
                  {lifeEventInfo(scenario.lifeEvent).note}
                </p>
              )}

              <Slider
                label="Extra monthly investing"
                value={scenario.extraInvest}
                min={-500}
                max={2000}
                step={50}
                display={money(scenario.extraInvest, { sign: true })}
                onChange={(n) => setScenario({ extraInvest: n })}
              />
              <Slider
                label="Income change"
                value={scenario.incomeChangePct}
                min={-50}
                max={50}
                step={1}
                display={`${scenario.incomeChangePct > 0 ? "+" : ""}${scenario.incomeChangePct}%`}
                onChange={(n) => setScenario({ incomeChangePct: n })}
              />
              <Slider
                label="Spending change"
                value={scenario.spendingChangePct}
                min={-30}
                max={50}
                step={1}
                display={`${scenario.spendingChangePct > 0 ? "+" : ""}${scenario.spendingChangePct}%`}
                onChange={(n) => setScenario({ spendingChangePct: n })}
              />

              <button
                onClick={() => setScenario({ payoffCreditCard: !scenario.payoffCreditCard })}
                className="flex w-full items-center justify-between rounded-2xl border p-4 mb-5"
                style={{
                  borderColor: scenario.payoffCreditCard ? "var(--accent)" : "var(--border)",
                  background: scenario.payoffCreditCard ? "var(--accent-soft)" : "var(--surface)",
                }}
              >
                <div className="text-left">
                  <p className="text-[14px] font-semibold">Pay off credit card now 💳</p>
                  <p className="text-[11px] text-[var(--text-muted)]">Clear the 22% APR balance from savings</p>
                </div>
                <div
                  className="relative h-6 w-11 rounded-full transition"
                  style={{ background: scenario.payoffCreditCard ? "var(--accent)" : "var(--surface-2)" }}
                >
                  <div
                    className="absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all"
                    style={{ left: scenario.payoffCreditCard ? "22px" : "2px" }}
                  />
                </div>
              </button>

              {scenarioActive && (
                <button
                  onClick={resetScenario}
                  className="w-full rounded-2xl border border-[var(--border)] py-3 text-[14px] font-semibold text-[var(--text-muted)]"
                >
                  Reset to my real numbers
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
