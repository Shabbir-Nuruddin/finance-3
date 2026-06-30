# Liam — AI Wealth Planner

A modern, AI-powered financial planning **mobile app** (mobile-formatted web app) built for the hackathon brief: help users manage finances, achieve goals, make smarter decisions, and build long-term wealth.

## Why this wins — 4 differentiators

Most submissions are "a dashboard + a chatbot." Liam reframes what the app *is*:

1. **🛡️ Proactive Agent (it watches your back).** The home feed surfaces specific, money-saving actions *before* you ask — cash-flow crunches, a credit card quietly costing you $627/yr, idle cash, missed autopay. *"Other apps wait for you to ask. Ours notices first."*
2. **⏳ Financial Time Machine.** Scrub your net worth decades into the future and meet your future self, with AI narration of the consequences of today's choices. *"See the millionaire — or the regret — you're building today."*
3. **⚡ Live What-If Simulator.** Drag sliders (lose your job, have a baby, invest more, pay off the card) and the **entire app recalculates in real time** — net worth, goals, health score, everything. *"Stress-test your life before it happens."*
4. **✅ Trust Layer.** Every AI recommendation has a "Why this?" expander showing the exact numbers it used and a confidence level. *"AI you can actually trust with your money — it shows the math."*

## Required screens (all covered)

| Brief screen | Where |
|---|---|
| Financial Dashboard | `/` — net worth, assets/liabilities, health score, bills, proactive feed |
| AI Financial Planner | `/planner` — conversational, plain-language, with the Trust Layer |
| Goals & Wealth Planning | `/goals` — goal tracking + the Time Machine |
| Budget & Cash Flow | `/budget` — categorized spend, budgets, proactive savings insights |
| Investment & Portfolio | `/invest` — allocation, performance, education, goal alignment |
| Financial Health Center | `/health` — wellness score, risk assessment, personalized action plan |

## What's real vs. simulated

- **100% real math (no hallucination):** every number, projection, the What-If recalculation, the health score, and the proactive alerts are deterministic functions over a seeded profile (`lib/financialModel.ts`, `lib/insights.ts`). Change one input and the whole app updates consistently.
- **The AI Planner text:** calls Claude server-side (`app/api/planner/route.ts`). If no API key is set, it falls back to a **deterministic, grounded engine** so the live demo never breaks.

## Tech

Next.js 16 (App Router) · TypeScript · Tailwind v4 · Recharts · Framer Motion · Zustand · Anthropic SDK.

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000
```

View at a phone width (DevTools device toolbar, ~430px) for the full app feel.

### Enable live AI (optional)

```bash
cp .env.example .env.local
# set ANTHROPIC_API_KEY=sk-ant-...
```

Without a key the Planner uses the built-in fallback engine.

## Deploy (Vercel)

1. Push this repo to GitHub.
2. Import it in Vercel — framework auto-detected (Next.js), no config needed.
3. (Optional) add `ANTHROPIC_API_KEY` in Vercel → Project → Settings → Environment Variables.
4. Deploy. The submission link is the Vercel URL.

## 30-second demo script

1. **Home** — point at the "Liam noticed for you" feed: the app is *already* working for you. Expand a "Why this?" badge → the Trust Layer.
2. **Goals → Time Machine** — drag the slider to age 65, read the future-self note, show the "millionaire at age X" line.
3. **Tap "What-If"** → choose **New baby** + drag spending up → watch net worth, health score, and savings rate update live. Then toggle **Pay off credit card** → score jumps.
4. **AI Planner (FAB)** — tap the one-sentence onboarding, get a grounded plan with its math shown.
