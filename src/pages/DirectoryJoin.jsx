import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, CheckCircle2 } from "lucide-react";

const categories = [
  { value: "attorney", label: "Attorney" },
  { value: "accountant_cpa", label: "Accountant / CPA" },
  { value: "real_estate", label: "Real Estate" },
  { value: "insurance", label: "Insurance" },
  { value: "banking_lending", label: "Banking & Lending" },
  { value: "contractor", label: "Contractor" },
  { value: "architect", label: "Architect" },
  { value: "marketing", label: "Marketing" },
  { value: "it_services", label: "IT Services" },
  { value: "permits_consulting", label: "Permits Consulting" },
  { value: "other", label: "Other" },
];

export default function DirectoryJoin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    company_name: "",
    category: "",
    description: "",
    phone: "",
    email: "",
    website: "",
    address: "",
  });
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await base44.entities.DirectoryListing.create({
      ...form,
      is_approved: false,
      is_sponsor: false,
      sponsor_level: "none",
    });
    setSaving(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-accent" />
          </div>
          <h2 className="font-heading text-2xl font-bold mb-3">Application Submitted!</h2>
          <p className="text-muted-foreground mb-6">
            We'll review your listing and get back to you within 2 business days. Thank you for joining the IRC Business directory.
          </p>
          <Button onClick={() => navigate("/directory")} variant="outline">
            Back to Directory
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-12 md:py-20">
        <div className="mb-10">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
            Join the Directory
          </h1>
          <p className="text-muted-foreground text-lg">
            Connect with entrepreneurs starting businesses in Indian River County. 
            Submit your information and we'll review your listing.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Label>Company Name *</Label>
              <Input
                required
                value={form.company_name}
                onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                placeholder="Your business name"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label>Category *</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <Label>Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="info@yourcompany.com"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label>Website</Label>
              <Input
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                placeholder="https://yourcompany.com"
                className="mt-1.5"
              />
            </div>

            <div className="md:col-span-2">
              <Label>Address</Label>
              <Input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Street address, City, FL ZIP"
                className="mt-1.5"
              />
            </div>

            <div className="md:col-span-2">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Brief description of your services..."
                className="mt-1.5 h-24"
              />
            </div>
          </div>

          <div className="bg-muted/50 rounded-xl p-6 border">
            <h3 className="font-semibold text-sm mb-2">Interested in Sponsorship?</h3>
            <p className="text-sm text-muted-foreground">
              Sponsor listings get priority placement, featured badges, and visibility across our guides. 
              Contact us at <span className="text-accent font-medium">elliese@launchindianriver.com</span> for sponsorship packages.
            </p>
          </div>

          <Button
            type="submit"
            disabled={saving || !form.company_name || !form.category}
            className="w-full bg-accent hover:bg-accent/90 text-white font-semibold h-12"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Application"}
          </Button>
        </form>
      </div>
    </div>
  );
}