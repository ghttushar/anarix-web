import { Hero } from "../components/Hero";
import { ChannelsMarquee } from "../components/ChannelsMarquee";
import { StatsGrid } from "../components/StatsGrid";
import { CapabilitiesGrid } from "../components/CapabilitiesGrid";
import { Testimonials } from "../components/Testimonials";
import { BottomCTA } from "../components/BottomCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <ChannelsMarquee />
      <StatsGrid />
      <CapabilitiesGrid />
      <Testimonials />
      <BottomCTA />
    </>
  );
}
