import LandingContainer from "@/components/landing/landing-container";
import LandingNav from "@/components/landing/landing-nav";
import LandingHero from "@/components/landing/landing-hero";
import LandingFinalCta from "@/components/landing/landing-final-cta";
import LandingFooter from "@/components/landing/landing-footer";

export default function HomePage() {
  return (
    <main className="min-h-screen w-full overflow-x-clip bg-[#050B12] text-zinc-100">
      <LandingContainer>
        <LandingNav />
        <LandingHero />
      </LandingContainer>

      <LandingFinalCta />
      <LandingFooter />
    </main>
  );
}