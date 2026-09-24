import React from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";

const navigation = [
  { label: "Business guides", path: "/guides" },
  { label: "Local directory", path: "/directory" },
  { label: "Community events", path: "/events" },
  { label: "The B4 Brief", path: "/the-b4-brief" },
  { label: "Concierge services", path: "/concierge" },
];

const resources = [
  { label: "Free startup guide", path: "/survey" },
  { label: "List your business", path: "/directory/join" },
  { label: "Become a sponsor", path: "/sponsor" },
  { label: "Account access", path: "/account" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="page-container">
        <div className="grid gap-10 py-12 md:grid-cols-[1.35fr_0.8fr_0.8fr_1fr]">
          <div className="max-w-sm">
            <Link to="/" className="flex items-center">
              <img src="/b4irc-logo.png" alt="B4IRC logo" className="h-12 w-auto object-contain invert dark:invert-0" />
            </Link>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Clear, local guidance for starting and growing a business in Indian River County, Florida.
            </p>
          </div>

          <FooterLinks title="Explore" links={navigation} />
          <FooterLinks title="Resources" links={resources} />

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Get in touch</h3>
            <div className="mt-5 space-y-3 text-sm text-muted-foreground">
              <a href="mailto:elliese@b4irc.com" className="flex items-center gap-2.5 transition-colors hover:text-foreground">
                <Mail className="h-4 w-4 text-foreground" />
                <span className="break-all">elliese@b4irc.com</span>
              </a>
              <a href="tel:+17727666533" className="flex items-center gap-2.5 transition-colors hover:text-foreground">
                <Phone className="h-4 w-4 text-foreground" />
                (772) 766-6533
              </a>
              <span className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-foreground" />
                Indian River County, FL
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-border py-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Launch Indian River. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="transition-colors hover:text-foreground">Privacy</Link>
            <Link to="/terms" className="transition-colors hover:text-foreground">Terms</Link>
            <Link to="/disclaimer" className="transition-colors hover:text-foreground">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLinks({ title, links }) {
  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">{title}</h3>
      <div className="mt-5 space-y-3">
        {links.map((link) => (
          <Link key={link.label} to={link.path} className="block text-sm text-muted-foreground transition-colors hover:text-foreground">
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
