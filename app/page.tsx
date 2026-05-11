"use client";

// Import các Component con
import { Navbar } from "@/features/home/components/navbar";
import { HeroSection } from "@/features/home/components/hero-section";
import { MetricsSection } from "@/features/home/components/metrics-section";
import { FeaturesSection } from "@/features/home/components/features-section";
import { WorkflowSection } from "@/features/home/components/workflow-section";
import { TestimonialsSection } from "@/features/home/components/testimonials-section";
import { FAQSection } from "@/features/home/components/faq-section";
import { CTASection } from "@/features/home/components/cta-section";
import { Footer } from "@/features/home/components/footer";
import { BackgroundBeams } from "@/features/home/components/background-beams";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans selection:bg-orange-500/10 overflow-x-hidden relative">
      {/* 1. HIỆU ỨNG NỀN PREMIUM */}
      <BackgroundBeams />

      {/* 2. NAVBAR */}
      <Navbar />

      <main className="flex-1">
        {/* 3. HERO SECTION */}
        <HeroSection />

        {/* 4. METRICS */}
        <MetricsSection />

        {/* 5. WORKFLOW */}
        <WorkflowSection />

        {/* 6. FEATURES */}
        <FeaturesSection />

        {/* 7. TESTIMONIALS*/}
        <TestimonialsSection />

        {/* 8. FAQ */}
        <FAQSection />

        {/* 9. CTA */}
        <CTASection />
      </main>

      {/* 10. FOOTER */}
      <Footer />
    </div>
  );
}
