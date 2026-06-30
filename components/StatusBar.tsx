"use client";

import { useEffect, useState } from "react";

export default function StatusBar() {
  const [time, setTime] = useState("9:41");
  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).replace(/\s?[AP]M/, "");
    setTime(fmt());
    const t = setInterval(() => setTime(fmt()), 10000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative z-20 flex items-center justify-between px-7 pt-3 pb-1 text-[14px] font-semibold text-[var(--text)] no-tap select-none">
      <span>{time}</span>
      <div className="flex items-center gap-1.5">
        {/* signal */}
        <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor">
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5" width="3" height="7" rx="1" />
          <rect x="10" y="2.5" width="3" height="9.5" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        {/* wifi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
          <path d="M8 11.2 9.4 9.6a2 2 0 0 0-2.8 0L8 11.2Z" />
          <path d="M8 7.2c1.4 0 2.7.5 3.7 1.4l1.3-1.5A8 8 0 0 0 8 4.6 8 8 0 0 0 3 7.1l1.3 1.5A5.5 5.5 0 0 1 8 7.2Z" />
          <path d="M8 1.2A11.6 11.6 0 0 0 .3 4.1L1.6 5.6A9.5 9.5 0 0 1 8 3.2c2.4 0 4.7.9 6.4 2.4l1.3-1.5A11.6 11.6 0 0 0 8 1.2Z" />
        </svg>
        {/* battery */}
        <svg width="26" height="13" viewBox="0 0 26 13" fill="none">
          <rect x="0.5" y="0.5" width="21" height="12" rx="3.5" stroke="currentColor" opacity="0.4" />
          <rect x="2" y="2" width="16" height="9" rx="2" fill="currentColor" />
          <rect x="23" y="4" width="2" height="5" rx="1" fill="currentColor" opacity="0.4" />
        </svg>
      </div>
    </div>
  );
}
