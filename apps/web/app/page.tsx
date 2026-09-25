import LandingContainer from "@/components/landing/landing-container";
import LandingNav from "@/components/landing/landing-nav";
import LandingHero from "@/components/landing/landing-hero";
import LandingProblem from "@/components/landing/landing-problem";
import LandingWorkflows from "@/components/landing/landing-workflows";
import LandingOpenSource from "@/components/landing/landing-open-source";
import LandingFaq from "@/components/landing/landing-faq";
import LandingFinalCta from "@/components/landing/landing-final-cta";
import LandingFooter from "@/components/landing/landing-footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--beacon-bg)] text-[var(--beacon-text)]">
      <LandingContainer>
        <LandingNav />
        <LandingHero />
      </LandingContainer>

      <LandingProblem />
      <LandingWorkflows />
      <LandingOpenSource />
      <LandingFaq />
      <LandingFinalCta />
      <LandingFooter />
    </main>
  );
}