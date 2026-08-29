import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function SurveyStep({ question, options, value, onChange, multi, description }) {
  const isSelected = (optionValue) => {
    if (multi) return Array.isArray(value) && value.includes(optionValue);
    return value === optionValue;
  };

  const handleSelect = (optionValue) => {
    if (multi) {
      const current = Array.isArray(value) ? value : [];
      if (current.includes(optionValue)) {
        onChange(current.filter(v => v !== optionValue));
      } else {
        onChange([...current, optionValue]);
      }
    } else {
      onChange(optionValue);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2">
        {question}
      </h2>
      {description && (
        <p className="text-muted-foreground text-sm mb-6">{description}</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSelect(option.value)}
            className={`relative text-left p-4 rounded-xl border-2 transition-all duration-200 group ${
              isSelected(option.value)
                ? "border-accent bg-accent/5 shadow-md shadow-accent/10"
                : "border-border hover:border-accent/40 hover:bg-muted/50"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                isSelected(option.value)
                  ? "bg-accent border-accent"
                  : "border-border group-hover:border-accent/40"
              }`}>
                {isSelected(option.value) && <Check className="w-3 h-3 text-white" />}
              </div>
              <div>
                {option.icon && <option.icon className="w-5 h-5 text-accent mb-1" />}
                <div className="font-medium text-sm text-foreground">{option.label}</div>
                {option.description && (
                  <div className="text-xs text-muted-foreground mt-1">{option.description}</div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}