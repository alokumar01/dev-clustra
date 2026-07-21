import Header from "@/components/pages/Header";
import Hero from "@/components/pages/Hero";
import WhyDevClustra from "@/components/pages/WhyDevClustra";
import Features from "@/components/pages/Features";
import Architecture from "@/components/pages/Architecture";
import Journey from "@/components/pages/Journey";
import TechStack from "@/components/pages/TechStack";
import Highlights from "@/components/pages/Highlights";
import Footer from "@/components/pages/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />
      <Hero />
      <WhyDevClustra />
      <Features />
      <Architecture />
      <Journey />
      <TechStack />
      <Highlights />
      <Footer />
    </main>
  );
}
