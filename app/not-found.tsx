import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-full min-h-[70dvh] flex-col items-center justify-center px-8 text-center">
      <div
        className="flex h-16 w-16 items-center justify-center rounded-2xl text-[30px]"
        style={{ background: "var(--accent-soft)" }}
      >
        🧭
      </div>
      <h1 className="mt-5 text-[24px] font-bold tracking-tight">Off the map</h1>
      <p className="mt-2 text-[13px] leading-relaxed text-[var(--text-muted)]">
        This page doesn&apos;t exist, but your money is right where you left it.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-2xl brand-grad px-6 py-3 text-[14px] font-semibold text-white shadow"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
