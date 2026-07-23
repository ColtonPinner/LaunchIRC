import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, X, Crown, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Free Checklist",
    price: "$0",
    description: "Get started with the essentials",
    icon: Sparkles,
    cta: "Get Free Checklist",
    ctaLink: "/survey",
    highlighted: false,
    features: [
      { label: "Personalized business checklist", included: true },
      { label: "Basic step-by-step guide", included: true },
      { label: "General resource links", included: true },
      { label: "Progress tracking", included: true },
      { label: "Detailed how-to instructions", included: false },
      { label: "Downloadable document templates", included: false },
      { label: "IRC-specific contact information", included: false },
      { label: "Priority email support", included: false },
    ],
  },
  {
    name: "Premium Checklist",
    price: "$50",
    period: "one-time",
    description: "Everything you need for DIY success",
    icon: Crown,
    cta: "Get Premium Access",
    ctaLink: "/survey?plan=premium",
    highlighted: true,
    features: [
      { label: "Personalized business checklist", included: true },
      { label: "Detailed step-by-step instructions", included: true },
      { label: "Downloadable templates & forms", included: true },
      { label: "Progress tracking", included: true },
      { label: "IRC department contacts & direct links", included: true },
      { label: "Timeline estimates per step", included: true },
      { label: "Cost breakdown estimates", included: true },
      { label: "Email support for questions", included: true },
    ],
  },
];

export default function PricingSection() {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            Choose Your Path
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Start free or go premium for the complete DIY toolkit
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl border p-8 ${
                plan.highlighted
                  ? "bg-primary text-primary-foreground border-primary shadow-2xl shadow-primary/20 scale-[1.02]"
                  : "bg-card"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white text-xs font-bold px-4 py-1 rounded-full">
                  MOST POPULAR
                </div>
              )}

              <div className="mb-6">
                <plan.icon className={`w-8 h-8 mb-4 ${plan.highlighted ? "text-accent" : "text-accent"}`} />
                <h3 className="font-heading text-2xl font-bold mb-1">{plan.name}</h3>
                <p className={`text-sm ${plan.highlighted ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  {plan.description}
                </p>
              </div>

              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && (
                  <span className={`text-sm ${plan.highlighted ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                    /{plan.period}
                  </span>
                )}
              </div>

              <div className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <div key={feature.label} className="flex items-start gap-3">
                    {feature.included ? (
                      <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.highlighted ? "text-accent" : "text-accent"}`} />
                    ) : (
                      <X className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.highlighted ? "text-primary-foreground/30" : "text-muted-foreground/40"}`} />
                    )}
                    <span className={`text-sm ${
                      !feature.included
                        ? plan.highlighted ? "text-primary-foreground/40" : "text-muted-foreground/50"
                        : ""
                    }`}>
                      {feature.label}
                    </span>
                  </div>
                ))}
              </div>

              <Link to={plan.ctaLink}>
                <Button
                  className={`w-full font-semibold ${
                    plan.highlighted
                      ? "bg-accent hover:bg-accent/90 text-white"
                      : ""
                  }`}
                  variant={plan.highlighted ? "default" : "outline"}
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Concierge Upsell */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center bg-muted/50 rounded-2xl p-8 border border-dashed"
        >
          <h3 className="font-heading text-xl font-semibold mb-2">Need hands-on help?</h3>
          <p className="text-muted-foreground mb-4">
            Our concierge service handles the legwork for you — permits, paperwork, and coordination.
          </p>
          <Link to="/concierge">
            <Button variant="outline" className="font-semibold gap-2">
              <Crown className="w-4 h-4" />
              Explore Concierge Services
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}