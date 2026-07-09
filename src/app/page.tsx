import { HeroA } from "@/components/home/HeroA";
import { HomeSections } from "@/components/home/HomeSections";
import { DirectionSwitcher } from "@/components/home/DirectionSwitcher";

// Direction A — "Showroom Nocturne": the spec-literal dual-world Seam split.
export default function Home() {
  return (
    <main id="main">
      <HeroA />
      <HomeSections />
      <DirectionSwitcher active="a" />
    </main>
  );
}
