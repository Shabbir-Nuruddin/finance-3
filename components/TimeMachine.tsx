"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  ReferenceDot,
  Tooltip,
} from "recharts";
import { useFinance } from "@/lib/store";
import { projectNetWorth } from "@/lib/financialModel";
import { money } from "@/lib/format";
import { SparkleIcon } from "./icons";

const MAX = 40;

function narrate(age: number, year: number, nw: number, name: string): string {
  if (nw >= 1_000_000)
    return `At ${age}, you're a millionaire. The boring, automatic habits you set today did this, not luck. Future ${name} is free to choose work, not forced into it.`;
  if (nw >= 500_000)
    return `By ${age} you've crossed half a million. Compounding has taken over: your money now earns more some years than you save. Stay the course.`;
  if (nw >= 250_000)
    return `At ${age}, a quarter-million net worth gives you real options: a home, a sabbatical, or simply sleeping well. This is what consistency buys.`;
  if (nw >= 100_000)
    return `You hit six figures around ${age}. The first $100k is the hardest, from here the curve bends in your favor.`;
  return `In ${year} years you're ${age}. Every extra dollar invested now is worth far more than later, this is your cheapest time to build wealth.`;
}

export default function TimeMachine() {
  const { profile, scenarioActive } = useFinance();
  const [year, setYear] = useState(15);

  const data = useMemo(() => projectNetWorth(profile, MAX), [profile]);
  const point = data[year];
  const future = data.find((d) => d.netWorth >= 1_000_000);

  return (
    <div className="card p-4 overflow-hidden">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-full"
            style={{ background: "var(--ai-soft)", color: "var(--ai)" }}
          >
            <SparkleIcon width={15} height={15} />
          </span>
          <h3 className="text-[15px] font-bold">Financial Time Machine</h3>
        </div>
        {scenarioActive && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "var(--ai-soft)", color: "var(--ai)" }}>
            SIM
          </span>
        )}
      </div>
      <p className="text-[12px] text-[var(--text-muted)] mb-3">
        Drag through time to meet your future self
      </p>

      <div className="flex items-end justify-between mb-1">
        <div>
          <p className="text-[11px] text-[var(--text-muted)]">Projected net worth at age {point.age}</p>
          <p className="text-[30px] font-bold leading-none mt-0.5" style={{ color: "var(--ai)" }}>
            {money(point.netWorth, { compact: true })}
          </p>
        </div>
        <p className="text-[12px] text-[var(--text-muted)]">+{year} yrs</p>
      </div>

      <div className="h-[120px] -mx-1 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 6, right: 4, left: 4, bottom: 0 }}>
            <defs>
              <linearGradient id="tmFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--ai)" stopOpacity={0.45} />
                <stop offset="100%" stopColor="var(--ai)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="age" hide />
            <YAxis hide domain={[0, "dataMax"]} />
            <Tooltip
              contentStyle={{
                background: "var(--surface)",
                border: "1px solid var(--border-strong)",
                borderRadius: 12,
                fontSize: 12,
              }}
              labelFormatter={(a) => `Age ${a}`}
              formatter={(v) => [money(Number(v), { compact: true }), "Net worth"]}
            />
            <Area
              type="monotone"
              dataKey="netWorth"
              stroke="var(--ai)"
              strokeWidth={2.5}
              fill="url(#tmFill)"
            />
            <ReferenceDot x={point.age} y={point.netWorth} r={5} fill="var(--ai)" stroke="white" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <input
        type="range"
        min={1}
        max={MAX}
        value={year}
        onChange={(e) => setYear(Number(e.target.value))}
        className="mt-2"
      />
      <div className="flex justify-between text-[10px] text-[var(--text-dim)] mt-1">
        <span>Now · {data[0].age}</span>
        <span>Age {data[MAX].age}</span>
      </div>

      {/* AI narration */}
      <div className="mt-3 rounded-2xl p-3.5" style={{ background: "var(--ai-soft)" }}>
        <p className="text-[10px] font-bold uppercase tracking-wide mb-1" style={{ color: "var(--ai)" }}>
          ✦ A note from future you
        </p>
        <p className="text-[13px] leading-relaxed text-[var(--text)]">
          {narrate(point.age, year, point.netWorth, profile.name.split(" ")[0])}
        </p>
      </div>

      {future && (
        <p className="mt-2.5 text-center text-[12px] text-[var(--text-muted)]">
          🎯 On this path you become a millionaire at{" "}
          <span className="font-bold text-[var(--accent)]">age {future.age}</span>
        </p>
      )}
    </div>
  );
}
