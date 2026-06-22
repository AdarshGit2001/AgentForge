import { LandingNav } from "@/components/landing/nav";
import { HeroSection } from "@/components/landing/hero";
import { FeaturesSection } from "@/components/landing/features";
import { HowItWorksSection } from "@/components/landing/how-it-works";
import { AgentEconomySection } from "@/components/landing/agent-economy";
import { TechStackSection } from "@/components/landing/tech-stack";
import { CTASection } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <LandingNav />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <AgentEconomySection />
      <TechStackSection />
      <CTASection />
      <Footer />
    </main>
  );
}
