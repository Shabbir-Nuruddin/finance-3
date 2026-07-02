import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Liam: AI Wealth Planner",
    short_name: "Liam",
    description:
      "An AI financial planner that watches your back, projects your future, and lets you stress-test life before it happens.",
    start_url: "/",
    display: "standalone",
    background_color: "#FBF8F3",
    theme_color: "#FBF8F3",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
