"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  GoalIcon,
  BudgetIcon,
  InvestIcon,
  HealthIcon,
} from "./icons";

const TABS = [
  { href: "/", label: "Home", Icon: HomeIcon },
  { href: "/goals", label: "Goals", Icon: GoalIcon },
  { href: "/budget", label: "Budget", Icon: BudgetIcon },
  { href: "/invest", label: "Invest", Icon: InvestIcon },
  { href: "/health", label: "Health", Icon: HealthIcon },
];

export default function BottomNav() {
  const path = usePathname();
  return (
    <nav className="absolute bottom-0 left-0 right-0 z-30 px-2 pb-[max(10px,env(safe-area-inset-bottom))] pt-2 bg-[rgba(251,248,243,0.9)] backdrop-blur-xl border-t border-[var(--border)]">
      <div className="flex items-stretch justify-between">
        {TABS.map(({ href, label, Icon }) => {
          const active = href === "/" ? path === "/" : path.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-1 flex-col items-center gap-1 py-1.5 no-tap"
            >
              <Icon
                width={23}
                height={23}
                style={{ color: active ? "var(--accent)" : "var(--text-dim)" }}
              />
              <span
                className="text-[10px] font-medium"
                style={{ color: active ? "var(--accent)" : "var(--text-dim)" }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
