import React from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Crown, Headphones, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Free plan",
    price: "$0",
    description: "The essential steps for getting your business moving.",
    icon: Sparkles,
    cta: "Start for free",
    ctaLink: "/survey",
    features: [
      "Personalized startup checklist",
      "Core step-by-step guidance",
      "Curated local resource links",
      "Progress tracking",
    ],
  },
  {
    name: "Premium plan",
    price: "$50",
    period: "one-time",
    description: "The complete DIY toolkit with deeper local detail.",
    icon: Crown,
    cta: "Choose premium",
    ctaLink: "/survey?plan=premium",
    highlighted: true,
    features: [
      "Everything in the free plan",
      "Detailed how-to instructions",
      "Downloadable templates and forms",
      "Local contacts, timelines, and cost estimates",
      "Email support for questions",
    ],
  },
];

export default function PricingSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="section-y bg-muted/40">
      <div className="page-container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Simple, transparent options</p>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight text-foreground sm:text-4xl">Start free. Go deeper when you need to.</h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Build your plan at no cost, then unlock the complete local toolkit with one payment.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-5 md:grid-cols-2">
          {plans.map((plan, index) => (
            <motion.article
              key={plan.name}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: reduceMotion ? 0 : index * 0.07 }}
              className={`relative flex flex-col rounded-3xl border bg-card p-7 shadow-soft sm:p-8 ${
                plan.highlighted ? "border-accent/50 ring-4 ring-accent/[0.07]" : "border-border/80"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute right-6 top-6 rounded-full bg-accent/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-accent">
                  Best value
                </span>
              )}

              <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${plan.highlighted ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"}`}>
                <plan.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-6 text-xl font-extrabold text-foreground">{plan.name}</h3>
              <p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">{plan.description}</p>

              <div className="mt-6 flex items-end gap-2 border-b border-border/70 pb-6">
                <span className="text-4xl font-extrabold tracking-[-0.04em] text-foreground">{plan.price}</span>
                {plan.period && <span className="pb-1 text-sm font-medium text-muted-foreground">{plan.period}</span>}
              </div>

              <ul className="my-7 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm leading-6 text-foreground/80">
                    <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/20 dark:text-emerald-400">
                      <Check className="h-3 w-3" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <Button asChild size="lg" variant={plan.highlighted ? "default" : "outline"} className={plan.highlighted ? "bg-accent text-accent-foreground hover:bg-accent/90" : ""}>
                <Link to={plan.ctaLink}>{plan.cta} <ArrowRight /></Link>
              </Button>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          className="mx-auto mt-6 flex max-w-4xl flex-col gap-5 rounded-2xl border border-border/75 bg-card px-6 py-6 shadow-soft sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Headphones className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-extrabold text-foreground">Prefer hands-on help?</h3>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">Our concierge can help manage permits, paperwork, and local coordination.</p>
            </div>
          </div>
          <Button asChild variant="ghost" className="shrink-0 justify-start text-foreground sm:justify-center">
            <Link to="/concierge">Explore concierge <ArrowRight /></Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
