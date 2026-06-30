"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SparkleIcon } from "./icons";

export default function AIFab() {
  const path = usePathname();
  if (path.startsWith("/planner")) return null;
  return (
    <Link
      href="/planner"
      aria-label="Open AI Planner"
      className="absolute right-4 bottom-[84px] z-40 no-tap"
    >
      <div className="pulse-ring flex h-14 w-14 items-center justify-center rounded-full shadow-xl active:scale-95 transition"
        style={{
          background: "var(--brand-grad)",
        }}
      >
        <SparkleIcon width={26} height={26} style={{ color: "white" }} />
      </div>
    </Link>
  );
}
