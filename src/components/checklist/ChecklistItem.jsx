import React from "react";
import { motion } from "framer-motion";
import { Check, Lock, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const categoryColors = {
  planning: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  legal: "bg-violet-500/10 text-violet-600 border-violet-500/20",
  property: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  financial: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  licensing: "bg-rose-500/10 text-rose-600 border-rose-500/20",
  codes: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
  taxes: "bg-orange-500/10 text-orange-600 border-orange-500/20",
};

export default function ChecklistItem({ item, isComplete, onToggle, isPremiumLocked }) {
  const [expanded, setExpanded] = useState(false);
  const colorClass = categoryColors[item.category] || "bg-muted text-muted-foreground";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group rounded-xl border transition-all duration-200 ${
        isComplete
          ? "bg-muted/30 border-border/50"
          : isPremiumLocked
          ? "bg-muted/20 border-dashed border-border/50 opacity-60"
          : "bg-card border-border hover:shadow-md hover:shadow-primary/5"
      }`}
    >
      <div className="flex items-start gap-3 p-4">
        {/* Checkbox */}
        <button
          onClick={isPremiumLocked ? undefined : onToggle}
          disabled={isPremiumLocked}
          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
            isComplete
              ? "bg-accent border-accent"
              : isPremiumLocked
              ? "border-border/50 cursor-not-allowed"
              : "border-border hover:border-accent cursor-pointer"
          }`}
        >
          {isComplete && <Check className="w-3.5 h-3.5 text-white" />}
          {isPremiumLocked && <Lock className="w-3 h-3 text-muted-foreground" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className={`text-sm font-semibold ${isComplete ? "line-through text-muted-foreground" : "text-foreground"}`}>
              {item.title}
            </h4>
            <div className="flex items-center gap-2 flex-shrink-0">
              {item.tier === "premium" && (
                <Badge variant="outline" className="text-[10px] bg-gold/10 text-amber-700 border-gold/30">
                  PREMIUM
                </Badge>
              )}
              <Badge variant="outline" className={`text-[10px] ${colorClass} border`}>
                {item.category}
              </Badge>
            </div>
          </div>

          {/* Expandable description */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mt-1 transition-colors"
          >
            {expanded ? "Hide details" : "Show details"}
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-2"
            >
              <div className="text-sm text-muted-foreground leading-relaxed space-y-2">
                {item.description.split("\n\n").map((para, i) => {
                  const urlRegex = /(https?:\/\/[^\s]+)/g;
                  const parts = para.split(urlRegex);
                  return (
                    <p key={i}>
                      {parts.map((part, j) =>
                        urlRegex.test(part) ? (
                          <a key={j} href={part} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline break-all">
                            {part}
                          </a>
                        ) : part
                      )}
                    </p>
                  );
                })}
              </div>
              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-accent hover:underline mt-2"
                >
                  <ExternalLink className="w-3 h-3" />
                  Visit Resource
                </a>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}