import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Crown, CheckCircle2, Phone, Mail, Clock, Shield, Loader2 } from "lucide-react";

const services = [
  {
    title: "Full Concierge",
    description: "We handle everything from entity formation to opening day — permits, licenses, inspections, and coordination.",
    icon: Crown,
  },
  {
    title: "Property Search Assist",
    description: "We research zoning, verify compliance, and evaluate properties to find the right location for your business.",
    icon: Shield,
  },
  {
    title: "Permits & Licensing",
    description: "We prepare, submit, and track all required permits and license applications on your behalf.",
    icon: CheckCircle2,
  },
  {
    title: "Financial Guidance",
    description: "We connect you with lenders, prepare SBA loan applications, and identify applicable incentive programs.",
    icon: Clock,
  },
];

export default function Concierge() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    business_type: "",
    service_needed: "",
    message: "",
  });
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await base44.entities.ConciergeRequest.create(form);
    setSaving(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 text-accent text-sm font-semibold mb-6">
            <Crown className="w-4 h-4" />
            Premium Service
          </div>
          <h1 className="font-heading text-3xl md:text-5xl font-bold mb-4">
            Concierge Services
          </h1>
          <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto">
            Don't want to navigate the bureaucracy alone? Our team handles the legwork 
            so you can focus on building your business.
          </p>
        </div>
      </div>

      {/* Services */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl border p-6"
            >
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                <service.icon className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{service.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Why Choose Us */}
        <div className="bg-muted/30 rounded-2xl p-8 md:p-12 border mb-16">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-center mb-8">Why Use Our Concierge?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Clock, title: "Save Time", desc: "Skip weeks of research and phone calls. We know the process inside and out." },
              { icon: Shield, title: "Avoid Costly Mistakes", desc: "Wrong zoning, missing permits, and compliance gaps can cost thousands." },
              { icon: Phone, title: "Local Expertise", desc: "We have relationships with IRC departments, inspectors, and lenders." },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto" id="contact">
          {submitted ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-accent" />
              </div>
              <h2 className="font-heading text-2xl font-bold mb-3">We'll Be in Touch!</h2>
              <p className="text-muted-foreground">
                Thank you for your interest in our concierge services. We'll contact you within 24 hours.
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-10">
                <h2 className="font-heading text-2xl md:text-3xl font-bold mb-3">
                  Request a Free Consultation
                </h2>
                <p className="text-muted-foreground">
                  Tell us about your business and we'll create a custom plan for you.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Full Name *</Label>
                    <Input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your name"
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label>Email *</Label>
                    <Input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@example.com"
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="(772) 555-0100"
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label>Business Type</Label>
                    <Input
                      value={form.business_type}
                      onChange={(e) => setForm({ ...form, business_type: e.target.value })}
                      placeholder="e.g., Restaurant, Retail Store"
                      className="mt-1.5"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>What Service Do You Need?</Label>
                    <Select value={form.service_needed} onValueChange={(v) => setForm({ ...form, service_needed: v })}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full_concierge">Full Concierge — Handle Everything</SelectItem>
                        <SelectItem value="property_search">Property Search Assistance</SelectItem>
                        <SelectItem value="permits_licensing">Permits & Licensing Help</SelectItem>
                        <SelectItem value="financial_guidance">Financial Guidance & Loans</SelectItem>
                        <SelectItem value="legal_setup">Legal & Entity Setup</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label>Tell Us More</Label>
                    <Textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Describe your situation, timeline, and any specific questions..."
                      className="mt-1.5 h-32"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={saving || !form.name || !form.email}
                  className="w-full bg-accent hover:bg-accent/90 text-white font-semibold h-12"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Request Consultation"}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}