import type { Metadata } from "next";
import { HeroB } from "@/components/home/HeroB";
import { HomeSections } from "@/components/home/HomeSections";
import { DirectionSwitcher } from "@/components/home/DirectionSwitcher";

// Direction B — "Editorial Seam": alternative hero for the design comparison.
// Temporary route; removed once a direction is chosen (Phase 8).
export const metadata: Metadata = {
  title: "Design B — Éditorial",
  robots: { index: false, follow: false },
  alternates: { canonical: "/direction-b" },
};

export default function DirectionB() {
  return (
    <main id="main">
      <HeroB />
      <HomeSections />
      <DirectionSwitcher active="b" />
    </main>
  );
}
