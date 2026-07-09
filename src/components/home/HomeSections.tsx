import { TrustStrip } from "./TrustStrip";
import { FeaturedFleet } from "./FeaturedFleet";
import { FeaturedStays } from "./FeaturedStays";
import { HowItWorks } from "./HowItWorks";
import { WhyBento } from "./WhyBento";
import { FaqTeaser } from "./FaqTeaser";
import { FinalCta } from "./FinalCta";

/**
 * Everything below the hero — shared verbatim by both design directions so the
 * A/B comparison isolates the hero + look/feel, not the whole page.
 */
export function HomeSections() {
  return (
    <>
      <TrustStrip />
      <FeaturedFleet />
      <FeaturedStays />
      <HowItWorks />
      <WhyBento />
      <FaqTeaser />
      <FinalCta />
    </>
  );
}
