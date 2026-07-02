"use client";

import { Bar, BarChart, Cell, ResponsiveContainer, XAxis, Tooltip } from "recharts";
import { useFinance } from "@/lib/store";
import {
  monthlySpending,
  monthlyBudget,
  freeCashFlow,
} from "@/lib/financialModel";
import { proactiveAlerts } from "@/lib/insights";
import { money } from "@/lib/format";
import { Card, SectionTitle, ProgressBar, PageHeader } from "@/components/ui";
import { SimulateButton } from "@/components/Simulate";
import AlertCard from "@/components/AlertCard";

function budgetTone(amount: number, budget: number): "accent" | "warn" | "danger" {
  const ratio = amount / budget;
  if (ratio > 1) return "danger";
  if (ratio >= 0.9) return "warn";
  return "accent";
}

// 6-month spending history, derived from the (possibly personalized /
// simulated) current month — same pattern as the dashboard sparkline.
const TREND_FACTORS = [1.08, 0.96, 1.02, 0.91, 1.05, 1];

function trendData(current: number) {
  const now = new Date();
  return TREND_FACTORS.map((f, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (TREND_FACTORS.length - 1 - i), 1);
    return {
      month: d.toLocaleString("en-US", { month: "short" }),
      spend: Math.round(current * f),
      current: i === TREND_FACTORS.length - 1,
    };
  });
}

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
        <PageHeader title="Budget & Cash Flow" subtitle="Where it goes, and where to win" />
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
            <ProgressBar value={(spent / budget) * 100} tone={budgetTone(spent, budget)} />
            <p
              className="mt-1 text-[11px] font-medium"
              style={{ color: spent > budget ? "var(--danger)" : "var(--accent)" }}
            >
              {spent > budget
                ? `${money(spent - budget)} over budget`
                : `${money(budget - spent)} left this month`}
            </p>
          </div>
        </Card>

        {/* Spending trend */}
        <SectionTitle title="Spending trend" />
        <Card>
          <div className="h-[110px] -mx-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData(spent)} margin={{ top: 8, right: 4, left: 4, bottom: 0 }}>
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "var(--text-dim)" }}
                />
                <Tooltip
                  cursor={{ fill: "rgba(74,60,44,0.05)" }}
                  contentStyle={{
                    background: "var(--surface)",
                    border: "1px solid var(--border-strong)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  formatter={(v) => [money(Number(v)), "Spent"]}
                />
                <Bar dataKey="spend" radius={[6, 6, 0, 0]}>
                  {trendData(spent).map((d, i) => (
                    <Cell
                      key={i}
                      fill={d.current ? "var(--accent-deep)" : "var(--accent)"}
                      opacity={d.current ? 1 : 0.45}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-1 text-center text-[11px] text-[var(--text-muted)]">
            {money(spent)} this month · 6-month view
          </p>
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
            const tone = budgetTone(c.amount, c.budget);
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
                <ProgressBar value={Math.min(ratio, 100)} tone={tone} />
                <p className="mt-1 text-[10.5px]" style={{ color: over ? "var(--danger)" : "var(--text-dim)" }}>
                  {over ? `${money(c.amount - c.budget)} over` : `${money(c.budget - c.amount)} left`}
                </p>
              </div>
            );
          })}
        </Card>

        {/* Upcoming bills */}
        <SectionTitle
          title="Upcoming bills"
          action={
            <span className="text-[11px] text-[var(--text-muted)]">
              {money(profile.bills.reduce((a, b) => a + b.amount, 0))} due soon
            </span>
          }
        />
        <Card className="divide-y divide-[var(--border)] p-0">
          {profile.bills.map((b) => (
            <div key={b.name} className="flex items-center gap-3 px-4 py-3">
              <span className="text-[18px]">{b.icon}</span>
              <div className="flex-1">
                <p className="text-[14px] font-medium">{b.name}</p>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Due in {b.dueInDays} days{" "}
                  {b.autopay ? (
                    <span style={{ color: "var(--pos)" }}>· autopay on</span>
                  ) : (
                    <span style={{ color: "var(--warn)" }}>· manual</span>
                  )}
                </p>
              </div>
              <p className="text-[14px] font-semibold">{money(b.amount)}</p>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
