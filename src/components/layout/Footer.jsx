import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const navigation = [
  { label: "Business guides", path: "/guides" },
  { label: "Local directory", path: "/directory" },
  { label: "Community events", path: "/events" },
  { label: "Concierge services", path: "/concierge" },
];

const resources = [
  { label: "Free launch roadmap", path: "/survey" },
  { label: "List your business", path: "/directory/join" },
  { label: "Become a sponsor", path: "/sponsor" },
  { label: "Account access", path: "/account" },
];

export default function Footer() {
  return (
    <footer className="brand-panel">
      <div className="page-container pt-10 sm:pt-14">
        <div className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/[0.055] px-6 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <p className="text-sm font-bold text-accent">Ready when you are</p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">Turn your idea into a launch plan.</h2>
          </div>
          <Button asChild size="lg" className="shrink-0 bg-accent text-accent-foreground hover:bg-accent/90">
            <Link to="/survey">Build my free roadmap <ArrowRight /></Link>
          </Button>
        </div>

        <div className="grid gap-10 py-14 md:grid-cols-[1.35fr_0.8fr_0.8fr_1fr]">
          <div className="max-w-sm">
            <Link to="/" className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <MapPin className="h-5 w-5" />
              </span>
              <span className="text-lg font-extrabold tracking-tight">Launch Indian River</span>
            </Link>
            <p className="mt-4 text-sm leading-6 text-white/60">
              Clear, local guidance for starting and growing a business in Indian River County, Florida.
            </p>
          </div>

          <FooterLinks title="Explore" links={navigation} />
          <FooterLinks title="Resources" links={resources} />

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-white/40">Get in touch</h3>
            <div className="mt-5 space-y-3 text-sm text-white/60">
              <a href="mailto:elliese@launchindianriver.com" className="flex items-center gap-2.5 transition-colors hover:text-white">
                <Mail className="h-4 w-4 text-accent" />
                <span className="break-all">elliese@launchindianriver.com</span>
              </a>
              <a href="tel:+17727666533" className="flex items-center gap-2.5 transition-colors hover:text-white">
                <Phone className="h-4 w-4 text-accent" />
                (772) 766-6533
              </a>
              <span className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-accent" />
                Indian River County, FL
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-6 text-xs text-white/40 sm:flex-row">
          <p>© {new Date().getFullYear()} Launch Indian River. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="transition-colors hover:text-white">Privacy</Link>
            <Link to="/terms" className="transition-colors hover:text-white">Terms</Link>
            <Link to="/disclaimer" className="transition-colors hover:text-white">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLinks({ title, links }) {
  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-white/40">{title}</h3>
      <div className="mt-5 space-y-3">
        {links.map((link) => (
          <Link key={link.label} to={link.path} className="block text-sm text-white/60 transition-colors hover:text-white">
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
