export type ExpenseCategory = {
  name: string;
  amount: number; // monthly
  budget: number; // monthly budget
  icon: string;
};

export type Account = {
  name: string;
  type: "checking" | "savings" | "brokerage" | "retirement" | "crypto";
  balance: number;
};

export type Debt = {
  name: string;
  balance: number;
  apr: number; // annual %
  minPayment: number; // monthly
  icon: string;
};

export type Goal = {
  id: string;
  name: string;
  icon: string;
  target: number;
  current: number;
  monthly: number; // current monthly contribution
  targetYears: number; // desired horizon
  priority: "high" | "medium" | "low";
};

export type Holding = {
  ticker: string;
  name: string;
  value: number;
  weight: number; // %
  ret1y: number; // % return last year
  kind: "stock" | "etf" | "bond" | "crypto" | "cash";
};

export type Bill = {
  name: string;
  amount: number;
  dueInDays: number;
  icon: string;
  autopay: boolean;
};

export type Profile = {
  name: string;
  age: number;
  monthlyIncome: number; // net take-home
  expenses: ExpenseCategory[];
  accounts: Account[];
  debts: Debt[];
  goals: Goal[];
  holdings: Holding[];
  bills: Bill[];
  monthlyInvestContribution: number;
  monthlySavingsContribution: number;
};

export type LifeEvent = "none" | "baby" | "newCar" | "jobLoss" | "raise";

export type Scenario = {
  extraInvest: number; // +/- monthly to investing
  incomeChangePct: number; // -50..+50
  spendingChangePct: number; // -30..+50
  payoffCreditCard: boolean;
  lifeEvent: LifeEvent;
  retireAge: number; // for retirement projection
};

export const DEFAULT_SCENARIO: Scenario = {
  extraInvest: 0,
  incomeChangePct: 0,
  spendingChangePct: 0,
  payoffCreditCard: false,
  lifeEvent: "none",
  retireAge: 65,
};
