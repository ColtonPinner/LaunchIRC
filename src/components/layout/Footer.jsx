import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading text-xl font-bold">Launch IRC</span>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Your complete guide to starting and running a business in Indian River County, Florida.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-sm uppercase tracking-wider mb-4 text-primary-foreground/90">Navigate</h4>
            <div className="space-y-3">
              {[
                { label: "Home", path: "/" },
                { label: "Business Guides", path: "/guides" },
                { label: "Service Directory", path: "/directory" },
                { label: "Concierge Services", path: "/concierge" },
              ].map((link) => (
                <Link key={link.path} to={link.path} className="block text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-sm uppercase tracking-wider mb-4 text-primary-foreground/90">Resources</h4>
            <div className="space-y-3">
              {[
                { label: "Free Checklist", path: "/survey" },
                { label: "Premium Checklist", path: "/survey" },
                { label: "List Your Business", path: "/directory/join" },
                { label: "Become a Sponsor", path: "/sponsor" },
              ].map((link) => (
                <Link key={link.label} to={link.path} className="block text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-sm uppercase tracking-wider mb-4 text-primary-foreground/90">Contact</h4>
            <div className="space-y-3 text-sm text-primary-foreground/60">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>elliese@launchindianriver.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>(772) 766-6533</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>Indian River County, FL</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-primary-foreground/40">
            © {new Date().getFullYear()} Launch Indian River. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-primary-foreground/40">
            <Link to="/privacy" className="hover:text-primary-foreground/60 cursor-pointer">Privacy</Link>
            <Link to="/terms" className="hover:text-primary-foreground/60 cursor-pointer">Terms</Link>
            <Link to="/disclaimer" className="hover:text-primary-foreground/60 cursor-pointer">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}