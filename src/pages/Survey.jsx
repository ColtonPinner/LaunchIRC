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
    description: "This helps us understand where you are in your journey.",
    options: [
      { value: "exploring_idea", label: "Exploring an idea" },
      { value: "actively_planning", label: "Actively planning" },
      { value: "looking_for_property", label: "Looking for property" },
      { value: "under_contract", label: "Under contract / lease negotiation" },
      { value: "ready_to_open", label: "Ready to open soon" },
      { value: "already_open", label: "Already open (need help staying compliant)" },
    ],
  },
  {
    key: "has_property",
    question: "Do you have a property?",
    options: [
      { value: "looking_need_help", label: "No, I am looking and would like help" },
      { value: "looking_no_help", label: "No, I am looking and do not want help" },
      { value: "dont_need_property", label: "No, I do not need property (home based or mobile)" },
      { value: "in_mind", label: "I have a property in mind" },
      { value: "secured", label: "I have secured a property" },
    ],
  },
  {
    key: "needs_construction",
    question: "Will you need construction or renovations?",
    options: [
      { value: "no", label: "No" },
      { value: "minor", label: "Minor changes (interior)" },
      { value: "major_renovation", label: "Major renovation (inside and out)" },
      { value: "new_construction", label: "New construction" },
      { value: "not_sure", label: "Not sure" },
    ],
  },
  {
    key: "business_type",
    question: "What type of business are you starting?",
    description: "Different business types have unique licensing and permit rules.",
    options: [
      { value: "agriculture", label: "Agriculture" },
      { value: "professional_services", label: "Professional Services" },
      { value: "retail", label: "Retail" },
      { value: "hotel_boardinghouse", label: "Hotel / Boardinghouse" },
      { value: "personal_services", label: "Personal Services (laundry, barber)" },
      { value: "business_services", label: "Business Services" },
      { value: "auto", label: "Auto" },
      { value: "misc_repair", label: "Misc Repair" },
      { value: "motion_pictures", label: "Motion Pictures" },
      { value: "amusement_recreation", label: "Amusement and Recreation" },
      { value: "medical", label: "Medical" },
      { value: "food_store", label: "Food Store" },
      { value: "auto_dealer", label: "Auto Dealer" },
      { value: "eating_drinking", label: "Eating and Drinking" },
      { value: "educational", label: "Educational" },
      { value: "institutional", label: "Institutional (government, school, church)" },
      { value: "industrial", label: "Industrial" },
      { value: "transportation", label: "Transportation" },
      { value: "home_based", label: "Home-Based" },
      { value: "mobile_food_truck", label: "Mobile — Food Truck" },
      { value: "mobile_pop_up", label: "Mobile — Pop Up" },
      { value: "mobile_catering", label: "Mobile — Catering" },
      { value: "mobile_personal_services", label: "Mobile — Personal Services" },
      { value: "mobile_medical_services", label: "Mobile — Medical Services" },
      { value: "non_profit", label: "Non-Profit" },
    ],
  },
  {
    key: "funding_needs",
    question: "Do you need help with financing?",
    options: [
      { value: "no", label: "No" },
      { value: "exploring_options", label: "Yes, exploring options" },
      { value: "actively_applying", label: "Yes, actively applying" },
    ],
  },
  {
    key: "special_designations",
    question: "Do any of these apply to you?",
    description: "Select all that apply. This helps us surface relevant programs and incentives.",
    multi: true,
    options: [
      { value: "is_woman_owned", label: "Woman-owned" },
      { value: "is_minority_owned", label: "Minority-owned" },
      { value: "is_veteran_owned", label: "Veteran-owned" },
      { value: "is_first_time_owner", label: "First-time business owner" },
    ],
  },
  {
    key: "business_structure",
    question: "Have you decided on a business structure?",
    options: [
      { value: "no_reach_out", label: "No, I would like someone to reach out" },
      { value: "no_research_myself", label: "No, I will research it myself" },
      { value: "sole_proprietor", label: "Sole Proprietor" },
      { value: "partnership", label: "Partnership" },
      { value: "llc", label: "LLC" },
      { value: "c_corp", label: "Corporation (C Corp)" },
      { value: "s_corp", label: "S Corp" },
      { value: "nonprofit", label: "Nonprofit" },
      { value: "other", label: "Other" },
    ],
  },
  {
    key: "has_employees",
    question: "Do you anticipate having employees?",
    options: [
      { value: "no", label: "No" },
      { value: "1_5", label: "Yes (1-5)" },
      { value: "6_20", label: "Yes (6-20)" },
      { value: "20_plus", label: "Yes (20+)" },
    ],
  },
  {
    key: "help_level",
    question: "How much help do you want with this process?",
    options: [
      { value: "free_checklist", label: "Just the free checklist" },
      { value: "step_by_step", label: "Detailed step-by-step guide" },
      { value: "review_situation", label: "Help reviewing my situation" },
      { value: "full_concierge", label: "Full support / concierge" },
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
  const totalSteps = surveySteps.length + 1;
  const progress = ((step + 1) / totalSteps) * 100;
  const isContactStep = step === surveySteps.length;
  const currentStep = surveySteps[step];

  const canProceed = () => {
    if (isContactStep) return contactInfo.email.trim() !== "";
    const stepConfig = surveySteps[step];
    if (stepConfig.multi) return true;
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
      surveyData.is_first_time_owner = answers.special_designations.includes("is_first_time_owner");
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