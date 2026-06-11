import React from "react";
import { motion } from "framer-motion";
import { ClipboardList, Search, CheckSquare, Rocket } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    title: "Take the Survey",
    description: "Answer a few quick questions about your business type, stage, and needs.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Search,
    title: "Get Your Roadmap",
    description: "Receive a personalized checklist tailored to your specific business in IRC.",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: CheckSquare,
    title: "Follow the Steps",
    description: "Work through property, legal, financial, licensing, and compliance — in order.",
    color: "bg-emerald-500/10 text-emerald-600",
  },
  {
    icon: Rocket,
    title: "Open Your Doors",
    description: "Launch with confidence knowing everything is done right from day one.",
    color: "bg-violet-500/10 text-violet-600",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Four simple steps from idea to grand opening
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative"
            >
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] border-t-2 border-dashed border-border" />
              )}
              <div className="text-center">
                <div className={`w-20 h-20 rounded-2xl ${step.color} flex items-center justify-center mx-auto mb-6`}>
                  <step.icon className="w-8 h-8" />
                </div>
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Step {i + 1}
                </div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}