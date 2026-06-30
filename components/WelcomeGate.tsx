"use client";

import { motion } from "framer-motion";
import { useUI } from "@/lib/ui";

const VALUE = [
  { icon: "🛡️", title: "Watches your back", body: "Spots money issues before you ask." },
  { icon: "⏳", title: "Projects your future", body: "See the wealth you're building over time." },
  { icon: "⚡", title: "Stress-tests your life", body: "Try any 'what-if' and see the impact live." },
];

export function BrandMark({ size = 56 }: { size?: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-2xl brand-grad text-white font-bold no-tap"
      style={{ width: size, height: size, fontSize: size * 0.5, letterSpacing: "-0.02em" }}
    >
      L
    </div>
  );
}

export default function WelcomeGate() {
  const { welcomeOpen, startDemo, openOnboarding, closeWelcome } = useUI();
  if (!welcomeOpen) return null;

  return (
    <motion.div
      className="absolute inset-0 z-[60] flex flex-col bg-[var(--phone-bg)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex-1 overflow-y-auto px-6 pt-14 pb-6" style={{ scrollbarWidth: "none" }}>
        <motion.div
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.05 }}
          className="flex flex-col items-center text-center"
        >
          <BrandMark size={64} />
          <h1 className="mt-4 text-[30px] font-bold tracking-tight">Meet Liam</h1>
          <p className="mt-1 text-[14px] text-[var(--text-muted)] leading-relaxed max-w-[300px]">
            Your AI guide to managing money and building long-term wealth.
          </p>
        </motion.div>

        <div className="mt-8 space-y-3">
          {VALUE.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              className="card flex items-center gap-3.5 p-4"
            >
              <span className="text-[24px]">{v.icon}</span>
              <div>
                <p className="text-[14px] font-semibold">{v.title}</p>
                <p className="text-[12px] text-[var(--text-muted)]">{v.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="px-6 pb-[max(22px,env(safe-area-inset-bottom))] pt-2 space-y-2.5">
        <button
          onClick={startDemo}
          className="w-full rounded-2xl brand-grad py-3.5 text-[15px] font-semibold text-white shadow active:scale-[0.99] transition"
        >
          Explore the demo →
        </button>
        <button
          onClick={openOnboarding}
          className="w-full rounded-2xl border border-[var(--border-strong)] bg-[var(--surface)] py-3.5 text-[15px] font-semibold active:scale-[0.99] transition"
        >
          Set up my profile
        </button>
        <button
          onClick={closeWelcome}
          className="w-full py-1.5 text-[13px] font-medium text-[var(--text-muted)]"
        >
          Skip for now
        </button>
      </div>
    </motion.div>
  );
}
