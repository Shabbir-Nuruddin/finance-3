# Liam — AI Wealth Planner

A modern, AI-powered financial planning **mobile app** (mobile-formatted web app) built for the hackathon brief: help users manage finances, achieve goals, make smarter decisions, and build long-term wealth.

## The pitch (30 seconds)

**Problem:** Every finance app is a rear-view mirror — charts of what you already spent, and a chatbot that waits to be asked.

**Liam is a guide, not a dashboard.** He notices problems before you ask, shows you the future you're building, lets you stress-test life decisions live, and proves every recommendation with the math behind it. One sentence of onboarding, and the whole app — including the AI's answers — reshapes around *your* numbers.

**Why we win:**
- The AI is **agentic** — chat answers end in buttons that drive the app (tap "Simulate paying off the card" → the simulator opens pre-loaded, your health score jumps, confetti).
- Everything **recalculates live** — one financial engine powers all six screens, so a what-if ripples everywhere consistently.
- **Honest AI** — a Trust Layer shows the exact numbers behind every answer, and the demo runs flawlessly with zero API keys.

## Why this wins — 4 differentiators

Most submissions are "a dashboard + a chatbot." Liam reframes what the app *is*:

1. **🛡️ Proactive Agent (it watches your back).** The home feed surfaces specific, money-saving actions *before* you ask — cash-flow crunches, a credit card quietly costing you $627/yr, idle cash, missed autopay. *"Other apps wait for you to ask. Ours notices first."*
2. **⏳ Financial Time Machine.** Scrub your net worth decades into the future and meet your future self, with AI narration and milestone flags (🏁 $100K · 🚀 $500K · 🏆 $1M). *"See the millionaire — or the regret — you're building today."*
3. **⚡ Live What-If Simulator.** Drag sliders (lose your job, have a baby, invest more, pay off the card) and the **entire app recalculates in real time** — net worth, goals, health score, everything. *"Stress-test your life before it happens."*
4. **✅ Trust Layer.** Every AI recommendation has a "Why this?" expander showing the exact numbers it used and a confidence level. *"AI you can actually trust with your money — it shows the math."*
5. **🤖 Agentic chat.** Liam's answers stream in like a live assistant and end with tappable next steps that deep-link into the app with state pre-loaded — the chatbot *drives* the product.

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

## Record your demo — tap-by-tap 45-second script

| Time | Do | Say |
|---|---|---|
| 0:00 | Open the app → welcome screen | "Meet Liam — an AI that guides your money, not just charts it." |
| 0:04 | Tap **Set up my profile**, breeze through the 4 steps (slide income to $9,000) | "No forms — four taps and the entire app rebuilds around *my* numbers." |
| 0:14 | Land on Home; point at **"Liam noticed for you"**; expand one **Why this?** | "He's already found issues I didn't ask about — and shows the math behind every claim." |
| 0:22 | Tap an alert's action button → What-If sheet opens pre-loaded → toggle **Pay off credit card** → confetti + score jump | "Every fix is one tap, simulated live. Watch the health score jump." |
| 0:30 | Go to **Goals** → drag the Time Machine to age 60; point at 🏆 $1M milestone | "This is the future I'm building — and a note from my future self." |
| 0:38 | Tap the bronze **FAB** → Liam greets you by name; tap a suggestion → answer streams in → tap the action chip under it | "The chat doesn't just answer — it drives the app. That's an agent, not a chatbot." |
| 0:45 | End on the dashboard | "Liam: the AI that watches your back." |

Lost? The **"?" button** replays the feature tour anytime.
