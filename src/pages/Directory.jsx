import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { launchpadClient } from "@/api/launchpadClient";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Search, Phone, Mail, Globe, MapPin, Star, Building2, Loader2 } from "lucide-react";

const categoryLabels = {
  attorney: "Attorney",
  accountant_cpa: "Accountant / CPA",
  real_estate: "Real Estate",
  insurance: "Insurance",
  banking_lending: "Banking & Lending",
  contractor: "Contractor",
  architect: "Architect",
  marketing: "Marketing",
  it_services: "IT Services",
  permits_consulting: "Permits Consulting",
  other: "Other",
};

const sponsorBadge = {
  platinum: "bg-violet-500/10 text-violet-600 border-violet-500/20",
  gold: "bg-gold/20 text-amber-700 border-gold/30",
  silver: "bg-slate-200 text-slate-600 border-slate-300",
  bronze: "bg-orange-100 text-orange-700 border-orange-200",
};

export default function Directory() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ["directory"],
    queryFn: () => launchpadClient.entities.DirectoryListing.filter({ is_approved: true }),
  });

  const filtered = listings.filter((l) => {
    const matchesSearch =
      search === "" ||
      l.company_name?.toLowerCase().includes(search.toLowerCase()) ||
      l.description?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "all" || l.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort sponsors first
  const sorted = [...filtered].sort((a, b) => {
    const sponsorOrder = { platinum: 0, gold: 1, silver: 2, bronze: 3, none: 4 };
    return (sponsorOrder[a.sponsor_level] || 4) - (sponsorOrder[b.sponsor_level] || 4);
  });

  // Scroll to a specific listing card when arriving via a #hash link (e.g. from the checklist).
  useEffect(() => {
    if (isLoading || !window.location.hash) return;
    const id = decodeURIComponent(window.location.hash.slice(1));
    const el = document.getElementById(id);
    if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "center" }), 100);
  }, [isLoading, sorted]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-heading text-3xl md:text-5xl font-bold mb-4">
            Local Business Directory
          </h1>
          <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto mb-8">
            Trusted local businesses to help you start and grow your business in Indian River County.
          </p>
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search businesses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-background text-foreground h-12"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeCategory === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            All Categories
          </button>
          {Object.entries(categoryLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeCategory === key
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Listings */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        ) : sorted.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sorted.map((listing, i) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                id={(listing.company_name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}
                className={`bg-card rounded-xl border p-6 hover:shadow-lg transition-all duration-200 flex flex-col ${
                  listing.is_sponsor ? "ring-2 ring-accent/20" : ""
                }`}
              >
                {listing.sponsor_level && listing.sponsor_level !== "none" && (
                  <Badge variant="outline" className={`mb-3 text-[10px] ${sponsorBadge[listing.sponsor_level]}`}>
                    <Star className="w-3 h-3 mr-1" />
                    {listing.sponsor_level.toUpperCase()} SPONSOR
                  </Badge>
                )}

                <div className="flex items-start gap-3 mb-3">
                  {listing.logo_url ? (
                    <img src={listing.logo_url} alt={listing.company_name} className="w-12 h-12 rounded-lg object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-primary" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-foreground">{listing.company_name}</h3>
                    <Badge variant="outline" className="text-[10px] mt-1">
                      {categoryLabels[listing.category] || listing.category}
                    </Badge>
                  </div>
                </div>

                {listing.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{listing.description}</p>
                )}

                <div className="space-y-2 text-sm text-muted-foreground">
                  {listing.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5" />
                      <a href={`tel:${listing.phone}`} className="hover:text-foreground transition-colors">{listing.phone}</a>
                    </div>
                  )}
                  {listing.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5" />
                      <a href={`mailto:${listing.email}`} className="hover:text-foreground transition-colors">{listing.email}</a>
                    </div>
                  )}
                  {listing.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5" />
                      <a href={listing.website} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors truncate">
                        {listing.website.replace(/^https?:\/\//, "")}
                      </a>
                    </div>
                  )}
                  {listing.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{listing.address}</span>
                    </div>
                  )}
                </div>
                <Link to={`/directory/${listing.id}/contact`} className="mt-auto pt-5">
                  <Button variant="outline" className="w-full gap-2">
                    <Mail className="w-4 h-4" /> Contact business
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-heading text-xl font-semibold mb-2">No Listings Yet</h3>
            <p className="text-muted-foreground mb-6">Be the first to join the directory!</p>
          </div>
        )}

        {/* Join CTA */}
        <div className="mt-16 bg-muted/30 rounded-2xl p-10 border text-center">
          <h3 className="font-heading text-2xl font-bold mb-3">List Your Business</h3>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Are you a business serving Indian River County? Join our directory and connect with new business owners.
          </p>
          <Link to="/directory/join">
            <Button className="bg-accent hover:bg-accent/90 text-white font-semibold gap-2 px-8" size="lg">
              Apply to Join
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}