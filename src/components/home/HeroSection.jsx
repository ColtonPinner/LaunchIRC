import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";

const highlights = [
  "Zoning & Property Guidance",
  "SBA Loans & Incentives",
  "Licenses & Permits",
  "Tax & Compliance",
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-6 tracking-wide uppercase">
              <MapPinIcon />
              Indian River County, Florida
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] mb-6">
              Start Your Business{" "}
              <span className="text-accent">the Right Way</span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
              From finding the perfect property to opening your doors — your personalized, 
              step-by-step roadmap for launching a business in Indian River County.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-10">
              {highlights.map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-foreground/80">
                  <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/survey">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-white font-semibold gap-2 w-full sm:w-auto text-base px-8">
                  <Sparkles className="w-5 h-5" />
                  Get Your Free Checklist
                </Button>
              </Link>
              <Link to="/guides">
                <Button size="lg" variant="outline" className="font-semibold gap-2 w-full sm:w-auto text-base px-8">
                  Browse Guides
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="relative">
              <div className="bg-card rounded-2xl border shadow-2xl shadow-primary/5 p-8">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Your Personalized Checklist</div>
                <div className="space-y-3">
                  {[
                    { label: "Choose Business Structure", done: true },
                    { label: "Register with FL Division of Corporations", done: true },
                    { label: "Apply for EIN (Federal Tax ID)", done: true },
                    { label: "Verify Property Zoning — Commercial C-1", done: false, active: true },
                    { label: "Apply for Local Business Tax Receipt", done: false },
                    { label: "Submit Building Permit Application", done: false },
                    { label: "Schedule Fire Marshal Inspection", done: false },
                    { label: "Open Business Bank Account", done: false },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        item.active
                          ? "bg-accent/10 border border-accent/20"
                          : item.done
                          ? "bg-muted/50"
                          : "bg-background"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        item.done
                          ? "bg-accent border-accent"
                          : item.active
                          ? "border-accent"
                          : "border-border"
                      }`}>
                        {item.done && <CheckCircle2 className="w-3 h-3 text-white" />}
                      </div>
                      <span className={`text-sm ${item.done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">3 of 8 complete</span>
                  <div className="w-32 h-2 rounded-full bg-muted overflow-hidden">
                    <div className="w-[37%] h-full bg-accent rounded-full" />
                  </div>
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 bg-accent text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                FREE
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function MapPinIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z" />
    </svg>
  );
}