"use client";

import { useUI } from "@/lib/ui";
import { useFinance } from "@/lib/store";
import { lifeEventInfo } from "@/lib/financialModel";
import { SlidersIcon } from "./icons";

export function SimulateButton() {
  const open = useUI((s) => s.openWhatIf);
  return (
    <button
      onClick={open}
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold"
      style={{ background: "var(--ai-soft)", color: "var(--ai)" }}
    >
      <SlidersIcon width={15} height={15} /> What-If
    </button>
  );
}

export function ScenarioBanner() {
  const { scenario, scenarioActive, resetScenario } = useFinance();
  const open = useUI((s) => s.openWhatIf);
  if (!scenarioActive) return null;

  const bits: string[] = [];
  if (scenario.lifeEvent !== "none") bits.push(lifeEventInfo(scenario.lifeEvent).label);
  if (scenario.extraInvest) bits.push(`${scenario.extraInvest > 0 ? "+" : ""}$${scenario.extraInvest}/mo invest`);
  if (scenario.incomeChangePct) bits.push(`income ${scenario.incomeChangePct > 0 ? "+" : ""}${scenario.incomeChangePct}%`);
  if (scenario.spendingChangePct) bits.push(`spend ${scenario.spendingChangePct > 0 ? "+" : ""}${scenario.spendingChangePct}%`);
  if (scenario.payoffCreditCard) bits.push("CC paid off");

  return (
    <div className="mx-4 mb-1 mt-3 flex items-center justify-between rounded-2xl px-3 py-2.5"
      style={{ background: "var(--ai-soft)", border: "1px solid var(--ai)" }}
    >
      <button onClick={open} className="flex-1 text-left">
        <p className="text-[11px] font-bold uppercase tracking-wide" style={{ color: "var(--ai)" }}>
          ⚡ Simulating
        </p>
        <p className="text-[12px] text-[var(--text)] truncate">{bits.join(" · ")}</p>
      </button>
      <button
        onClick={resetScenario}
        className="ml-2 shrink-0 rounded-full bg-[var(--surface)] px-3 py-1.5 text-[11px] font-semibold text-[var(--text-muted)]"
      >
        Reset
      </button>
    </div>
  );
}
