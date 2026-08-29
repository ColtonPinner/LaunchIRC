import React, { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { launchpadClient, pendingSurvey } from "@/api/launchpadClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import SurveyStep from "@/components/survey/SurveyStep";
import { useAuth } from "@/lib/AuthContext";

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
    show: (a) =>
      ["exploring_idea", "actively_planning", "looking_for_property"].includes(a.business_stage),
    options: [
      { value: "looking_need_help", label: "No, I am looking and would like help" },
      { value: "looking_no_help", label: "No, I am looking and do not want help" },
      { value: "dont_need_property", label: "No, I do not need property (home based or mobile)" },
      { value: "in_mind", label: "I have a property in mind" },
      { value: "secured", label: "I have secured a property" },
    ],
  },
  {
    key: "wants_realtor_contact",
    question: "Would you like someone to reach out to you?",
    description:
      "We can connect you with a local realtor expert, or you can browse listings through the Indian River County Chamber of Commerce or LoopNet.",
    show: (a) => a.has_property === "looking_need_help",
    options: [
      { value: "yes", label: "Yes, have an expert contact me" },
      { value: "no", label: "No thanks" },
    ],
  },
  {
    key: "jurisdiction",
    question: "Which jurisdiction is the property in?",
    description:
      "City of Vero Beach, City of Sebastian, City of Fellsmere, or unincorporated County? You can check the address here: https://www.indianriver.gov/government/departments/property-records-recordings",
    show: (a) =>
      ["under_contract", "ready_to_open", "already_open"].includes(a.business_stage) ||
      ["in_mind", "secured"].includes(a.has_property),
    options: [
      { value: "vero_beach", label: "City of Vero Beach" },
      { value: "sebastian", label: "City of Sebastian" },
      { value: "fellsmere", label: "City of Fellsmere" },
      { value: "indian_river_county", label: "Indian River County (unincorporated)" },
      { value: "unsure", label: "Unsure" },
    ],
  },
  {
    key: "needs_construction",
    question: "Will you need construction or renovations?",
    show: (a) => a.business_stage !== "already_open",
    options: [
      { value: "no", label: "No" },
      { value: "minor", label: "Minor changes (interior, minimal outdoor changes)" },
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
    show: (a) => a.business_stage !== "already_open",
    options: [
      { value: "no", label: "No" },
      { value: "yes", label: "Yes" },
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
    show: (a) => a.business_stage !== "already_open",
    options: [
      { value: "no_reach_out", label: "No, I would like guidance" },
      { value: "no_research_myself", label: "No, I will research it myself" },
      { value: "partnership", label: "Partnership" },
      { value: "llc", label: "LLC" },
      { value: "c_corp", label: "Corporation (C Corp)" },
      { value: "nonprofit", label: "Nonprofit" },
      { value: "other", label: "Other" },
    ],
  },
  {
    key: "has_employees",
    question: "Do you anticipate having employees?",
    options: [
      { value: "no", label: "No" },
      { value: "yes_1_9", label: "Yes (1-9)" },
      { value: "yes_10_50", label: "Yes (10-50)" },
      { value: "yes_50_plus", label: "Yes (50+)" },
    ],
  },
  {
    key: "age_range",
    question: "If you want, tell us your age range",
    description: "Optional. This helps us report on who we're serving locally.",
    options: [
      { value: "18_21", label: "18-21" },
      { value: "22_30", label: "22-30" },
      { value: "31_50", label: "31-50" },
      { value: "50_70", label: "50-70" },
      { value: "70_plus", label: "70+" },
      { value: "skip", label: "Skip" },
    ],
  },
  {
    key: "employment_status",
    question: "Are you currently employed?",
    description: "Optional.",
    show: (a) => a.age_range && a.age_range !== "skip",
    options: [
      { value: "full_time", label: "Yes, full time" },
      { value: "part_time", label: "Yes, part time" },
      { value: "no", label: "No" },
    ],
  },
  {
    key: "prior_business_owner",
    question: "Have you owned your own business before?",
    description: "Optional.",
    show: (a) => a.age_range && a.age_range !== "skip",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  },
  {
    key: "wants_expert_contact",
    question: "Are you interested in being contacted by local experts in the area?",
    show: (a) => a.age_range && a.age_range !== "skip",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  },
  {
    key: "help_level",
    question: "How much help do you want with this process?",
    options: [
      { value: "free_checklist", label: "Just the free checklist" },
      { value: "step_by_step", label: "Detailed step-by-step guide ($50)" },
      { value: "review_situation", label: "A quick phone call to see the best path moving forward" },
      { value: "full_concierge", label: "Full support / concierge services (price varies by project)" },
    ],
  },
];

export default function Survey() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [contactInfo, setContactInfo] = useState({ full_name: "", email: "", phone: "" });
  const [account, setAccount] = useState({ password: "", confirmPassword: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const { user, isAuthenticated } = useAuth();

  const planType = searchParams.get("plan") === "premium" ? "premium" : "free";

  const visibleSteps = useMemo(
    () => surveySteps.filter((s) => (s.show ? s.show(answers) : true)),
    [answers]
  );

  const totalSteps = visibleSteps.length + 1;
  const progress = Math.min(((step + 1) / totalSteps) * 100, 100);
  const isContactStep = step === visibleSteps.length;
  const currentStep = visibleSteps[step];

  const canProceed = () => {
    if (isContactStep) {
      if (isAuthenticated) return true;
      return contactInfo.email.trim() !== "" && account.password.length >= 8 && account.password === account.confirmPassword;
    }
    if (!currentStep) return false;
    if (currentStep.multi) return true;
    return answers[currentStep.key] !== undefined && answers[currentStep.key] !== "";
  };

  const handleNext = () => {
    if (step < totalSteps - 1) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError("");
    const surveyData = {
      ...answers,
      ...contactInfo,
      email: isAuthenticated ? user.email : contactInfo.email,
      // Choosing the detailed step-by-step guide upgrades the result to the
      // premium checklist immediately (payment gated separately for later).
      plan_type: answers.help_level === "step_by_step" ? "premium" : planType,
      checklist_progress: {},
    };

    if (Array.isArray(answers.special_designations)) {
      surveyData.is_woman_owned = answers.special_designations.includes("is_woman_owned");
      surveyData.is_veteran_owned = answers.special_designations.includes("is_veteran_owned");
      surveyData.is_minority_owned = answers.special_designations.includes("is_minority_owned");
      surveyData.is_first_time_owner = answers.special_designations.includes("is_first_time_owner");
    }
    delete surveyData.special_designations;

    try {
      if (!isAuthenticated) {
        pendingSurvey.save(surveyData);
        const { session } = await launchpadClient.auth.register({
          email: contactInfo.email,
          password: account.password,
          fullName: contactInfo.full_name,
          accountType: "customer",
        });
        if (!session) {
          navigate("/customer/login?accountCreated=true");
          return;
        }
      }

      const result = await launchpadClient.entities.BusinessSurvey.create(surveyData);
      pendingSurvey.clear();
      window.location.href = `/checklist?id=${result.id}`;
    } catch (err) {
      setError(err.message || "We couldn't create your account and save your checklist.");
    } finally {
      setSaving(false);
    }
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
                {isAuthenticated ? "Almost done!" : "Save your personalized checklist"}
              </h2>
              <p className="text-muted-foreground text-sm mb-8">
                {isAuthenticated
                  ? "We'll add this plan to your dashboard."
                  : "Create an account to keep your answers, track progress, and return anytime."}
              </p>
              {error && (
                <div className="mb-5 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>
              )}
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
                    value={isAuthenticated ? user.email : contactInfo.email}
                    onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                    disabled={isAuthenticated}
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
                {!isAuthenticated && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Create Password *</label>
                      <Input
                        type="password"
                        autoComplete="new-password"
                        placeholder="At least 8 characters"
                        value={account.password}
                        onChange={(e) => setAccount({ ...account, password: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Confirm Password *</label>
                      <Input
                        type="password"
                        autoComplete="new-password"
                        placeholder="Repeat your password"
                        value={account.confirmPassword}
                        onChange={(e) => setAccount({ ...account, confirmPassword: e.target.value })}
                      />
                      {account.confirmPassword && account.password !== account.confirmPassword && (
                        <p className="text-xs text-destructive mt-1.5">Passwords do not match.</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          ) : currentStep ? (
            <SurveyStep
              key={currentStep.key}
              question={currentStep.question}
              description={currentStep.description}
              options={currentStep.options}
              value={answers[currentStep.key]}
              onChange={(val) => setAnswers({ ...answers, [currentStep.key]: val })}
              multi={currentStep.multi}
            />
          ) : null}
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
              {isAuthenticated ? "Save My Checklist" : "Create Account & Save"}
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