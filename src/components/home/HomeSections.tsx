import { TrustStrip } from "./TrustStrip";
import { MachineSpotlight } from "./MachineSpotlight";
import { FeaturedStays } from "./FeaturedStays";
import { Testimonials } from "./Testimonials";
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
      <Testimonials />
      <HowItWorks />
      <WhyBento />
      <FaqTeaser />
      <FinalCta />
    </>
  );
}
