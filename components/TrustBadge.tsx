"use client";

import { useState } from "react";
import { Trust } from "@/lib/insights";
import { ShieldIcon, ChevronRight } from "./icons";

export default function TrustBadge({ trust }: { trust: Trust }) {
  const [open, setOpen] = useState(false);
  const conf = trust.confidence;
  const color =
    conf === "High" ? "var(--accent)" : conf === "Medium" ? "var(--warn)" : "var(--text-muted)";

  return (
    <div className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--bg-2)] overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-3 py-2"
      >
        <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--text-muted)]">
          <ShieldIcon width={14} height={14} style={{ color }} />
          Why this? · {conf} confidence
        </span>
        <ChevronRight
          width={14}
          height={14}
          style={{
            color: "var(--text-dim)",
            transform: open ? "rotate(90deg)" : "none",
            transition: "transform 0.2s",
          }}
        />
      </button>
      {open && (
        <div className="px-3 pb-3 pt-0.5">
          <p className="text-[10.5px] uppercase tracking-wide text-[var(--text-dim)] mb-1.5">
            Based on your numbers
          </p>
          <ul className="space-y-1">
            {trust.basis.map((b, i) => (
              <li key={i} className="flex items-start gap-1.5 text-[12px] text-[var(--text-muted)]">
                <span style={{ color }}>•</span>
                {b}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[10.5px] italic text-[var(--text-dim)]">
            Educational guidance, not licensed financial advice.
          </p>
        </div>
      )}
    </div>
  );
}
