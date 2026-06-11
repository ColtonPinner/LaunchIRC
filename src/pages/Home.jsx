import React from "react";
import HeroSection from "@/components/home/HeroSection";
import HowItWorks from "@/components/home/HowItWorks";
import GuidePreview from "@/components/home/GuidePreview";
import PricingSection from "@/components/home/PricingSection";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <HowItWorks />
      <GuidePreview />
      <PricingSection />
    </div>
  );
}