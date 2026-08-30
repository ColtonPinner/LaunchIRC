import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Star, Eye, TrendingUp, Users, Mail } from "lucide-react";

const tiers = [
  {
    name: "Bronze",
    price: "$99/mo",
    color: "bg-orange-100 border-orange-200 text-orange-800",
    features: [
      "Listed in Service Directory",
      "Company name & contact info",
      "Category listing",
    ],
  },
  {
    name: "Silver",
    price: "$249/mo",
    color: "bg-slate-100 border-slate-300 text-slate-700",
    features: [
      "Everything in Bronze",
      "Priority directory placement",
      "Company description & logo",
      "Link to your website",
    ],
  },
  {
    name: "Gold",
    price: "$499/mo",
    color: "bg-amber-50 border-gold text-amber-800",
    highlighted: true,
    features: [
      "Everything in Silver",
      "Sponsor badge on profile",
      "Featured in 1 guide section",
      "Monthly analytics report",
      "Social media mention",
    ],
  },
  {
    name: "Platinum",
    price: "$999/mo",
    color: "bg-violet-50 border-violet-300 text-violet-800",
    features: [
      "Everything in Gold",
      "Top directory placement",
      "Sponsor up to 3 guide sections",
      "Featured on homepage",
      "Quarterly co-branded content",
      "Dedicated account manager",
    ],
  },
];

export default function Sponsor() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="brand-panel py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/20 text-amber-300 text-sm font-semibold mb-6">
            <Star className="w-4 h-4" />
            Partner With Us
          </div>
          <h1 className="font-heading text-3xl md:text-5xl font-bold mb-4">
            Become a Sponsor
          </h1>
          <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto">
            Reach entrepreneurs at the moment they need your services most — 
            when they're starting a business in Indian River County.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-5xl mx-auto px-4 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Eye, label: "Monthly Visitors", value: "Growing Daily" },
            { icon: Users, label: "Active Checklists", value: "New Entrepreneurs" },
            { icon: TrendingUp, label: "Guide Views", value: "High Intent Traffic" },
          ].map((stat) => (
            <div key={stat.label} className="bg-card rounded-xl border p-6 text-center shadow-lg">
              <stat.icon className="w-6 h-6 text-accent mx-auto mb-2" />
              <div className="font-heading text-xl font-bold text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tiers */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-center mb-12">
          Sponsorship Packages
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-xl border-2 p-6 ${tier.color} ${
                tier.highlighted ? "ring-2 ring-gold shadow-xl scale-[1.02]" : ""
              }`}
            >
              {tier.highlighted && (
                <div className="text-xs font-bold uppercase tracking-wider mb-2">Most Popular</div>
              )}
              <h3 className="font-heading text-xl font-bold mb-1">{tier.name}</h3>
              <div className="text-2xl font-bold mb-4">{tier.price}</div>
              <ul className="space-y-2">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Star className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-16 text-center bg-primary rounded-2xl p-10 text-primary-foreground">
          <h3 className="font-heading text-2xl font-bold mb-3">Ready to Partner?</h3>
          <p className="text-primary-foreground/70 mb-6 max-w-lg mx-auto">
            Contact us to discuss the best sponsorship package for your business. 
            Custom packages are also available.
          </p>
          <a href="mailto:elliese@launchindianriver.com">
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold gap-2 px-8" size="lg">
              <Mail className="w-5 h-5" />
              Contact Us
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
