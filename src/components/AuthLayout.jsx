import React from "react";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";

export default function AuthLayout({ icon: Icon, title, subtitle, footer, children }) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-background px-4 py-12">
      <Link to="/" className="relative flex items-center gap-2 mb-10">
        <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-lg">
          🚀
        </span>
        <span className="font-heading font-bold text-lg">B4IRC</span>
      </Link>

      <div className="relative w-full max-w-md animate-fade-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-secondary border border-border mb-4">
            <Icon className="w-6 h-6 text-foreground" aria-hidden="true" />
          </div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">{title}</h1>
          {subtitle && <p className="text-muted-foreground mt-2 text-sm">{subtitle}</p>}
        </div>
        <div className="bg-card rounded-lg border border-border p-8">
          {children}
        </div>
        {footer && (
          <p className="text-center text-sm text-muted-foreground mt-6">{footer}</p>
        )}
      </div>
    </div>
  );
}
