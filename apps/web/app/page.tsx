import LandingNav from "@/components/landing/landing-nav";
import LandingHero from "@/components/landing/landing-hero";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#070A0F] text-zinc-100">
      <LandingNav />
      <LandingHero />
    </main>
  );
}