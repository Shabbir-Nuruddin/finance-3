"use client";

import { healthGrade } from "@/lib/financialModel";

export default function HealthRing({
  score,
  size = 120,
  stroke = 11,
  showGrade = true,
}: {
  score: number;
  size?: number;
  stroke?: number;
  showGrade?: boolean;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const grade = healthGrade(score);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--surface-2)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={grade.color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.7s ease, stroke 0.4s" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-[28px] font-bold leading-none" style={{ fontSize: size * 0.26 }}>
          {Math.round(score)}
        </span>
        {showGrade && (
          <span className="text-[11px] font-semibold mt-0.5" style={{ color: grade.color }}>
            {grade.label}
          </span>
        )}
      </div>
    </div>
  );
}
