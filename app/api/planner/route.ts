import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { PROFILE, netWorth, savingsRate, emergencyMonths } from "@/lib/financialModel";
import { buildContextSummary, localFallbackAnswer } from "@/lib/insights";
import { money, pct } from "@/lib/format";

export const runtime = "nodejs";

const SYSTEM = `You are Liam, a warm, plain-spoken AI financial coach inside a personal finance app.
Rules:
- Answer in simple, encouraging language a non-expert understands. No jargon dumps.
- Ground EVERY number in the user's actual figures provided to you. Never invent balances or rates.
- Be specific and actionable: give concrete next steps and dollar amounts.
- Keep answers to 3-5 short sentences.
- You give educational guidance, not licensed financial advice.
Respond ONLY with a valid JSON object, no markdown fences, in this exact shape:
{"answer": string, "basis": string[], "confidence": "High" | "Medium" | "Low"}
"basis" lists the 2-4 specific user numbers you relied on (e.g. "Credit card $2,850 at 22% APR").`;

function defaultBasis() {
  return [
    `Net worth ${money(netWorth(PROFILE))}`,
    `Savings rate ${pct(savingsRate(PROFILE))}`,
    `Emergency fund ${emergencyMonths(PROFILE).toFixed(1)} months`,
  ];
}

function extractJson(text: string): string {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("no json");
  return text.slice(start, end + 1);
}

export async function POST(req: NextRequest) {
  let question = "";
  try {
    ({ question } = await req.json());
  } catch {
    /* ignore */
  }
  question = (question || "").toString().slice(0, 500);

  const key = process.env.ANTHROPIC_API_KEY;

  // Deterministic fallback — guarantees the demo always works.
  const fallback = () =>
    Response.json({
      answer: localFallbackAnswer(question, PROFILE),
      basis: defaultBasis(),
      confidence: "High" as const,
      source: "rules",
    });

  if (!key) return fallback();

  try {
    const client = new Anthropic({ apiKey: key });
    const ctx = buildContextSummary(PROFILE);
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
      answer: parsed.answer ?? localFallbackAnswer(question, PROFILE),
      basis: Array.isArray(parsed.basis) && parsed.basis.length ? parsed.basis : defaultBasis(),
      confidence: parsed.confidence ?? "High",
      source: "claude",
    });
  } catch {
    return fallback();
  }
}
