import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Building2, Scale, DollarSign, FileCheck, ShieldCheck, Calculator, ArrowRight } from "lucide-react";

const categories = [
  {
    icon: Building2,
    title: "Property & Zoning",
    description: "Zoning classifications, setbacks, parking requirements, and what to look for when choosing a location.",
    link: "/guides#property",
    color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  },
  {
    icon: DollarSign,
    title: "Financing & Incentives",
    description: "SBA loans, construction loans, woman/veteran-owned programs, IRC incentives, and grants.",
    link: "/guides#financial",
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  },
  {
    icon: Scale,
    title: "Legal & Structure",
    description: "LLC vs S-Corp, articles of incorporation, operating agreements, and registered agents.",
    link: "/guides#legal",
    color: "bg-violet-500/10 text-violet-600 border-violet-500/20",
  },
  {
    icon: FileCheck,
    title: "Licenses & Permits",
    description: "Business tax receipts, professional licenses, health permits, liquor licenses, and more by business type.",
    link: "/guides#licensing",
    color: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  },
  {
    icon: ShieldCheck,
    title: "Codes & Compliance",
    description: "Building codes, fire safety, ADA compliance, signage regulations, and ongoing inspections.",
    link: "/guides#codes",
    color: "bg-rose-500/10 text-rose-600 border-rose-500/20",
  },
  {
    icon: Calculator,
    title: "Taxes & Reporting",
    description: "Quarterly filings, annual returns, sales tax, tangible property tax, and payroll obligations.",
    link: "/guides#taxes",
    color: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
  },
];

export default function GuidePreview() {
  return (
    <section className="py-20 md:py-28 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything You Need to Know
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Comprehensive guides covering every aspect of starting a business in Indian River County
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                to={cat.link}
                className="group block bg-card rounded-xl border p-6 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 h-full"
              >
                <div className={`w-12 h-12 rounded-xl ${cat.color} border flex items-center justify-center mb-4`}>
                  <cat.icon className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                  {cat.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {cat.description}
                </p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-accent">
                  Learn more <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/guides">
            <Button variant="outline" size="lg" className="font-semibold gap-2">
              View All Guides <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}