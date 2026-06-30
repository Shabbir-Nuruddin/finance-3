"use client";

import { useFinance } from "@/lib/store";
import { healthScore, healthBreakdown, healthGrade } from "@/lib/financialModel";
import { actionPlan, riskFlags } from "@/lib/insights";
import { Card, SectionTitle, ProgressBar, PageHeader, Pill } from "@/components/ui";
import { SimulateButton } from "@/components/Simulate";
import HealthRing from "@/components/HealthRing";

const RISK_TONE: Record<string, "accent" | "warn" | "danger"> = {
  Low: "accent",
  Moderate: "warn",
  Elevated: "danger",
};

export default function HealthPage() {
  const { profile } = useFinance();
  const score = healthScore(profile);
  const grade = healthGrade(score);
  const breakdown = healthBreakdown(profile);
  const plan = actionPlan(profile);
  const risks = riskFlags(profile);
  const potential = score + plan.filter((p) => !p.done).reduce((a, p) => a + p.points, 0);

  return (
    <div>
      <div className="flex items-center justify-between pr-5">
        <PageHeader title="Health Center" subtitle="Your financial wellness, scored" />
        <SimulateButton />
      </div>

      <div className="px-4 space-y-3">
        {/* Score hero */}
        <Card glass className="flex items-center gap-4">
          <HealthRing score={score} size={104} stroke={10} />
          <div className="flex-1">
            <p className="text-[13px] text-[var(--text-muted)]">Overall wellness</p>
            <p className="text-[18px] font-bold" style={{ color: grade.color }}>
              {grade.label}
            </p>
            <p className="text-[12px] text-[var(--text-muted)] mt-1 leading-snug">
              Complete your action plan to reach{" "}
              <span className="font-bold text-[var(--accent)]">{Math.min(potential, 100)}</span>.
            </p>
          </div>
        </Card>

        {/* Score breakdown */}
        <SectionTitle title="What's driving your score" />
        <Card className="space-y-3.5">
          {breakdown.map((b) => {
            const tone = b.score >= 75 ? "accent" : b.score >= 50 ? "warn" : "danger";
            return (
              <div key={b.key}>
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <p className="text-[13px] font-medium">{b.label}</p>
                    <p className="text-[11px] text-[var(--text-muted)]">{b.detail}</p>
                  </div>
                  <span className="text-[13px] font-bold" style={{ color: `var(--${tone === "accent" ? "accent" : tone})` }}>
                    {Math.round(b.score)}
                  </span>
                </div>
                <ProgressBar value={b.score} tone={tone} />
              </div>
            );
          })}
        </Card>

        {/* Risk assessment */}
        <SectionTitle title="Risk assessment" />
        <div className="grid grid-cols-2 gap-3">
          {risks.map((r) => (
            <Card key={r.label} className="py-3">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[12px] font-medium">{r.label}</p>
                <Pill tone={RISK_TONE[r.level]}>{r.level}</Pill>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] leading-snug">{r.note}</p>
            </Card>
          ))}
        </div>

        {/* Action plan */}
        <SectionTitle
          title="Personalized action plan"
          action={<span className="text-[11px] text-[var(--text-muted)]">{plan.filter((p) => !p.done).length} to do</span>}
        />
        <Card className="space-y-2.5 p-0 divide-y divide-[var(--border)]">
          {plan.map((step, i) => (
            <div key={i} className="flex items-start gap-3 px-4 py-3">
              <span
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                style={{
                  background: step.done ? "var(--accent)" : "var(--surface-2)",
                  color: step.done ? "#06080d" : "var(--text-dim)",
                }}
              >
                {step.done ? "✓" : i + 1}
              </span>
              <div className="flex-1">
                <p className={`text-[13.5px] font-medium ${step.done ? "line-through text-[var(--text-dim)]" : ""}`}>
                  {step.title}
                </p>
                {!step.done && (
                  <p className="text-[11.5px] text-[var(--text-muted)] leading-snug mt-0.5">{step.detail}</p>
                )}
              </div>
              {!step.done && (
                <span className="text-[11px] font-bold shrink-0" style={{ color: "var(--accent)" }}>
                  +{step.points}
                </span>
              )}
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
