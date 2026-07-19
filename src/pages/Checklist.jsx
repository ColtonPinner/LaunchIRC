import React, { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { generateChecklist } from "@/lib/checklistGenerator";
import ChecklistItem from "@/components/checklist/ChecklistItem";
import GuidanceCard from "@/components/checklist/GuidanceCard";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Crown, Download, Sparkles, Loader2 } from "lucide-react";

export default function Checklist() {
  const [searchParams] = useSearchParams();
  const surveyId = searchParams.get("id");
  const queryClient = useQueryClient();
  const [activePhase, setActivePhase] = useState("all");

  const { data: survey, isLoading } = useQuery({
    queryKey: ["survey", surveyId],
    queryFn: () => base44.entities.BusinessSurvey.filter({ id: surveyId }),
    enabled: !!surveyId,
    select: (data) => data?.[0],
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.BusinessSurvey.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["survey", surveyId] }),
  });

  const checklist = useMemo(() => {
    if (!survey) return [];
    return generateChecklist(survey);
  }, [survey]);

  const progress = useMemo(() => {
    if (!checklist.length || !survey?.checklist_progress) return 0;
    const completable = checklist.filter(i => i.type !== "guidance" && (survey.plan_type === "premium" || i.tier === "free"));
    const completed = completable.filter(i => survey.checklist_progress[i.id]);
    return completable.length > 0 ? Math.round((completed.length / completable.length) * 100) : 0;
  }, [checklist, survey]);

  const phases = useMemo(() => {
    const set = new Set(checklist.map(i => i.phase));
    return ["all", ...Array.from(set)];
  }, [checklist]);

  const filteredChecklist = activePhase === "all"
    ? checklist
    : checklist.filter(i => i.phase === activePhase);

  const toggleItem = (itemId) => {
    if (!survey) return;
    const newProgress = { ...survey.checklist_progress, [itemId]: !survey.checklist_progress?.[itemId] };
    updateMutation.mutate({ id: survey.id, data: { checklist_progress: newProgress } });
  };

  if (!surveyId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center">
          <h2 className="font-heading text-2xl font-bold mb-4">No Checklist Found</h2>
          <p className="text-muted-foreground mb-6">Take the survey to generate your personalized checklist.</p>
          <Link to="/survey">
            <Button className="bg-accent hover:bg-accent/90 text-white gap-2">
              <Sparkles className="w-4 h-4" /> Take the Survey
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center">
          <h2 className="font-heading text-2xl font-bold mb-4">Checklist Not Found</h2>
          <Link to="/survey">
            <Button className="bg-accent hover:bg-accent/90 text-white gap-2">
              <Sparkles className="w-4 h-4" /> Create a New Checklist
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const actionItems = checklist.filter(i => i.type !== "guidance");
  const completedCount = actionItems.filter(i => survey.checklist_progress?.[i.id]).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-16">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                Your Business Checklist
              </h1>
              {survey.full_name && (
                <p className="text-muted-foreground mt-1">For {survey.full_name}</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              {survey.plan_type === "free" && (
                <Link to={`/survey?plan=premium`}>
                  <Button variant="outline" className="gap-2 text-amber-700 border-gold/30 hover:bg-gold/10">
                    <Crown className="w-4 h-4" /> Upgrade to Premium
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Progress */}
          <div className="bg-card rounded-xl border p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-foreground">{completedCount} of {actionItems.length} tasks</span>
              <span className="text-sm font-bold text-accent">{progress}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
        </div>

        {/* Phase Tabs */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-2 pb-2">
            {phases.map((phase) => (
              <button
                key={phase}
                onClick={() => setActivePhase(phase)}
                className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  activePhase === phase
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {phase === "all" ? "All Steps" : phase}
              </button>
            ))}
          </div>
        </div>

        {/* Checklist Items grouped by phase */}
        <div className="space-y-8">
          {(activePhase === "all" ? phases.filter(p => p !== "all") : [activePhase]).map((phase) => {
            const items = filteredChecklist.filter(i => i.phase === phase);
            if (items.length === 0) return null;

            return (
              <div key={phase}>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  {phase}
                </h3>
                <div className="space-y-3">
                  {items.map((item) =>
                    item.type === "guidance" ? (
                      <GuidanceCard key={item.id} item={item} />
                    ) : (
                      <ChecklistItem
                        key={item.id}
                        item={item}
                        isComplete={!!survey.checklist_progress?.[item.id]}
                        onToggle={() => toggleItem(item.id)}
                        isPremiumLocked={item.tier === "premium" && survey.plan_type === "free"}
                      />
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Concierge CTA */}
        <div className="mt-12 bg-primary rounded-2xl p-8 text-primary-foreground text-center">
          <h3 className="font-heading text-2xl font-bold mb-2">Need Help Getting Through Your List?</h3>
          <p className="text-primary-foreground/70 mb-6 max-w-lg mx-auto">
            Our concierge team can handle the permits, paperwork, and phone calls for you.
          </p>
          <Link to="/concierge">
            <Button className="bg-accent hover:bg-accent/90 text-white font-semibold gap-2">
              <Crown className="w-4 h-4" />
              Explore Concierge Services
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}