"use client";

// Import các Component con
import { Navbar } from "@/features/home/navbar";
import { HeroSection } from "@/features/home/hero-section";
import { MetricsSection } from "@/features/home/metrics-section";
import { FeaturesSection } from "@/features/home/features-section";
import { Footer } from "@/features/home/footer";
import { ScrollCore3D } from "@/features/home/scroll-core-3d";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDFDFD] font-mono selection:bg-orange-100 overflow-x-hidden relative">
      {/* 1. HIỆU ỨNG 3D SCROLL (Luôn chạy đè lên trên nền, dưới nội dung) */}
      <ScrollCore3D />

      {/* 2. NAVBAR */}
      <Navbar />

      <main className="flex-1">
        {/* 3. HERO SECTION */}
        <HeroSection />

        {/* 4. METRICS */}
        <MetricsSection />

        {/* 5. FEATURES */}
        <FeaturesSection />
      </main>

      {/* 6. FOOTER */}
      <Footer />
    </div>
  );
}
