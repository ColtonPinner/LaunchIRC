import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Info, ChevronDown, ChevronUp, ExternalLink, Phone, Mail, Globe, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Renders a paragraph string, converting [text](url) markdown links into anchors.
// Internal links (url starting with "/") use react-router Link; external links open in a new tab.
function renderTextWithLinks(text) {
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts = [];
  let lastIndex = 0;
  let m;
  let key = 0;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > lastIndex) parts.push(text.slice(lastIndex, m.index));
    const label = m[1];
    const url = m[2];
    if (url.startsWith("/")) {
      parts.push(
        <Link key={`l${key++}`} to={url} className="text-blue-600 hover:underline font-medium">
          {label}
        </Link>
      );
    } else {
      parts.push(
        <a
          key={`l${key++}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline font-medium"
        >
          {label}
        </a>
      );
    }
    lastIndex = m.index + m[0].length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

export default function GuidanceCard({ item }) {
  const [expanded, setExpanded] = useState(true);
  const [sent, setSent] = useState(false);

  const handleNotify = () => {
    const subject = item.ctaButton.subject || "Assistance request from B4IRC";
    const body = `I would like help with "${item.title}."`;
    window.location.href = `mailto:${item.ctaButton.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

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
                    {renderTextWithLinks(para)}
                  </p>
                ))}

                {item.links?.length > 0 && (
                  <div className="flex flex-wrap gap-3 pt-1">
                    {item.links.map((link, i) => (
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
                  </div>
                )}

                {item.cta && (
                  <p className="text-sm text-blue-700 font-medium mt-1">{item.cta}</p>
                )}

                {item.ctaButton && (
                  <div className="mt-1">
                    {sent ? (
                      <p className="text-sm text-blue-700 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Email draft opened.
                      </p>
                    ) : (
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleNotify}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {item.ctaButton.label}
                      </Button>
                    )}
                  </div>
                )}

                {item.contactInfo && (
                  <div className="mt-3 pt-3 border-t border-blue-100 space-y-1.5 text-sm text-blue-800/80">
                    {item.contactInfo.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5" />
                        <a href={`tel:${item.contactInfo.phone}`} className="hover:underline">{item.contactInfo.phone}</a>
                      </div>
                    )}
                    {item.contactInfo.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5" />
                        <a href={`mailto:${item.contactInfo.email}`} className="hover:underline">{item.contactInfo.email}</a>
                      </div>
                    )}
                    {item.contactInfo.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5" />
                        <a href={item.contactInfo.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {item.contactInfo.website.replace(/^https?:\/\//, "")}
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {item.localExperts?.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-blue-100">
                    <p className="text-xs font-semibold text-blue-900 uppercase tracking-wide mb-2">Local Experts</p>
                    <ul className="space-y-1 text-sm text-blue-800/80">
                      {item.localExperts.map((ex, i) => (
                        <li key={i} className="flex gap-1.5">
                          <span className="font-medium text-blue-900 min-w-fit">{ex.role}:</span>
                          {ex.slug ? (
                            <Link to={`/directory#${ex.slug}`} className="hover:underline text-blue-600">{ex.company}</Link>
                          ) : ex.url ? (
                            <a href={ex.url} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600">{ex.company}</a>
                          ) : (
                            <span className="italic">{ex.company}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}