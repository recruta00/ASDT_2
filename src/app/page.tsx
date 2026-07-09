import { site } from "@/config/site";

// Placeholder home — replaced by the dual-world Seam hero in Phase 4.
export default function Home() {
  return (
    <main
      id="main"
      className="relative texture-noise glow-ember flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-32 text-center"
    >
      <p className="font-spec text-ember">Location moto &amp; villas — {site.city}</p>
      <h1 className="font-display mt-6 text-[clamp(2.8rem,7vw,6rem)] font-bold">
        {site.name}
      </h1>
      <p className="mt-4 max-w-md text-mist">{site.tagline}</p>
    </main>
  );
}
