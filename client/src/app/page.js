import Header from "@/components/pages/Header";
import Hero from "@/components/pages/Hero";
import HowItWorks from "@/components/pages/HowItWorks";
import Features from "@/components/pages/Features";
import EngineeringShowcase from "@/components/pages/EngineeringShowcase";
import Footer from "@/components/pages/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />
      <Hero />
      <HowItWorks />
      <Features />
      <EngineeringShowcase />
      <Footer />
    </main>
  );
}
