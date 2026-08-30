import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CheckSquare2, ClipboardList, Rocket, Route } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    title: "Tell us about your business",
    description: "Answer a few focused questions about your idea, location, and launch stage.",
  },
  {
    icon: Route,
    title: "Get a local roadmap",
    description: "We organize the registrations, zoning, permits, and resources that apply to you.",
  },
  {
    icon: CheckSquare2,
    title: "Work through each step",
    description: "Track progress in one place with practical instructions and direct local links.",
  },
  {
    icon: Rocket,
    title: "Open with confidence",
    description: "Move toward opening day knowing the important local requirements are covered.",
  },
];

export default function HowItWorks() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="section-y border-b border-border/70 bg-muted/40">
      <div className="page-container">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          className="grid gap-5 md:grid-cols-[0.8fr_1.2fr] md:items-end"
        >
          <div>
            <p className="eyebrow">A clearer way forward</p>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight text-foreground sm:text-4xl">From idea to opening day.</h2>
          </div>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground md:justify-self-end md:text-lg">
            Starting a business is complicated. Your roadmap turns dozens of disconnected requirements into four understandable stages.
          </p>
        </motion.div>

        <div className="relative mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="absolute left-[12.5%] right-[12.5%] top-8 hidden border-t border-dashed border-border lg:block" />
          {steps.map((step, index) => (
            <motion.article
              key={step.title}
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: reduceMotion ? 0 : index * 0.06 }}
              className="relative rounded-2xl border border-border/75 bg-card p-6 shadow-soft"
            >
              <div className="relative z-10 flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                  <step.icon className="h-5 w-5" />
                </span>
                <span className="font-mono text-xs font-medium text-muted-foreground">0{index + 1}</span>
              </div>
              <h3 className="mt-6 text-lg font-extrabold tracking-tight text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
