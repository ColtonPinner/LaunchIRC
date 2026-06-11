import React from "react";
import HeroSection from "@/components/home/HeroSection";
import HowItWorks from "@/components/home/HowItWorks";
import PricingSection from "@/components/home/PricingSection";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <HowItWorks />
      <PricingSection />
    </div>
  );
}