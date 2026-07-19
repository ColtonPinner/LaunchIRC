import React, { useState } from "react";
import { motion } from "framer-motion";
import { Info, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

export default function GuidanceCard({ item }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-blue-200 bg-blue-50/60 overflow-hidden"
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Info className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-sm font-semibold text-blue-900">{item.title}</h4>
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 flex-shrink-0 transition-colors"
              >
                {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-2 space-y-2"
              >
                {item.guidance_paragraphs?.map((para, i) => (
                  <p key={i} className="text-sm text-blue-800/80 leading-relaxed">
                    {para}
                  </p>
                ))}
                {item.links?.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {link.label}
                  </a>
                ))}
                {item.cta && (
                  <p className="text-sm text-blue-700 font-medium mt-1">{item.cta}</p>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}