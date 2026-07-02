"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useUI } from "@/lib/ui";

const SLIDES = [
  {
    icon: "🛡️",
    title: "Liam watches your back",
    body: "Your dashboard shows proactive insights: money issues and opportunities Liam spots before you ask. Tap any card to act on it.",
    where: "Home tab",
  },
  {
    icon: "✨",
    title: "Ask Liam anything",
    body: "Chat in plain language and get a grounded plan. Every answer reveals the exact numbers behind it.",
    where: "The bronze button, bottom-right",
  },
  {
    icon: "⚡",
    title: "Stress-test your life",
    body: "Open the What-If simulator and drag sliders: lose a job, have a baby, invest more. Everything recalculates instantly.",
    where: "The “What-If” button, top of most screens",
  },
  {
    icon: "⏳",
    title: "Meet your future self",
    body: "The Financial Time Machine projects your net worth decades ahead, with a note from future you.",
    where: "Goals tab",
  },
];

export default function Tutorial() {
  const { tutorialOpen, closeTutorial } = useUI();
  const [i, setI] = useState(0);
  if (!tutorialOpen) return null;

  const slide = SLIDES[i];
  const last = i === SLIDES.length - 1;

  return (
    <div className="absolute inset-0 z-[80] flex items-end bg-black/45 backdrop-blur-[2px]">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full rounded-t-[28px] bg-[var(--phone-bg)] border-t border-[var(--border-strong)] px-6 pb-[max(22px,env(safe-area-inset-bottom))] pt-6"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wide text-[var(--accent)]">
            Quick tour · {i + 1}/{SLIDES.length}
          </span>
          <button onClick={closeTutorial} className="text-[13px] font-medium text-[var(--text-muted)]">
            Skip
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="mt-4"
          >
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl text-[32px]"
              style={{ background: "var(--accent-soft)" }}
            >
              {slide.icon}
            </div>
            <h2 className="mt-4 text-[22px] font-bold leading-tight">{slide.title}</h2>
            <p className="mt-2 text-[14px] text-[var(--text-muted)] leading-relaxed">{slide.body}</p>
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[var(--surface-2)] px-3 py-1.5">
              <span className="text-[12px]">📍</span>
              <span className="text-[12px] font-semibold">Find it: {slide.where}</span>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex gap-1.5">
            {SLIDES.map((_, idx) => (
              <div
                key={idx}
                className="h-2 rounded-full transition-all"
                style={{
                  width: idx === i ? 20 : 8,
                  background: idx === i ? "var(--accent)" : "var(--surface-2)",
                }}
              />
            ))}
          </div>
          <button
            onClick={() => (last ? closeTutorial() : setI(i + 1))}
            className="rounded-2xl brand-grad px-6 py-3 text-[14px] font-semibold text-white shadow active:scale-[0.98] transition"
          >
            {last ? "Got it" : "Next"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
