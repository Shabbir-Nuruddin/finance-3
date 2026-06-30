"use client";

import { Insight } from "@/lib/insights";
import { useUI } from "@/lib/ui";
import { useFinance } from "@/lib/store";
import TrustBadge from "./TrustBadge";

const TONE: Record<
  Insight["severity"],
  { ring: string; chip: string; label: string }
> = {
  urgent: { ring: "var(--danger)", chip: "var(--danger-soft)", label: "Act now" },
  opportunity: { ring: "var(--accent)", chip: "var(--accent-soft)", label: "Opportunity" },
  win: { ring: "var(--accent)", chip: "var(--accent-soft)", label: "Win" },
  info: { ring: "var(--info)", chip: "rgba(77,166,255,0.15)", label: "Heads up" },
};

export default function AlertCard({ insight }: { insight: Insight }) {
  const tone = TONE[insight.severity];
  const openWhatIf = useUI((s) => s.openWhatIf);
  const setScenario = useFinance((s) => s.setScenario);

  // Each proactive alert's button takes a real action: it opens the What-If
  // simulator pre-loaded with the relevant change so the impact is visible live.
  function handleAction() {
    switch (insight.id) {
      case "creditcard":
        setScenario({ payoffCreditCard: true });
        break;
      case "overspend":
        setScenario({ spendingChangePct: -10 });
        break;
      case "idlecash":
        setScenario({ extraInvest: 500 });
        break;
    }
    openWhatIf();
  }

  return (
    <div
      className="card p-4"
      style={{ borderLeft: `3px solid ${tone.ring}` }}
    >
      <div className="flex items-start gap-3">
        <span className="text-[22px] leading-none mt-0.5">{insight.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
              style={{ background: tone.chip, color: tone.ring }}
            >
              {tone.label}
            </span>
            {insight.impact && (
              <span className="text-[11px] font-semibold" style={{ color: "var(--accent)" }}>
                {insight.impact}
              </span>
            )}
          </div>
          <h3 className="text-[14px] font-semibold leading-snug">{insight.title}</h3>
          <p className="text-[12.5px] text-[var(--text-muted)] mt-1 leading-relaxed">
            {insight.body}
          </p>
          <button
            onClick={handleAction}
            className="mt-2.5 rounded-lg px-3 py-1.5 text-[12px] font-semibold active:scale-95 transition"
            style={{ background: tone.ring, color: "#06080d" }}
          >
            {insight.action} →
          </button>
          <TrustBadge trust={insight.trust} />
        </div>
      </div>
    </div>
  );
}
