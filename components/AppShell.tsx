"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import StatusBar from "./StatusBar";
import BottomNav from "./BottomNav";
import AIFab from "./AIFab";
import WhatIfSheet from "./WhatIfSheet";
import WelcomeGate from "./WelcomeGate";
import Onboarding from "./Onboarding";
import Tutorial from "./Tutorial";
import { ScenarioBanner } from "./Simulate";
import { useUI } from "@/lib/ui";

function HelpFab() {
  const openTutorial = useUI((s) => s.openTutorial);
  return (
    <button
      onClick={openTutorial}
      aria-label="Take the tour"
      className="absolute right-[18px] bottom-[150px] z-40 flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--surface)] text-[15px] font-bold text-[var(--text-muted)] shadow no-tap active:scale-95 transition"
    >
      ?
    </button>
  );
}

export default function AppShell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const fullscreen = path.startsWith("/planner"); // self-managed height, no nav

  return (
    <div className="studio">
      <div className="phone">
        <StatusBar />
        {!fullscreen && <ScenarioBanner />}

        {fullscreen ? (
          <div className="flex-1 min-h-0 flex flex-col">{children}</div>
        ) : (
          <>
            <div className="phone-scroll">
              {children}
              <div className="h-24" />
            </div>
            <HelpFab />
            <AIFab />
            <BottomNav />
            <WhatIfSheet />
          </>
        )}

        {/* First-run + tour overlays (top-level) */}
        <WelcomeGate />
        <Onboarding />
        <Tutorial />
      </div>
    </div>
  );
}
