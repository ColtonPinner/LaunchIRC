import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import SurveyStep from "@/components/survey/SurveyStep";

const surveySteps = [
  {
    key: "business_stage",
    question: "Where are you in the process?",
    description: "This helps us tailor your checklist to your current stage.",
    options: [
      { value: "just_exploring", label: "Just Exploring", description: "I'm researching what it takes" },
      { value: "planning", label: "Actively Planning", description: "I have a business idea and I'm getting organized" },
      { value: "ready_to_start", label: "Ready to Launch", description: "I'm ready to file paperwork and move forward" },
      { value: "already_started", label: "Already Operating", description: "My business is running but I need to catch up on compliance" },
    ],
  },
  {
    key: "business_type",
    question: "What type of business?",
    description: "Different business types have different licensing and permit requirements.",
    options: [
      { value: "restaurant_food", label: "Restaurant / Food Service" },
      { value: "retail", label: "Retail Store" },
      { value: "office_professional", label: "Office / Professional Services" },
      { value: "medical_health", label: "Medical / Healthcare" },
      { value: "construction_trades", label: "Construction / Trades" },
      { value: "home_based", label: "Home-Based Business" },
      { value: "mobile_business", label: "Mobile Business" },
      { value: "other", label: "Something Else" },
    ],
  },
  {
    key: "has_property",
    question: "Have you found a property?",
    options: [
      { value: "no", label: "Not Yet", description: "I haven't started looking" },
      { value: "looking", label: "Currently Looking", description: "I'm searching for the right location" },
      { value: "found_one", label: "Found One", description: "I've identified a property but haven't committed" },
      { value: "already_own", label: "Already Have One", description: "I own or lease a property" },
    ],
  },
  {
    key: "business_structure",
    question: "Have you decided on a business structure?",
    options: [
      { value: "undecided", label: "Not Sure Yet", description: "I need guidance on what's best" },
      { value: "sole_proprietorship", label: "Sole Proprietorship" },
      { value: "llc", label: "LLC" },
      { value: "s_corp", label: "S-Corporation" },
      { value: "c_corp", label: "C-Corporation" },
      { value: "partnership", label: "Partnership" },
    ],
  },
  {
    key: "funding_needs",
    question: "How are you planning to fund your business?",
    options: [
      { value: "self_funded", label: "Self-Funded", description: "Using personal savings or assets" },
      { value: "need_loan", label: "Need a Loan", description: "Looking for SBA, bank, or construction loans" },
      { value: "seeking_investors", label: "Seeking Investors" },
      { value: "exploring_options", label: "Exploring All Options" },
    ],
  },
  {
    key: "special_designations",
    question: "Do any of these apply to you?",
    description: "Select all that apply. This unlocks special programs and incentives.",
    multi: true,
    options: [
      { value: "is_woman_owned", label: "Woman-Owned Business" },
      { value: "is_veteran_owned", label: "Veteran-Owned Business" },
      { value: "is_minority_owned", label: "Minority-Owned Business" },
      { value: "needs_construction", label: "I'll Need Construction / Build-Out" },
    ],
  },
  {
    key: "estimated_budget",
    question: "What's your estimated startup budget?",
    options: [
      { value: "under_10k", label: "Under $10,000" },
      { value: "10k_50k", label: "$10,000 – $50,000" },
      { value: "50k_150k", label: "$50,000 – $150,000" },
      { value: "150k_500k", label: "$150,000 – $500,000" },
      { value: "over_500k", label: "$500,000+" },
    ],
  },
];

export default function Survey() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [contactInfo, setContactInfo] = useState({ full_name: "", email: "", phone: "" });
  const [saving, setSaving] = useState(false);

  const planType = searchParams.get("plan") === "premium" ? "premium" : "free";
  const totalSteps = surveySteps.length + 1; // +1 for contact info
  const progress = ((step + 1) / totalSteps) * 100;
  const isContactStep = step === surveySteps.length;
  const currentStep = surveySteps[step];

  const canProceed = () => {
    if (isContactStep) return contactInfo.email.trim() !== "";
    const stepConfig = surveySteps[step];
    if (stepConfig.multi) return true; // Multi-select is optional
    return answers[stepConfig.key] !== undefined && answers[stepConfig.key] !== "";
  };

  const handleNext = () => {
    if (step < totalSteps - 1) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setSaving(true);
    const surveyData = {
      ...answers,
      ...contactInfo,
      plan_type: planType,
      checklist_progress: {},
    };

    // Handle special designations (multi-select booleans)
    if (Array.isArray(answers.special_designations)) {
      surveyData.is_woman_owned = answers.special_designations.includes("is_woman_owned");
      surveyData.is_veteran_owned = answers.special_designations.includes("is_veteran_owned");
      surveyData.is_minority_owned = answers.special_designations.includes("is_minority_owned");
      surveyData.needs_construction = answers.special_designations.includes("needs_construction");
    }
    delete surveyData.special_designations;

    const result = await base44.entities.BusinessSurvey.create(surveyData);
    setSaving(false);
    navigate(`/checklist?id=${result.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-12 md:py-20">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Step {step + 1} of {totalSteps}
            </span>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              planType === "premium"
                ? "bg-gold/20 text-amber-700"
                : "bg-accent/10 text-accent"
            }`}>
              {planType === "premium" ? "Premium" : "Free"} Checklist
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Survey Content */}
        <AnimatePresence mode="wait">
          {isContactStep ? (
            <motion.div
              key="contact"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
            >
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2">
                Almost done! Where should we send your checklist?
              </h2>
              <p className="text-muted-foreground text-sm mb-8">
                We'll save your personalized checklist so you can access it anytime.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name</label>
                  <Input
                    placeholder="Your name"
                    value={contactInfo.full_name}
                    onChange={(e) => setContactInfo({ ...contactInfo, full_name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Email *</label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Phone (optional)</label>
                  <Input
                    placeholder="(772) 555-0100"
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                  />
                </div>
              </div>
            </motion.div>
          ) : (
            <SurveyStep
              key={currentStep.key}
              question={currentStep.question}
              description={currentStep.description}
              options={currentStep.options}
              value={answers[currentStep.key]}
              onChange={(val) => setAnswers({ ...answers, [currentStep.key]: val })}
              multi={currentStep.multi}
            />
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={step === 0}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>

          {isContactStep ? (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed() || saving}
              className="bg-accent hover:bg-accent/90 text-white font-semibold gap-2 px-8"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              Generate My Checklist
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="gap-2 px-8"
            >
              Next <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}