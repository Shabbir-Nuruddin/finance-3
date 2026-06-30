import { Profile } from "./types";
import {
  monthlySpending,
  emergencyMonths,
  savingsRate,
  creditUtilization,
  netWorth,
  freeCashFlow,
  sum,
} from "./financialModel";
import { money, pct } from "./format";

export type Trust = {
  basis: string[];
  confidence: "High" | "Medium" | "Low";
};

export type Insight = {
  id: string;
  severity: "urgent" | "opportunity" | "info" | "win";
  icon: string;
  title: string;
  body: string;
  action: string;
  impact?: string; // e.g. "Save $684/yr"
  trust: Trust;
};

/* ---- Proactive alerts (#1) — the app notices before you ask ---- */

export function proactiveAlerts(p: Profile): Insight[] {
  const out: Insight[] = [];
  const checking = p.accounts.find((a) => a.type === "checking")?.balance ?? 0;

  // 1. Cash-flow crunch from upcoming bills
  const next7 = p.bills.filter((b) => b.dueInDays <= 7);
  const due7 = sum(next7.map((b) => b.amount));
  if (due7 > 0) {
    const after = checking - due7;
    out.push({
      id: "cashflow",
      severity: after < 1500 ? "urgent" : "info",
      icon: "📅",
      title: `${money(due7)} in bills hit in the next 7 days`,
      body: `${next7.map((b) => b.name).join(", ")} are due. You'll have ${money(
        after,
      )} left in checking after they clear.`,
      action: after < 1500 ? "Move funds from savings" : "You're covered — no action needed",
      trust: {
        basis: [
          `Checking balance ${money(checking)}`,
          `${next7.length} bills due ≤7d totaling ${money(due7)}`,
        ],
        confidence: "High",
      },
    });
  }

  // 2. High-interest credit card
  const cc = p.debts.find((d) => d.name === "Credit Card");
  if (cc && cc.balance > 0) {
    const yearlyInterest = Math.round((cc.balance * cc.apr) / 100);
    out.push({
      id: "creditcard",
      severity: "urgent",
      icon: "💳",
      title: `Your credit card is costing you ${money(yearlyInterest)}/yr`,
      body: `${money(cc.balance)} at ${cc.apr}% APR is your most expensive debt. Clearing it is a guaranteed ${cc.apr}% return — better than any investment.`,
      action: "Pay it off from savings",
      impact: `Save ${money(yearlyInterest)}/yr`,
      trust: {
        basis: [`Balance ${money(cc.balance)}`, `APR ${cc.apr}%`, "Compared vs 7% market return"],
        confidence: "High",
      },
    });
  }

  // 3. Over-budget categories → savings opportunity
  const over = p.expenses.filter((e) => e.amount > e.budget);
  const overAmt = sum(over.map((e) => e.amount - e.budget));
  if (overAmt > 0) {
    out.push({
      id: "overspend",
      severity: "opportunity",
      icon: "🎯",
      title: `You're ${money(overAmt)}/mo over budget`,
      body: `${over
        .sort((a, b) => b.amount - b.budget - (a.amount - a.budget))
        .slice(0, 2)
        .map((e) => `${e.name} (+${money(e.amount - e.budget)})`)
        .join(" and ")} are the biggest overruns. Redirect this to your goals.`,
      action: "Trim spending",
      impact: `Free up ${money(overAmt * 12)}/yr`,
      trust: {
        basis: over.slice(0, 3).map((e) => `${e.name}: ${money(e.amount)} vs ${money(e.budget)} budget`),
        confidence: "High",
      },
    });
  }

  // 4. Autopay not enabled on key bills
  const manual = p.bills.filter((b) => !b.autopay);
  if (manual.length) {
    out.push({
      id: "autopay",
      severity: "info",
      icon: "🔔",
      title: `${manual.length} bills aren't on autopay`,
      body: `${manual.map((b) => b.name).join(", ")} need manual payment. A single late fee can be ${money(
        35,
      )}+ and dent your credit score.`,
      action: "Enable autopay",
      trust: {
        basis: manual.map((b) => `${b.name} — due in ${b.dueInDays}d, manual`),
        confidence: "Medium",
      },
    });
  }

  // 5. Idle cash drag
  if (checking > 4000) {
    const excess = checking - 3000;
    out.push({
      id: "idlecash",
      severity: "opportunity",
      icon: "💸",
      title: `${money(excess)} is sitting idle in checking`,
      body: `Anything above a ${money(
        3000,
      )} buffer could earn ~4.5% in a high-yield savings account instead of 0%.`,
      action: "Sweep to high-yield savings",
      impact: `~${money(Math.round((excess * 0.045)))}/yr`,
      trust: {
        basis: [`Checking ${money(checking)}`, "Buffer target $3,000", "HYSA ~4.5% APY"],
        confidence: "Medium",
      },
    });
  }

  // order: urgent → opportunity → info
  const rank: Record<Insight["severity"], number> = { urgent: 0, opportunity: 1, win: 2, info: 3 };
  return out.sort((a, b) => rank[a.severity] - rank[b.severity]);
}

/* ---- Action plan for Health Center ---- */

export type ActionStep = {
  title: string;
  detail: string;
  done: boolean;
  points: number; // health-score points it could add
};

export function actionPlan(p: Profile): ActionStep[] {
  const steps: ActionStep[] = [];
  const cc = p.debts.find((d) => d.name === "Credit Card");
  if (cc && cc.balance > 0)
    steps.push({
      title: "Pay off the credit card",
      detail: `Clear ${money(cc.balance)} at ${cc.apr}% APR — your highest-cost debt.`,
      done: false,
      points: 8,
    });

  const months = emergencyMonths(p);
  if (months < 6)
    steps.push({
      title: "Build emergency fund to 6 months",
      detail: `You have ${months.toFixed(1)} months. Auto-transfer ${money(
        500,
      )}/mo to close the gap.`,
      done: false,
      points: 12,
    });

  const util = creditUtilization(p);
  if (util > 0.3)
    steps.push({
      title: "Cut credit utilization below 30%",
      detail: `You're at ${pct(util)}. Lowering it lifts your credit score.`,
      done: false,
      points: 6,
    });

  steps.push({
    title: "Increase 401(k) contribution by 2%",
    detail: "Capture more compound growth and tax savings over time.",
    done: false,
    points: 5,
  });

  steps.push({
    title: "Review subscriptions quarterly",
    detail: "Cancel unused services to plug small recurring leaks.",
    done: true,
    points: 2,
  });

  return steps;
}

/* ---- Risk assessment ---- */

export function riskFlags(p: Profile) {
  return [
    {
      label: "Liquidity risk",
      level: emergencyMonths(p) < 3 ? "Elevated" : emergencyMonths(p) < 6 ? "Moderate" : "Low",
      note: `${emergencyMonths(p).toFixed(1)} months of expenses in cash`,
    },
    {
      label: "Debt risk",
      level: creditUtilization(p) > 0.5 ? "Elevated" : creditUtilization(p) > 0.3 ? "Moderate" : "Low",
      note: `Credit utilization ${pct(creditUtilization(p))}`,
    },
    {
      label: "Concentration risk",
      level:
        (p.holdings.find((h) => h.kind === "crypto")?.weight ?? 0) > 15 ? "Moderate" : "Low",
      note: "Crypto + single-stock exposure within range",
    },
    {
      label: "Income risk",
      level: "Moderate",
      note: "Single income source — diversify if possible",
    },
  ] as { label: string; level: "Low" | "Moderate" | "Elevated"; note: string }[];
}

/* ---- Deterministic AI fallback (so demo never breaks) ---- */

export function buildContextSummary(p: Profile): string {
  return [
    `Net worth ${money(netWorth(p))}.`,
    `Monthly income ${money(p.monthlyIncome)}, spending ${money(monthlySpending(p))}, savings rate ${pct(
      savingsRate(p),
    )}.`,
    `Emergency fund covers ${emergencyMonths(p).toFixed(1)} months.`,
    `Debts: ${p.debts.map((d) => `${d.name} ${money(d.balance)} @ ${d.apr}%`).join("; ")}.`,
    `Top goals: ${p.goals
      .filter((g) => g.priority === "high")
      .map((g) => g.name)
      .join(", ")}.`,
  ].join(" ");
}

export function localFallbackAnswer(question: string, p: Profile): string {
  const q = question.toLowerCase();
  const fcf = freeCashFlow(p);

  if (q.includes("debt") || q.includes("credit") || q.includes("loan")) {
    const cc = p.debts.find((d) => d.name === "Credit Card");
    return `Tackle debt highest-APR first (the "avalanche" method). Your credit card${
      cc ? ` (${money(cc.balance)} at ${cc.apr}%)` : ""
    } is the priority — that interest rate beats any likely investment return. After it's gone, roll that payment into your auto and student loans. With ${money(
      fcf,
    )}/mo of free cash flow, an extra ${money(300)}/mo could clear the card in under a year.`;
  }
  if (q.includes("save") || q.includes("emergency")) {
    return `Your emergency fund covers ${emergencyMonths(p).toFixed(
      1,
    )} months — aim for 6. Automating ${money(
      500,
    )}/mo into a high-yield savings account closes the gap steadily without you thinking about it. Treat it like a fixed bill that pays your future self first.`;
  }
  if (q.includes("invest") || q.includes("portfolio") || q.includes("retire")) {
    return `You're already investing ${money(
      p.monthlyInvestContribution,
    )}/mo, which is a strong habit. Your mix is well diversified across US, international, and bonds. For retirement, time in the market matters more than timing — at a 7% average return, steady contributions compound dramatically over decades. Open the Time Machine on the Goals tab to see your projected trajectory.`;
  }
  if (q.includes("house") || q.includes("home") || q.includes("buy")) {
    const home = p.goals.find((g) => g.id === "home");
    return `Your home down-payment goal is ${money(home?.current ?? 0)} of ${money(
      home?.target ?? 0,
    )}. At ${money(
      home?.monthly ?? 0,
    )}/mo you're on track, but bumping contributions or trimming over-budget categories (dining, shopping) would pull the date forward. Try the What-If simulator to see exactly how much sooner.`;
  }
  if (q.includes("budget") || q.includes("spend")) {
    const over = p.expenses.filter((e) => e.amount > e.budget);
    return `You're over budget in ${over.length} categories${
      over.length ? ` — biggest are ${over.slice(0, 2).map((e) => e.name).join(" and ")}` : ""
    }. Redirecting that overspend to your goals is the fastest win. Your free cash flow is ${money(
      fcf,
    )}/mo, so there's real room to optimize.`;
  }
  return `Here's the big picture: net worth ${money(
    netWorth(p),
  )}, saving ${pct(savingsRate(p))} of your income, with a healthy investing habit. Your two highest-leverage moves right now are (1) clearing the high-interest credit card and (2) topping up your emergency fund to 6 months. Ask me about debt, saving, investing, or buying a home for a tailored plan.`;
}
