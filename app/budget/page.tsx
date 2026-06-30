"use client";

import { useFinance } from "@/lib/store";
import {
  monthlySpending,
  monthlyBudget,
  freeCashFlow,
  sum,
} from "@/lib/financialModel";
import { proactiveAlerts } from "@/lib/insights";
import { money, pct } from "@/lib/format";
import { Card, SectionTitle, ProgressBar, PageHeader } from "@/components/ui";
import { SimulateButton } from "@/components/Simulate";
import AlertCard from "@/components/AlertCard";

export default function BudgetPage() {
  const { profile } = useFinance();
  const spent = monthlySpending(profile);
  const budget = monthlyBudget(profile);
  const opportunities = proactiveAlerts(profile).filter(
    (a) => a.severity === "opportunity",
  );
  const cats = [...profile.expenses].sort((a, b) => b.amount - a.amount);

  return (
    <div>
      <div className="flex items-center justify-between pr-5">
        <PageHeader title="Budget & Cash Flow" subtitle="Where it goes — and where to win" />
        <SimulateButton />
      </div>

      <div className="px-4 space-y-3">
        {/* Cash flow summary */}
        <Card glass>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-[11px] text-[var(--text-muted)]">In</p>
              <p className="text-[16px] font-bold" style={{ color: "var(--accent)" }}>
                {money(profile.monthlyIncome, { compact: true })}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-[var(--text-muted)]">Out</p>
              <p className="text-[16px] font-bold" style={{ color: "var(--danger)" }}>
                {money(spent, { compact: true })}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-[var(--text-muted)]">Left</p>
              <p className="text-[16px] font-bold">{money(freeCashFlow(profile), { compact: true })}</p>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-[11px] text-[var(--text-muted)] mb-1">
              <span>Spent {money(spent)}</span>
              <span>Budget {money(budget)}</span>
            </div>
            <ProgressBar value={(spent / budget) * 100} tone={spent > budget ? "danger" : "accent"} />
          </div>
        </Card>

        {/* Proactive savings opportunities */}
        {opportunities.length > 0 && (
          <>
            <SectionTitle title="Proactive insights" />
            <div className="space-y-3">
              {opportunities.map((o) => (
                <AlertCard key={o.id} insight={o} />
              ))}
            </div>
          </>
        )}

        {/* Categories */}
        <SectionTitle title="Spending by category" />
        <Card className="space-y-3.5">
          {cats.map((c) => {
            const over = c.amount > c.budget;
            const ratio = (c.amount / c.budget) * 100;
            return (
              <div key={c.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="flex items-center gap-2 text-[13px]">
                    <span>{c.icon}</span>
                    {c.name}
                  </span>
                  <span className="text-[12px] font-semibold" style={{ color: over ? "var(--danger)" : "var(--text)" }}>
                    {money(c.amount)}{" "}
                    <span className="text-[var(--text-dim)] font-normal">/ {money(c.budget)}</span>
                  </span>
                </div>
                <ProgressBar value={Math.min(ratio, 100)} tone={over ? "danger" : "accent"} />
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  );
}
