"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useFinance } from "@/lib/store";
import { investableAssets, sum } from "@/lib/financialModel";
import { money, pct } from "@/lib/format";
import { Card, SectionTitle, PageHeader, Pill } from "@/components/ui";

const COLORS = ["#2DD4A7", "#4DA6FF", "#8B7CF6", "#F5A524", "#F4567B", "#22C7C7", "#6B7280"];

const EDU = [
  {
    icon: "📚",
    title: "Why diversification works",
    body: "Spreading across US, international, and bonds smooths returns — when one zigs, another zags. Your mix already does this.",
  },
  {
    icon: "⏳",
    title: "Time in market > timing it",
    body: "Missing the 10 best days in a decade can halve your returns. Staying invested is the proven edge.",
  },
];

export default function InvestPage() {
  const { profile } = useFinance();
  const total = investableAssets(profile);
  const weightedReturn =
    sum(profile.holdings.map((h) => (h.weight / 100) * h.ret1y));
  const gain = total * (weightedReturn / 100);

  return (
    <div>
      <PageHeader title="Investments" subtitle="Portfolio performance & insight" />

      <div className="px-4 space-y-3">
        <Card glass>
          <p className="text-[12px] text-[var(--text-muted)]">Portfolio value</p>
          <p className="text-[30px] font-bold leading-tight">{money(total)}</p>
          <div className="flex items-center gap-2 mt-1">
            <Pill tone="accent">▲ {pct(weightedReturn / 100, 1)} 1yr</Pill>
            <span className="text-[12px] text-[var(--text-muted)]">
              {money(gain, { compact: true, sign: true })} gain
            </span>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <div className="h-[120px] w-[120px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={profile.holdings}
                    dataKey="weight"
                    nameKey="ticker"
                    innerRadius={36}
                    outerRadius={58}
                    paddingAngle={2}
                    stroke="none"
                  >
                    {profile.holdings.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-x-2 gap-y-1.5">
              {profile.holdings.map((h, i) => (
                <div key={h.ticker} className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="text-[11px] text-[var(--text-muted)]">
                    {h.ticker} {h.weight}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <SectionTitle title="Holdings" />
        <Card className="divide-y divide-[var(--border)] p-0">
          {profile.holdings.map((h) => (
            <div key={h.ticker} className="flex items-center gap-3 px-4 py-3">
              <div className="flex-1">
                <p className="text-[14px] font-semibold">{h.ticker}</p>
                <p className="text-[11px] text-[var(--text-muted)]">{h.name}</p>
              </div>
              <div className="text-right">
                <p className="text-[14px] font-semibold">{money(h.value)}</p>
                <p className="text-[11px] font-medium" style={{ color: h.ret1y >= 0 ? "var(--accent)" : "var(--danger)" }}>
                  {h.ret1y >= 0 ? "▲" : "▼"} {Math.abs(h.ret1y)}%
                </p>
              </div>
            </div>
          ))}
        </Card>

        {/* Goal alignment */}
        <SectionTitle title="Alignment with your goals" />
        <Card>
          <div className="flex items-start gap-2.5">
            <span className="text-[18px]">🎯</span>
            <p className="text-[12.5px] text-[var(--text-muted)] leading-relaxed">
              Your portfolio's <span className="text-[var(--text)] font-semibold">{pct(weightedReturn / 100, 1)}</span> return
              and growth tilt fit a <span className="text-[var(--text)] font-semibold">long-horizon retirement goal</span> (36 years out).
              For your <span className="text-[var(--text)] font-semibold">home down payment in 4 years</span>, Liam suggests shifting
              that portion toward lower-volatility bonds or HYSA so a market dip doesn't delay your purchase.
            </p>
          </div>
        </Card>

        <SectionTitle title="Learn" />
        <div className="space-y-3">
          {EDU.map((e) => (
            <Card key={e.title}>
              <div className="flex items-start gap-2.5">
                <span className="text-[18px]">{e.icon}</span>
                <div>
                  <p className="text-[14px] font-semibold">{e.title}</p>
                  <p className="text-[12.5px] text-[var(--text-muted)] leading-relaxed mt-0.5">{e.body}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
