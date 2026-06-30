"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import TrustBadge from "@/components/TrustBadge";
import { Trust } from "@/lib/insights";
import { SparkleIcon, SendIcon, CloseIcon } from "@/components/icons";

type Msg = {
  role: "user" | "ai";
  text: string;
  trust?: Trust;
  source?: string;
};

const SUGGESTIONS = [
  "How do I pay off my debt fastest?",
  "Can I afford a house in 3 years?",
  "Am I saving enough?",
  "How should I invest $500 a month?",
  "How's my financial health?",
  "Where can I cut spending?",
];

const ONBOARD = "I make $7,200/mo, want to buy a home in 4 years, and have some credit card debt.";

export default function PlannerPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function ask(q: string) {
    const question = q.trim();
    if (!question || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: question }]);
    setLoading(true);
    try {
      const res = await fetch("/api/planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        { role: "ai", text: data.answer, trust: { basis: data.basis, confidence: data.confidence }, source: data.source },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "ai", text: "I had trouble connecting, but I'm still here — try asking again.", source: "error" },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const empty = messages.length === 0;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-2 pb-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2.5">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full"
            style={{ background: "linear-gradient(135deg, var(--ai), #6D5BE0)" }}
          >
            <SparkleIcon width={19} height={19} style={{ color: "white" }} />
          </span>
          <div>
            <h1 className="text-[17px] font-bold leading-none">Aria</h1>
            <p className="text-[11px] text-[var(--accent)] mt-0.5">● Your AI financial planner</p>
          </div>
        </div>
        <Link href="/" className="text-[var(--text-muted)] p-1">
          <CloseIcon width={22} height={22} />
        </Link>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4" style={{ scrollbarWidth: "none" }}>
        {empty && (
          <div className="pt-4">
            <div
              className="rounded-3xl p-5 text-center"
              style={{ background: "var(--ai-soft)" }}
            >
              <span
                className="inline-flex h-14 w-14 items-center justify-center rounded-2xl mb-3"
                style={{ background: "linear-gradient(135deg, var(--ai), #6D5BE0)" }}
              >
                <SparkleIcon width={28} height={28} style={{ color: "white" }} />
              </span>
              <h2 className="text-[18px] font-bold">Tell me about your money</h2>
              <p className="text-[13px] text-[var(--text-muted)] mt-1.5 leading-relaxed">
                In one sentence — your income, a goal, anything. I'll build a plan and answer in plain language.
                Every answer shows the math behind it.
              </p>
              <button
                onClick={() => ask(ONBOARD)}
                className="mt-4 w-full rounded-xl py-2.5 text-[13px] font-semibold text-white"
                style={{ background: "linear-gradient(135deg, var(--ai), #6D5BE0)" }}
              >
                ✨ Try: “{ONBOARD}”
              </button>
            </div>

            <p className="text-[12px] text-[var(--text-muted)] mt-5 mb-2 px-1">Or ask me</p>
            <div className="space-y-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => ask(s)}
                  className="w-full text-left rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[13px] active:scale-[0.99] transition"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) =>
          m.role === "user" ? (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-end"
            >
              <div className="max-w-[80%] rounded-2xl rounded-br-md px-4 py-2.5 text-[14px] text-white"
                style={{ background: "linear-gradient(135deg, var(--ai), #6D5BE0)" }}>
                {m.text}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-start"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <SparkleIcon width={13} height={13} style={{ color: "var(--ai)" }} />
                <span className="text-[11px] font-semibold text-[var(--text-muted)]">Aria</span>
                {m.source === "rules" && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[var(--surface-2)] text-[var(--text-dim)]">
                    offline mode
                  </span>
                )}
              </div>
              <div className="max-w-[88%] rounded-2xl rounded-tl-md bg-[var(--surface)] border border-[var(--border)] px-4 py-3 text-[14px] leading-relaxed">
                {m.text}
                {m.trust && <TrustBadge trust={m.trust} />}
              </div>
            </motion.div>
          ),
        )}

        {loading && (
          <div className="flex items-center gap-1.5">
            <SparkleIcon width={13} height={13} style={{ color: "var(--ai)" }} />
            <div className="flex gap-1 rounded-2xl bg-[var(--surface)] border border-[var(--border)] px-4 py-3">
              {[0, 1, 2].map((d) => (
                <motion.span
                  key={d}
                  className="h-2 w-2 rounded-full bg-[var(--ai)]"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: d * 0.2 }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-3 pb-3 pt-2 border-t border-[var(--border)]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask(input);
          }}
          className="flex items-center gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Aria anything about your money…"
            className="flex-1 rounded-full bg-[var(--surface)] border border-[var(--border)] px-4 py-3 text-[14px] outline-none focus:border-[var(--ai)]"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full disabled:opacity-40"
            style={{ background: "linear-gradient(135deg, var(--ai), #6D5BE0)" }}
          >
            <SendIcon width={19} height={19} style={{ color: "white" }} />
          </button>
        </form>
      </div>
    </div>
  );
}
