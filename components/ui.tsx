"use client";

import { ReactNode } from "react";

export function Card({
  children,
  className = "",
  onClick,
  glass = false,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  glass?: boolean;
}) {
  return (
    <div
      onClick={onClick}
      className={`${glass ? "glass" : "card"} p-4 ${onClick ? "cursor-pointer active:scale-[0.99] transition" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionTitle({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mt-6 mb-3 px-1">
      <h2 className="text-[15px] font-semibold tracking-tight text-[var(--text)]">
        {title}
      </h2>
      {action}
    </div>
  );
}

export function Pill({
  children,
  tone = "muted",
}: {
  children: ReactNode;
  tone?: "accent" | "ai" | "warn" | "danger" | "muted" | "info";
}) {
  const map: Record<string, string> = {
    accent: "bg-[var(--accent-soft)] text-[var(--accent)]",
    ai: "bg-[var(--ai-soft)] text-[var(--ai)]",
    warn: "bg-[var(--warn-soft)] text-[var(--warn)]",
    danger: "bg-[var(--danger-soft)] text-[var(--danger)]",
    info: "bg-[var(--info-soft)] text-[var(--info)]",
    muted: "bg-[var(--surface-2)] text-[var(--text-muted)]",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${map[tone]}`}
    >
      {children}
    </span>
  );
}

export function ProgressBar({
  value,
  tone = "accent",
}: {
  value: number; // 0-100
  tone?: "accent" | "ai" | "warn" | "danger";
}) {
  const colors: Record<string, string> = {
    accent: "var(--accent)",
    ai: "var(--ai)",
    warn: "var(--warn)",
    danger: "var(--danger)",
  };
  return (
    <div className="h-2 w-full rounded-full bg-[var(--surface-2)] overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{
          width: `${Math.max(0, Math.min(100, value))}%`,
          background: colors[tone],
        }}
      />
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="px-5 pt-2 pb-1">
      <h1 className="text-[26px] font-bold tracking-tight leading-tight">{title}</h1>
      {subtitle && (
        <p className="text-[13px] text-[var(--text-muted)] mt-0.5">{subtitle}</p>
      )}
    </div>
  );
}
