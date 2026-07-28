import React from "react";

// Shared layout shell for the legal pages (Privacy / Terms / Disclaimer).
export default function LegalLayout({ title, lastUpdated, children }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-14 md:py-20">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="font-heading text-3xl md:text-4xl font-bold">{title}</h1>
          {lastUpdated && (
            <p className="text-primary-foreground/60 text-sm mt-2">Last updated: {lastUpdated}</p>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="prose prose-slate max-w-none prose-headings:font-heading prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-accent prose-strong:text-foreground">
          {children}
        </div>
      </div>
    </div>
  );
}