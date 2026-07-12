import { TrustStrip } from "./TrustStrip";
import { MachineSpotlight } from "./MachineSpotlight";
import { FeaturedStays } from "./FeaturedStays";
import { HowItWorks } from "./HowItWorks";
import { WhyBento } from "./WhyBento";
import { FaqTeaser } from "./FaqTeaser";
import { FinalCta } from "./FinalCta";

/** Everything below the hero. */
export function HomeSections() {
  return (
    <>
      <TrustStrip />
      <MachineSpotlight />
      <FeaturedStays />
      <HowItWorks />
      <WhyBento />
      <FaqTeaser />
      <FinalCta />
    </>
  );
}
