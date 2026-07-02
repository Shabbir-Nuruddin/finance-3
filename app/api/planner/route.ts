import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { PROFILE, netWorth, savingsRate, emergencyMonths } from "@/lib/financialModel";
import { buildContextSummary, localFallback, sanitizeActions } from "@/lib/insights";
import { money, pct } from "@/lib/format";
import { Profile } from "@/lib/types";

export const runtime = "nodejs";

const SYSTEM = `You are Liam, a warm, plain-spoken AI financial coach inside a personal finance app.
Rules:
- Answer in simple, encouraging language a non-expert understands. No jargon dumps.
- Ground EVERY number in the user's actual figures provided to you. Never invent balances or rates.
- Be specific and actionable: give concrete next steps and dollar amounts.
- Keep answers to 3-5 short sentences.
- You give educational guidance, not licensed financial advice.
Respond ONLY with a valid JSON object, no markdown fences, in this exact shape:
{"answer": string, "basis": string[], "confidence": "High" | "Medium" | "Low", "actions": string[]}
"basis" lists the 2-4 specific user numbers you relied on (e.g. "Credit card $2,850 at 22% APR").
"actions" is 0-2 in-app follow-ups the user should tap next, chosen ONLY from:
"whatif_payoff" (simulate paying off the credit card), "whatif_invest" (simulate investing more),
"timemachine" (net-worth projection), "goals", "budget", "health".`;

function defaultBasis(p: Profile) {
  return [
    `Net worth ${money(netWorth(p))}`,
    `Savings rate ${pct(savingsRate(p))}`,
    `Emergency fund ${emergencyMonths(p).toFixed(1)} months`,
  ];
}

/** Accept the client's (possibly onboarding-personalized) profile so answers
 *  match what the user sees on screen. Falls back to the seeded demo profile. */
function sanitizeProfile(raw: unknown): Profile {
  const p = raw as Profile | undefined;
  const ok =
    p &&
    typeof p.monthlyIncome === "number" &&
    isFinite(p.monthlyIncome) &&
    Array.isArray(p.expenses) &&
    Array.isArray(p.accounts) &&
    Array.isArray(p.debts) &&
    Array.isArray(p.goals) &&
    Array.isArray(p.holdings) &&
    Array.isArray(p.bills) &&
    typeof p.name === "string";
  return ok ? (p as Profile) : PROFILE;
}

function extractJson(text: string): string {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("no json");
  return text.slice(start, end + 1);
}

export async function POST(req: NextRequest) {
  let question = "";
  let rawProfile: unknown;
  try {
    const body = await req.json();
    question = body.question;
    rawProfile = body.profile;
  } catch {
    /* ignore */
  }
  question = (question || "").toString().slice(0, 500);
  const profile = sanitizeProfile(rawProfile);

  const key = process.env.ANTHROPIC_API_KEY;

  // Deterministic fallback — guarantees the demo always works.
  const fallback = () => {
    const reply = localFallback(question, profile);
    return Response.json({
      answer: reply.answer,
      basis: defaultBasis(profile),
      confidence: "High" as const,
      actions: reply.actions,
      source: "rules",
    });
  };

  if (!key) return fallback();

  try {
    const client = new Anthropic({ apiKey: key });
    const ctx = buildContextSummary(profile);
    const msg = await client.messages.create({
      model: process.env.ANTHROPIC_MODEL || "claude-haiku-4-5-20251001",
      max_tokens: 700,
      system: SYSTEM,
      messages: [
        {
          role: "user",
          content: `Here are my finances: ${ctx}\n\nMy question: ${question}`,
        },
      ],
    });
    const text = msg.content
      .map((b) => (b.type === "text" ? b.text : ""))
      .join("");
    const parsed = JSON.parse(extractJson(text));
    return Response.json({
      answer: parsed.answer ?? localFallback(question, profile).answer,
      basis: Array.isArray(parsed.basis) && parsed.basis.length ? parsed.basis : defaultBasis(profile),
      confidence: parsed.confidence ?? "High",
      actions: sanitizeActions(parsed.actions),
      source: "claude",
    });
  } catch {
    return fallback();
  }
}
