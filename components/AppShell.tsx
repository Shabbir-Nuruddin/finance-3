"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import StatusBar from "./StatusBar";
import BottomNav from "./BottomNav";
import AIFab from "./AIFab";
import WhatIfSheet from "./WhatIfSheet";
import { ScenarioBanner } from "./Simulate";

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
            <AIFab />
            <BottomNav />
            <WhatIfSheet />
          </>
        )}
      </div>
    </div>
  );
}
