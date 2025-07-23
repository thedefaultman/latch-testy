import { LandingNavBeta } from "@/components/LandingNavBeta";
import { LandingHeroBeta } from "@/components/LandingHeroBeta";
import { LandingSocialProofBeta } from "@/components/LandingSocialProofBeta";
import { LandingFeatures } from "@/components/LandingFeatures";
import { LandingHowItWorks } from "@/components/LandingHowItWorks";
import { LandingFooterBeta } from "@/components/LandingFooterBeta";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LandingWhyChooseUs } from "@/components/LandingWhyChooseUs";
import { LandingFAQBeta } from "@/components/LandingFAQBeta";
import { LandingFinalCTABeta } from "@/components/LandingFinalCTABeta";

export default function BetaPage() {
  return (
    <main className="min-h-screen bg-background text-foreground transition-colors">
      <LandingNavBeta />
      <div className="pt-12 sm:pt-16">
        <LandingHeroBeta />
      </div>
      <LandingSocialProofBeta />
      <div id="features" className="scroll-mt-24">
        <LandingFeatures />
      </div>
      <div id="how-it-works" className="scroll-mt-24">
        <LandingHowItWorks />
      </div>
      <div id="why-choose-us" className="scroll-mt-24">
        <LandingWhyChooseUs />
      </div>
      <div id="faq" className="scroll-mt-24">
        <LandingFAQBeta />
      </div>
      <LandingFinalCTABeta />
      <LandingFooterBeta />
      <ThemeToggle />
    </main>
  );
}