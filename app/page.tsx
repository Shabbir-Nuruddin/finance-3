"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useFinance } from "@/lib/store";
import {
  netWorth,
  totalAssets,
  totalLiabilities,
  freeCashFlow,
  healthScore,
} from "@/lib/financialModel";
import { proactiveAlerts } from "@/lib/insights";
import { money } from "@/lib/format";
import { Card, SectionTitle } from "@/components/ui";
import { SimulateButton } from "@/components/Simulate";
import HealthRing from "@/components/HealthRing";
import AlertCard from "@/components/AlertCard";
import { ChevronRight, ArrowUp } from "@/components/icons";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

const HISTORY_FACTORS = [0.9, 0.925, 0.95, 0.962, 0.984, 1]; // 6-mo trend

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning,";
  if (h < 18) return "Good afternoon,";
  return "Good evening,";
}

export default function Dashboard() {
  const { profile } = useFinance();
  const nw = netWorth(profile);
  const alerts = proactiveAlerts(profile);
  const spark = HISTORY_FACTORS.map((f, i) => ({ i, v: Math.round(nw * f) }));
  const monthChange = nw - spark[spark.length - 2].v;
  const score = healthScore(profile);
  const [hello, setHello] = useState("Good morning,");
  useEffect(() => setHello(greeting()), []);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-2 pb-1">
        <div>
          <p className="text-[13px] text-[var(--text-muted)]">{hello}</p>
          <h1 className="text-[24px] font-bold tracking-tight">{profile.name.split(" ")[0]} 👋</h1>
        </div>
        <SimulateButton />
      </div>

      <div className="px-4 space-y-3">
        {/* Net worth hero */}
        <Card glass className="overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[12px] text-[var(--text-muted)]">Net worth</p>
              <p className="text-[34px] font-bold leading-tight tracking-tight">{money(nw)}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <ArrowUp width={14} height={14} style={{ color: "var(--pos)" }} />
                <span className="text-[12px] font-semibold" style={{ color: "var(--pos)" }}>
                  {money(Math.abs(monthChange))} this month
                </span>
              </div>
            </div>
            <div className="h-12 w-24 opacity-90">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={spark} margin={{ top: 4, bottom: 0, left: 0, right: 0 }}>
                  <defs>
                    <linearGradient id="nwSpark" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--pos)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="var(--pos)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="v" stroke="var(--pos)" strokeWidth={2} fill="url(#nwSpark)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-[var(--surface-2)] p-3">
              <p className="text-[11px] text-[var(--text-muted)]">Assets</p>
              <p className="text-[16px] font-bold" style={{ color: "var(--pos)" }}>
                {money(totalAssets(profile), { compact: true })}
              </p>
            </div>
            <div className="rounded-xl bg-[var(--surface-2)] p-3">
              <p className="text-[11px] text-[var(--text-muted)]">Liabilities</p>
              <p className="text-[16px] font-bold" style={{ color: "var(--danger)" }}>
                {money(totalLiabilities(profile), { compact: true })}
              </p>
            </div>
          </div>
        </Card>

        {/* Health + cashflow row */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/health">
            <Card className="flex items-center gap-3 h-full">
              <HealthRing score={score} size={64} stroke={7} showGrade={false} />
              <div>
                <p className="text-[12px] text-[var(--text-muted)]">Health</p>
                <p className="text-[13px] font-semibold leading-tight">Financial<br />score</p>
                <span className="text-[11px] flex items-center gap-0.5 text-[var(--text-dim)] mt-1">
                  Details <ChevronRight width={11} height={11} />
                </span>
              </div>
            </Card>
          </Link>
          <div className="grid grid-rows-2 gap-3">
            <Card className="py-3">
              <p className="text-[11px] text-[var(--text-muted)]">Monthly income</p>
              <p className="text-[17px] font-bold">{money(profile.monthlyIncome)}</p>
            </Card>
            <Card className="py-3">
              <p className="text-[11px] text-[var(--text-muted)]">Free cash flow</p>
              <p className="text-[17px] font-bold" style={{ color: freeCashFlow(profile) >= 0 ? "var(--pos)" : "var(--danger)" }}>
                {money(freeCashFlow(profile), { sign: true })}
              </p>
            </Card>
          </div>
        </div>

        {/* Proactive AI feed (#1) */}
        <SectionTitle
          title="Liam noticed for you"
          action={
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "var(--ai-soft)", color: "var(--ai)" }}>
              {alerts.length} proactive
            </span>
          }
        />
        <p className="px-1 -mt-1 mb-1 text-[12px] text-[var(--text-muted)]">
          Your AI assistant watches your money and flags what matters, before you ask.
        </p>
        <div className="space-y-3">
          {alerts.map((a) => (
            <AlertCard key={a.id} insight={a} />
          ))}
        </div>

        {/* Upcoming bills */}
        <SectionTitle
          title="Upcoming bills"
          action={
            <Link href="/budget" className="text-[12px] text-[var(--ai)] font-semibold">
              View all
            </Link>
          }
        />
        <Card className="divide-y divide-[var(--border)] p-0">
          {profile.bills.slice(0, 4).map((b) => (
            <div key={b.name} className="flex items-center gap-3 px-4 py-3">
              <span className="text-[18px]">{b.icon}</span>
              <div className="flex-1">
                <p className="text-[14px] font-medium">{b.name}</p>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Due in {b.dueInDays} days {b.autopay && "· autopay"}
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
