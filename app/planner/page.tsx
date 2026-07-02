"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import TrustBadge from "@/components/TrustBadge";
import {
  Trust,
  ChatAction,
  ChatActionType,
  chatAction,
  proactiveAlerts,
} from "@/lib/insights";
import { useFinance } from "@/lib/store";
import { useUI } from "@/lib/ui";
import { netWorth, savingsRate, healthScore } from "@/lib/financialModel";
import { money, pct } from "@/lib/format";
import { SparkleIcon, SendIcon, CloseIcon } from "@/components/icons";

type Msg = {
  role: "user" | "ai";
  text: string;
  trust?: Trust;
  source?: string;
  actions?: ChatAction[];
  /** render fully without the typewriter effect (e.g. seeded greeting) */
  instant?: boolean;
  greeting?: boolean;
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

/* Microphone icon */
function MicIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
    </svg>
  );
}

/* AI bubble with typewriter reveal; trust + action chips appear once typed. */
function AiBubble({
  m,
  onAction,
  onGrow,
}: {
  m: Msg;
  onAction: (t: ChatActionType) => void;
  onGrow: () => void;
}) {
  const [chars, setChars] = useState(m.instant ? m.text.length : 0);
  const typed = chars >= m.text.length;

  useEffect(() => {
    if (typed) return;
    const t = setTimeout(() => {
      setChars((n) => Math.min(m.text.length, n + 3));
      onGrow();
    }, 16);
    return () => clearTimeout(t);
  }, [chars, typed, m.text.length, onGrow]);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-start">
      <div className="flex items-center gap-1.5 mb-1">
        <SparkleIcon width={13} height={13} style={{ color: "var(--accent)" }} />
        <span className="text-[11px] font-semibold text-[var(--text-muted)]">Liam</span>
        {m.source === "rules" && (
          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[var(--surface-2)] text-[var(--text-dim)]">
            offline mode
          </span>
        )}
      </div>
      <div className="max-w-[88%] rounded-2xl rounded-tl-md bg-[var(--surface)] border border-[var(--border)] px-4 py-3 text-[14px] leading-relaxed shadow-sm">
        {m.text.slice(0, chars)}
        {!typed && <span className="animate-pulse text-[var(--accent)]">▍</span>}
        {typed && m.trust && <TrustBadge trust={m.trust} />}
      </div>
      {typed && !!m.actions?.length && (
        <div className="mt-2 flex flex-wrap gap-2">
          {m.actions.map((a) => (
            <button
              key={a.type}
              onClick={() => onAction(a.type)}
              className="rounded-full border px-3 py-2 text-[12px] font-semibold active:scale-95 transition"
              style={{
                borderColor: "var(--accent)",
                background: "var(--accent-soft)",
                color: "var(--accent-deep, var(--accent))",
              }}
            >
              {a.label}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default function PlannerPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [voiceHint, setVoiceHint] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const openWhatIf = useUI((s) => s.openWhatIf);
  const setScenario = useFinance((s) => s.setScenario);
  // The user's real numbers (personalized by onboarding if they did it), so
  // Liam's answers always match what's on screen.
  const base = useFinance((s) => s.base);
  const personalized = useFinance((s) => s.personalized);

  const scrollToEnd = useCallback(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  // If the user completed onboarding, Liam opens the conversation himself —
  // grounded in their numbers, with the Trust Layer attached.
  useEffect(() => {
    if (!personalized || messages.length) return;
    const first = base.name.split(" ")[0];
    const top = proactiveAlerts(base)[0];
    setMessages([
      {
        role: "ai",
        instant: true,
        greeting: true,
        text: `Hey ${first}, I've looked over your numbers. Net worth ${money(
          netWorth(base),
        )}, saving ${pct(savingsRate(base))} of your income. One thing stands out: ${
          top ? top.title.toLowerCase() : "you're in good shape"
        }. Ask me anything, or tap a suggestion below.`,
        trust: {
          basis: [
            `Net worth ${money(netWorth(base))}`,
            `Savings rate ${pct(savingsRate(base))}`,
            `Health score ${healthScore(base)}/100`,
          ],
          confidence: "High",
        },
        actions: top?.id === "creditcard" ? [chatAction("whatif_payoff"), chatAction("health")] : [chatAction("health"), chatAction("timemachine")],
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personalized]);

  function showVoiceSoon() {
    setVoiceHint(true);
    setTimeout(() => setVoiceHint(false), 2600);
  }

  // Agentic actions: Liam's answers can drive the app with state pre-loaded.
  function handleAction(t: ChatActionType) {
    switch (t) {
      case "whatif_payoff":
        setScenario({ payoffCreditCard: true });
        openWhatIf();
        router.push("/");
        break;
      case "whatif_invest":
        setScenario({ extraInvest: 500 });
        openWhatIf();
        router.push("/");
        break;
      case "timemachine":
      case "goals":
        router.push("/goals");
        break;
      case "budget":
        router.push("/budget");
        break;
      case "health":
        router.push("/health");
        break;
    }
  }

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
        body: JSON.stringify({ question, profile: base }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        {
          role: "ai",
          text: data.answer,
          trust: { basis: data.basis, confidence: data.confidence },
          source: data.source,
          actions: Array.isArray(data.actions) ? data.actions : [],
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "ai", text: "I had trouble connecting, but I'm still here. Try asking again.", source: "error" },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const empty = messages.length === 0;
  const showSuggestions = empty || (messages.length === 1 && messages[0].greeting);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-2 pb-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full brand-grad">
            <SparkleIcon width={19} height={19} style={{ color: "white" }} />
          </span>
          <div>
            <h1 className="text-[17px] font-bold leading-none">Liam</h1>
            <p className="text-[11px] text-[var(--pos)] mt-0.5">● Your AI financial planner</p>
          </div>
        </div>
        <Link href="/" className="text-[var(--text-muted)] p-1">
          <CloseIcon width={22} height={22} />
        </Link>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4" style={{ scrollbarWidth: "none" }}>
        {empty && (
          <div className="pt-2">
            <div className="rounded-3xl p-5 text-center" style={{ background: "var(--accent-soft)" }}>
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl mb-3 brand-grad">
                <SparkleIcon width={28} height={28} style={{ color: "white" }} />
              </span>
              <h2 className="text-[18px] font-bold">Tell me about your money</h2>
              <p className="text-[13px] text-[var(--text-muted)] mt-1.5 leading-relaxed">
                In one sentence: your income, a goal, anything. I&apos;ll build a plan and answer in
                plain language. Every answer shows the math behind it.
              </p>
              <button
                onClick={() => ask(ONBOARD)}
                className="mt-4 w-full rounded-xl brand-grad py-2.5 text-[13px] font-semibold text-white"
              >
                ✨ Try: “{ONBOARD}”
              </button>
            </div>

            {/* Offline-mode explainer (#5) */}
            <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3.5">
              <span className="text-[16px]">🔌</span>
              <p className="text-[12px] text-[var(--text-muted)] leading-relaxed">
                <span className="font-semibold text-[var(--text)]">Offline demo mode.</span> I answer
                from your live data &amp; memory right now, and you can{" "}
                <span className="font-semibold text-[var(--text)]">talk to me by voice</span> soon. Full
                conversational AI is <span className="font-semibold text-[var(--accent)]">coming soon</span>.
              </p>
            </div>
          </div>
        )}

        {messages.map((m, i) =>
          m.role === "user" ? (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end">
              <div className="max-w-[80%] rounded-2xl rounded-br-md brand-grad px-4 py-2.5 text-[14px] text-white">
                {m.text}
              </div>
            </motion.div>
          ) : (
            <AiBubble key={i} m={m} onAction={handleAction} onGrow={scrollToEnd} />
          ),
        )}

        {showSuggestions && (
          <div>
            <p className="text-[12px] text-[var(--text-muted)] mt-1 mb-2 px-1">
              {empty ? "Or ask me" : "Try asking"}
            </p>
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

        {loading && (
          <div className="flex items-center gap-1.5">
            <SparkleIcon width={13} height={13} style={{ color: "var(--accent)" }} />
            <div className="flex gap-1 rounded-2xl bg-[var(--surface)] border border-[var(--border)] px-4 py-3">
              {[0, 1, 2].map((d) => (
                <motion.span
                  key={d}
                  className="h-2 w-2 rounded-full"
                  style={{ background: "var(--accent)" }}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: d * 0.2 }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="relative px-3 pb-3 pt-2 border-t border-[var(--border)]">
        <AnimatePresence>
          {voiceHint && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className="absolute -top-9 left-3 rounded-full bg-[var(--text)] px-3 py-1.5 text-[11px] font-semibold text-[var(--phone-bg)] shadow"
            >
              🎙️ Voice chat is coming soon
            </motion.div>
          )}
        </AnimatePresence>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask(input);
          }}
          className="flex items-center gap-2"
        >
          {/* Voice button — visibly distinct, "coming soon" (#4) */}
          <button
            type="button"
            onClick={showVoiceSoon}
            aria-label="Voice chat (coming soon)"
            className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-[var(--accent)] text-[var(--accent)]"
            style={{ background: "var(--accent-soft)" }}
          >
            <MicIcon size={19} />
            <span className="absolute -top-1.5 -right-1.5 rounded-full bg-[var(--accent)] px-1 py-px text-[7px] font-bold uppercase tracking-wide text-white">
              soon
            </span>
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Liam anything about your money…"
            className="flex-1 min-w-0 rounded-full bg-[var(--surface)] border border-[var(--border)] px-4 py-2.5 text-[16px] outline-none focus:border-[var(--accent)]"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full brand-grad disabled:opacity-40"
          >
            <SendIcon width={19} height={19} style={{ color: "white" }} />
          </button>
        </form>
      </div>
    </div>
  );
}
