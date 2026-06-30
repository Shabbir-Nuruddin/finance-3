export function money(n: number, opts?: { compact?: boolean; sign?: boolean }): string {
  const sign = opts?.sign && n > 0 ? "+" : "";
  if (opts?.compact && Math.abs(n) >= 1000) {
    const f = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    });
    return sign + f.format(n);
  }
  return (
    sign +
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n)
  );
}

export function pct(n: number, digits = 0): string {
  return `${(n * 100).toFixed(digits)}%`;
}

export function monthsToText(months: number): string {
  if (!isFinite(months)) return "—";
  if (months <= 0) return "Reached 🎉";
  if (months < 12) return `${months} mo`;
  const y = Math.floor(months / 12);
  const m = months % 12;
  return m ? `${y}y ${m}m` : `${y} yr`;
}
