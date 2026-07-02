"use client";

import { useFinance } from "@/lib/store";
import { goalProgress, monthsToGoal } from "@/lib/financialModel";
import { money, monthsToText } from "@/lib/format";
import { Card, SectionTitle, ProgressBar, PageHeader, Pill } from "@/components/ui";
import { SimulateButton } from "@/components/Simulate";
import TimeMachine from "@/components/TimeMachine";

export default function GoalsPage() {
  const { profile } = useFinance();

  return (
    <div>
      <div className="flex items-center justify-between pr-5">
        <PageHeader title="Goals & Wealth" subtitle="Plan, project, and pull your future forward" />
        <SimulateButton />
      </div>

      <div className="px-4 space-y-3">
        {/* Time Machine #2 */}
        <TimeMachine />

        <SectionTitle title="Your goals" />
        <div className="space-y-3">
          {profile.goals.map((g) => {
            const prog = goalProgress(g);
            const eta = monthsToGoal(g);
            const tone = g.priority === "high" ? "ai" : g.priority === "medium" ? "info" : "muted";
            return (
              <Card key={g.id}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[22px]">{g.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-[15px] font-semibold">{g.name}</p>
                      <Pill tone={tone as "ai" | "info" | "muted"}>{g.priority}</Pill>
                    </div>
                    <p className="text-[12px] text-[var(--text-muted)]">
                      {money(g.current)} of {money(g.target)} · {money(g.monthly)}/mo
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[16px] font-bold" style={{ color: "var(--accent)" }}>
                      {Math.round(prog)}%
                    </p>
                    <p className="text-[10px] text-[var(--text-muted)]">ETA {monthsToText(eta)}</p>
                  </div>
                </div>
                <ProgressBar value={prog} tone={g.priority === "high" ? "ai" : "accent"} />
                <div className="mt-2.5 flex items-start gap-1.5 rounded-lg bg-[var(--surface-2)] px-2.5 py-2">
                  <span className="text-[12px]">💡</span>
                  <p className="text-[11.5px] text-[var(--text-muted)] leading-snug">
                    {g.id === "emergency" &&
                      "Liam suggests auto-routing $150/mo here from your dining overspend to hit 6 months faster."}
                    {g.id === "home" &&
                      "Adding $200/mo would bring this goal forward by roughly 11 months."}
                    {g.id === "travel" &&
                      "On track: you'll have this funded well before your target date."}
                    {g.id === "education" &&
                      "Consider a 529 or high-yield account to grow this tax-efficiently."}
                    {g.id === "retirement" &&
                      "Compounding does the heavy lifting: increasing 401(k) by 2% adds six figures by retirement."}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
