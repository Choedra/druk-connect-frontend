import { CategorySection } from "@/src/features/landing-page/ui/CategorySection";
import { CtaSection } from "@/src/features/landing-page/ui/CtaSection";
import { Faq } from "@/src/features/landing-page/ui/Faq";
import { Hero } from "@/src/features/landing-page/ui/Hero";
import { HowItWorks } from "@/src/features/landing-page/ui/HowItWorks";
import { RecentListings } from "@/src/features/landing-page/ui/RecentListings";
import { TrustBand } from "@/src/features/landing-page/ui/TrustBand";

export default function Home() {
  return (
    <main id="main" className="bg-white font-landing text-ink">
      <Hero />
      <TrustBand />
      <RecentListings />
      <CategorySection />
      <HowItWorks />
      <CtaSection />
      <Faq />
    </main>
  );
}
