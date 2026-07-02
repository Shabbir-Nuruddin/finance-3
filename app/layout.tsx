import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const DESCRIPTION =
  "An AI financial planner that watches your back, projects your future, and lets you stress-test life before it happens.";

export const metadata: Metadata = {
  title: "Liam: AI Wealth Planner",
  description: DESCRIPTION,
  applicationName: "Liam",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Liam",
  },
  openGraph: {
    title: "Liam: AI Wealth Planner",
    description: DESCRIPTION,
    type: "website",
    siteName: "Liam",
  },
  twitter: {
    card: "summary",
    title: "Liam: AI Wealth Planner",
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#FBF8F3",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} antialiased`}>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
