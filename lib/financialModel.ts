import {
  Profile,
  Scenario,
  DEFAULT_SCENARIO,
  Goal,
  LifeEvent,
} from "./types";

/* ------------------------------------------------------------------ */
/*  Seeded profile — realistic, internally consistent.                 */
/*  Net worth = assets (89,800) - liabilities (26,450) = 63,350.       */
/* ------------------------------------------------------------------ */

export const PROFILE: Profile = {
  name: "Alex Morgan",
  age: 29,
  monthlyIncome: 7200,
  monthlyInvestContribution: 900,
  monthlySavingsContribution: 500,
  expenses: [
    { name: "Housing", amount: 2100, budget: 2100, icon: "🏠" },
    { name: "Groceries", amount: 720, budget: 650, icon: "🛒" },
    { name: "Transport", amount: 430, budget: 450, icon: "🚗" },
    { name: "Dining out", amount: 360, budget: 250, icon: "🍽️" },
    { name: "Shopping", amount: 520, budget: 350, icon: "🛍️" },
    { name: "Subscriptions", amount: 190, budget: 120, icon: "📺" },
    { name: "Utilities", amount: 250, budget: 250, icon: "💡" },
    { name: "Health", amount: 170, budget: 200, icon: "💊" },
    { name: "Personal", amount: 310, budget: 300, icon: "✨" },
    { name: "Other", amount: 350, budget: 300, icon: "📦" },
  ],
  accounts: [
    { name: "Everyday Checking", type: "checking", balance: 4800 },
    { name: "Emergency Savings", type: "savings", balance: 11500 },
    { name: "Brokerage", type: "brokerage", balance: 28400 },
    { name: "401(k)", type: "retirement", balance: 41200 },
    { name: "Crypto Wallet", type: "crypto", balance: 3900 },
  ],
  debts: [
    { name: "Credit Card", balance: 2850, apr: 22.0, minPayment: 95, icon: "💳" },
    { name: "Student Loan", balance: 14200, apr: 4.5, minPayment: 150, icon: "🎓" },
    { name: "Auto Loan", balance: 9400, apr: 6.0, minPayment: 310, icon: "🚙" },
  ],
  goals: [
    {
      id: "emergency",
      name: "Emergency Fund",
      icon: "🛟",
      target: 32400,
      current: 11500,
      monthly: 500,
      targetYears: 2,
      priority: "high",
    },
    {
      id: "home",
      name: "Home Down Payment",
      icon: "🏡",
      target: 60000,
      current: 18000,
      monthly: 600,
      targetYears: 4,
      priority: "high",
    },
    {
      id: "travel",
      name: "Japan Trip",
      icon: "✈️",
      target: 6000,
      current: 2300,
      monthly: 250,
      targetYears: 1,
      priority: "medium",
    },
    {
      id: "education",
      name: "Master's Degree",
      icon: "🎓",
      target: 15000,
      current: 4200,
      monthly: 200,
      targetYears: 3,
      priority: "medium",
    },
    {
      id: "retirement",
      name: "Retirement Freedom",
      icon: "🌴",
      target: 1500000,
      current: 41200,
      monthly: 900,
      targetYears: 36,
      priority: "high",
    },
  ],
  holdings: [
    { ticker: "VTI", name: "Total US Market", value: 24990, weight: 34, ret1y: 14.2, kind: "etf" },
    { ticker: "VXUS", name: "Intl Markets", value: 10290, weight: 14, ret1y: 9.1, kind: "etf" },
    { ticker: "QQQ", name: "Nasdaq 100", value: 5880, weight: 8, ret1y: 26.3, kind: "etf" },
    { ticker: "BND", name: "Total Bond", value: 7350, weight: 10, ret1y: 3.4, kind: "bond" },
    { ticker: "AAPL", name: "Apple", value: 5145, weight: 7, ret1y: 21.5, kind: "stock" },
    { ticker: "NVDA", name: "NVIDIA", value: 4410, weight: 6, ret1y: 48.7, kind: "stock" },
    { ticker: "BTC", name: "Bitcoin", value: 4410, weight: 6, ret1y: 62.0, kind: "crypto" },
    { ticker: "GLD", name: "Gold Trust", value: 3675, weight: 5, ret1y: 27.8, kind: "commodity" },
    { ticker: "VNQ", name: "Real Estate", value: 3675, weight: 5, ret1y: 11.4, kind: "reit" },
    { ticker: "CASH", name: "Settlement Cash", value: 3675, weight: 5, ret1y: 4.8, kind: "cash" },
  ],
  bills: [
    { name: "Rent", amount: 2100, dueInDays: 3, icon: "🏠", autopay: false },
    { name: "Credit Card", amount: 95, dueInDays: 6, icon: "💳", autopay: false },
    { name: "Electric", amount: 130, dueInDays: 9, icon: "💡", autopay: true },
    { name: "Auto Loan", amount: 310, dueInDays: 12, icon: "🚙", autopay: true },
    { name: "Phone", amount: 65, dueInDays: 15, icon: "📱", autopay: true },
    { name: "Streaming", amount: 48, dueInDays: 18, icon: "📺", autopay: true },
  ],
};

/* ------------------------------------------------------------------ */
/*  Core derivations (pure functions)                                  */
/* ------------------------------------------------------------------ */

export const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

export function totalAssets(p: Profile) {
  return sum(p.accounts.map((a) => a.balance));
}

export function totalLiabilities(p: Profile) {
  return sum(p.debts.map((d) => d.balance));
}

export function netWorth(p: Profile) {
  return totalAssets(p) - totalLiabilities(p);
}

export function monthlySpending(p: Profile) {
  return sum(p.expenses.map((e) => e.amount));
}

export function monthlyBudget(p: Profile) {
  return sum(p.expenses.map((e) => e.budget));
}

export function monthlyDebtPayments(p: Profile) {
  return sum(p.debts.map((d) => d.minPayment));
}

export function freeCashFlow(p: Profile) {
  return p.monthlyIncome - monthlySpending(p);
}

export function savingsRate(p: Profile) {
  return freeCashFlow(p) / p.monthlyIncome;
}

export function emergencyMonths(p: Profile) {
  const ef = p.accounts.find((a) => a.type === "savings")?.balance ?? 0;
  return ef / monthlySpending(p);
}

export function investableAssets(p: Profile) {
  return sum(
    p.accounts
      .filter((a) => a.type === "brokerage" || a.type === "retirement" || a.type === "crypto")
      .map((a) => a.balance),
  );
}

export function creditUtilization(p: Profile) {
  const cc = p.debts.find((d) => d.name === "Credit Card");
  if (!cc) return 0;
  const LIMIT = 6000;
  return cc.balance / LIMIT;
}

/* ------------------------------------------------------------------ */
/*  Financial health score — weighted composite (0-100)               */
/* ------------------------------------------------------------------ */

export type HealthBreakdown = {
  key: string;
  label: string;
  score: number; // 0-100
  weight: number; // 0-1
  detail: string;
};

const clamp = (n: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, n));

export function healthBreakdown(p: Profile): HealthBreakdown[] {
  const months = emergencyMonths(p);
  const rate = savingsRate(p);
  const dti = monthlyDebtPayments(p) / p.monthlyIncome;
  const util = creditUtilization(p);
  const equityWeight =
    sum(p.holdings.filter((h) => h.kind !== "cash").map((h) => h.weight)) / 100;

  return [
    {
      key: "emergency",
      label: "Emergency Cushion",
      score: clamp((months / 6) * 100),
      weight: 0.25,
      detail: `${months.toFixed(1)} of 6 months covered`,
    },
    {
      key: "savings",
      label: "Savings Rate",
      score: clamp((rate / 0.2) * 100),
      weight: 0.25,
      detail: `${(rate * 100).toFixed(0)}% of income saved`,
    },
    {
      key: "debt",
      label: "Debt Load",
      score: clamp((1 - dti / 0.36) * 100),
      weight: 0.2,
      detail: `${(dti * 100).toFixed(0)}% of income to debt`,
    },
    {
      key: "credit",
      label: "Credit Utilization",
      score: clamp((1 - util / 0.6) * 100),
      weight: 0.15,
      detail: `${(util * 100).toFixed(0)}% of limit used`,
    },
    {
      key: "diversification",
      label: "Diversification",
      score: clamp(equityWeight > 0.4 && equityWeight < 0.95 ? 84 : 60),
      weight: 0.15,
      detail: `${(equityWeight * 100).toFixed(0)}% in growth assets`,
    },
  ];
}

export function healthScore(p: Profile): number {
  const b = healthBreakdown(p);
  return Math.round(sum(b.map((x) => x.score * x.weight)));
}

export function healthGrade(score: number): { label: string; color: string } {
  if (score >= 80) return { label: "Excellent", color: "var(--pos)" };
  if (score >= 65) return { label: "Good", color: "var(--pos)" };
  if (score >= 50) return { label: "Fair", color: "var(--warn)" };
  return { label: "Needs Work", color: "var(--danger)" };
}

/* ------------------------------------------------------------------ */
/*  Projection — net worth over time (Time Machine #2)                 */
/* ------------------------------------------------------------------ */

export type ProjectionPoint = { year: number; age: number; netWorth: number };

const INVEST_RETURN = 0.07; // annual
const SAVINGS_RETURN = 0.02;

export function projectNetWorth(p: Profile, years: number): ProjectionPoint[] {
  let invest = investableAssets(p);
  let cash =
    (p.accounts.find((a) => a.type === "checking")?.balance ?? 0) +
    (p.accounts.find((a) => a.type === "savings")?.balance ?? 0);
  const debts = p.debts.map((d) => ({ ...d }));

  const points: ProjectionPoint[] = [
    { year: 0, age: p.age, netWorth: netWorth(p) },
  ];

  for (let y = 1; y <= years; y++) {
    for (let m = 0; m < 12; m++) {
      invest = invest * (1 + INVEST_RETURN / 12) + p.monthlyInvestContribution;
      cash = cash * (1 + SAVINGS_RETURN / 12) + p.monthlySavingsContribution;
      // pay down debts with their min payments
      for (const d of debts) {
        if (d.balance <= 0) continue;
        const interest = (d.balance * (d.apr / 100)) / 12;
        d.balance = Math.max(0, d.balance + interest - d.minPayment);
      }
    }
    const liabilities = sum(debts.map((d) => d.balance));
    points.push({
      year: y,
      age: p.age + y,
      netWorth: Math.round(invest + cash - liabilities),
    });
  }
  return points;
}

/* ------------------------------------------------------------------ */
/*  Scenario engine — What-If (#3). Returns a *new* derived profile.   */
/* ------------------------------------------------------------------ */

const LIFE_EVENTS: Record<
  LifeEvent,
  { label: string; icon: string; incomePct: number; spendDelta: number; note: string }
> = {
  none: { label: "Normal life", icon: "🙂", incomePct: 0, spendDelta: 0, note: "Baseline plan." },
  baby: {
    label: "New baby",
    icon: "👶",
    incomePct: 0,
    spendDelta: 1100,
    note: "+$1,100/mo childcare & essentials.",
  },
  newCar: {
    label: "New car",
    icon: "🚗",
    incomePct: 0,
    spendDelta: 480,
    note: "+$480/mo loan & insurance.",
  },
  jobLoss: {
    label: "Job loss (6mo)",
    icon: "📉",
    incomePct: -45,
    spendDelta: -300,
    note: "Income cut, living lean on savings.",
  },
  raise: {
    label: "Big raise",
    icon: "🚀",
    incomePct: 22,
    spendDelta: 250,
    note: "+22% income, modest lifestyle creep.",
  },
};

export function lifeEventInfo(e: LifeEvent) {
  return LIFE_EVENTS[e];
}

export function applyScenario(base: Profile, s: Scenario): Profile {
  const ev = LIFE_EVENTS[s.lifeEvent];
  const incomePct = s.incomeChangePct + ev.incomePct;
  const newIncome = Math.max(0, base.monthlyIncome * (1 + incomePct / 100));

  // expenses scale by spending change %, then add the life-event flat delta
  const spendFactor = 1 + s.spendingChangePct / 100;
  const expenses = base.expenses.map((e) => ({
    ...e,
    amount: Math.max(0, Math.round(e.amount * spendFactor)),
  }));
  if (ev.spendDelta !== 0 && expenses.length) {
    expenses[expenses.length - 1] = {
      ...expenses[expenses.length - 1],
      amount: Math.max(0, expenses[expenses.length - 1].amount + ev.spendDelta),
    };
  }

  let accounts = base.accounts.map((a) => ({ ...a }));
  let debts = base.debts.map((d) => ({ ...d }));

  // pay off credit card from checking/savings
  if (s.payoffCreditCard) {
    const cc = debts.find((d) => d.name === "Credit Card");
    if (cc && cc.balance > 0) {
      let owed = cc.balance;
      const savings = accounts.find((a) => a.type === "savings");
      const checking = accounts.find((a) => a.type === "checking");
      if (savings) {
        const take = Math.min(savings.balance, owed);
        savings.balance -= take;
        owed -= take;
      }
      if (checking && owed > 0) {
        const take = Math.min(checking.balance, owed);
        checking.balance -= take;
        owed -= take;
      }
      debts = debts.filter((d) => d.name !== "Credit Card");
    }
  }

  const investContribution = Math.max(0, base.monthlyInvestContribution + s.extraInvest);

  return {
    ...base,
    monthlyIncome: Math.round(newIncome),
    expenses,
    accounts,
    debts,
    monthlyInvestContribution: investContribution,
  };
}

/* ------------------------------------------------------------------ */
/*  Goal projection — months/years to reach a goal                     */
/* ------------------------------------------------------------------ */

export function monthsToGoal(goal: Goal, monthlyOverride?: number): number {
  const monthly = monthlyOverride ?? goal.monthly;
  if (monthly <= 0) return Infinity;
  const remaining = goal.target - goal.current;
  if (remaining <= 0) return 0;
  // retirement compounds; others treated as steady contribution
  if (goal.id === "retirement") {
    let bal = goal.current;
    let months = 0;
    while (bal < goal.target && months < 1200) {
      bal = bal * (1 + INVEST_RETURN / 12) + monthly;
      months++;
    }
    return months;
  }
  return Math.ceil(remaining / monthly);
}

export function goalProgress(goal: Goal): number {
  return clamp((goal.current / goal.target) * 100);
}

export { DEFAULT_SCENARIO };
