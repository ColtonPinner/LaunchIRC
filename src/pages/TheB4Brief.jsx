import React, { useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
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
      <section className="mx-auto max-w-5xl px-4 py-14 text-center md:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 inline-flex items-center justify-center">
            <img
              src="/b4irc-logo.png"
              alt="B4IRC logo"
              className="h-14 w-auto object-contain md:h-16"
              style={{ filter: isDark ? "none" : "invert(1)" }}
            />
          </div>
          <h1 className="font-heading text-4xl font-semibold tracking-[-0.04em] md:text-6xl">The B4 Brief</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
            A quick pulse on local business news, opportunities, and community stories from Launch Indian River.
          </p>
          <Button asChild variant="outline" className="mt-8 rounded-full">
            <a href="https://www.instagram.com/B4IRC_/?hl=en" target="_blank" rel="noreferrer noopener">
              Open Instagram <ArrowUpRight className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-16 md:pb-24">
          <div className="overflow-hidden rounded-[2rem] border bg-card p-3 md:p-4">
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
      </section>
    </div>
  );
}
