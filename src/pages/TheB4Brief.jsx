import React, { useEffect } from "react";
import { ArrowUpRight, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/ThemeContext";

export default function TheB4Brief() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  useEffect(() => {
    const scriptId = "instagram-embed-script";
    let script = document.getElementById(scriptId);

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.async = true;
      script.src = "https://www.instagram.com/embed.js";
      document.body.appendChild(script);
    }

    const processEmbeds = () => {
      if (window.instgrm && typeof window.instgrm.Embeds !== "undefined") {
        window.instgrm.Embeds.process();
      }
    };

    processEmbeds();
    const timer = window.setInterval(processEmbeds, 250);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="brand-panel py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="mb-6 inline-flex items-center justify-center px-4 py-2">
            <img
              src="/b4irc-logo.png"
              alt="B4IRC logo"
              className="h-12 w-auto object-contain"
              style={{ filter: isDark ? "none" : "invert(1)" }}
            />
          </div>
          <h1 className="font-heading text-3xl font-bold md:text-5xl">The B4 Brief</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/75">
            A quick pulse on local business news, opportunities, and community stories from Launch Indian River.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="mb-10 grid gap-6 md:grid-cols-[1fr_1.2fr] md:items-start">
          <div className="rounded-3xl border bg-card p-6 shadow-sm md:p-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              <BadgeCheck className="h-3.5 w-3.5" />
              Local business updates
            </div>
            <h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl">Follow the story behind the launch.</h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground md:text-base">
              The B4 Brief brings together practical insights, event highlights, founder stories, and local business resources to help entrepreneurs move faster with clarity.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <a href="https://www.instagram.com/B4IRC_/?hl=en" target="_blank" rel="noreferrer noopener">
                  Open Instagram <ArrowUpRight className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border bg-card p-3 shadow-soft md:p-4">
            <blockquote
              className="instagram-media"
              data-instgrm-permalink="https://www.instagram.com/B4IRC_/?hl=en"
              data-instgrm-version="12"
              style={{
                background: "#FFF",
                border: 0,
                borderRadius: "12px",
                boxShadow: "none",
                maxWidth: "540px",
                minWidth: "300px",
                margin: "0 auto",
                padding: 0,
                width: "100%",
              }}
            ></blockquote>
          </div>
        </div>
      </div>
    </div>
  );
}
