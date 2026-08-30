import React from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, Calculator, DollarSign, FileCheck, Scale, ShieldCheck } from "lucide-react";

const categories = [
  {
    icon: Building2,
    title: "Property & zoning",
    description: "Confirm allowed uses, parking needs, utilities, setbacks, and location fit before you commit.",
    link: "/guides#property",
  },
  {
    icon: DollarSign,
    title: "Funding & incentives",
    description: "Understand SBA programs, local lenders, construction financing, and available incentives.",
    link: "/guides#financial",
  },
  {
    icon: Scale,
    title: "Legal structure",
    description: "Compare entity types, register in Florida, protect your business, and set up core documents.",
    link: "/guides#legal",
  },
  {
    icon: FileCheck,
    title: "Licenses & permits",
    description: "Find local tax receipts, professional licenses, and industry-specific approvals.",
    link: "/guides#licensing",
  },
  {
    icon: ShieldCheck,
    title: "Codes & compliance",
    description: "Plan for building, fire, accessibility, signage, inspections, and ongoing requirements.",
    link: "/guides#codes",
  },
  {
    icon: Calculator,
    title: "Taxes & reporting",
    description: "Stay ahead of sales tax, payroll, annual reports, and recurring filing deadlines.",
    link: "/guides#taxes",
  },
];

export default function GuidePreview() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="section-y border-b border-border/70 bg-background">
      <div className="page-container">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow">Local knowledge, organized</p>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight text-foreground sm:text-4xl">Answers for every part of your launch.</h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
              Plain-language guidance for the decisions that cost founders the most time and uncertainty.
            </p>
          </div>
          <Button asChild variant="outline" size="lg" className="hidden sm:inline-flex">
            <Link to="/guides">View all guides <ArrowRight /></Link>
          </Button>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: reduceMotion ? 0 : index * 0.045 }}
            >
              <Link to={category.link} className="group surface-interactive flex h-full flex-col p-6">
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                    <category.icon className="h-5 w-5" />
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1 group-hover:text-accent" />
                </div>
                <h3 className="mt-6 text-lg font-extrabold text-foreground">{category.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{category.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>

        <Button asChild variant="outline" size="lg" className="mt-8 w-full sm:hidden">
          <Link to="/guides">View all guides <ArrowRight /></Link>
        </Button>
      </div>
    </section>
  );
}
