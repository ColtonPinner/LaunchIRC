import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BriefcaseBusiness, Building2, CalendarDays, CheckCircle2, ClipboardList, Headphones, Loader2, MapPin, Plus, RefreshCw } from "lucide-react";
import { launchpadClient } from "@/api/launchpadClient";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/lib/AuthContext";
import { generateChecklist } from "@/lib/checklistGenerator";

const stageLabels = {
  exploring_idea: "Exploring an idea",
  actively_planning: "Actively planning",
  looking_for_property: "Looking for property",
  under_contract: "Under contract",
  ready_to_open: "Ready to open",
  already_open: "Already open",
};

const formatDate = (value) => new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
}).format(new Date(value));

const getPlanProgress = (survey) => {
  const tasks = generateChecklist(survey).filter((item) =>
    item.type !== "guidance" && (survey.plan_type === "premium" || item.tier === "free"),
  );
  const complete = tasks.filter((item) => survey.checklist_progress?.[item.id]).length;
  return {
    complete,
    total: tasks.length,
    percent: tasks.length ? Math.round((complete / tasks.length) * 100) : 0,
  };
};

export default function Dashboard() {
  const { user } = useAuth();
  const { data: surveys = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["dashboard-surveys", user?.id],
    queryFn: () => launchpadClient.entities.BusinessSurvey.listMine(),
    enabled: !!user,
  });

  const plans = surveys.map((survey) => ({ ...survey, progress: getPlanProgress(survey) }));
  const completedTasks = plans.reduce((total, plan) => total + plan.progress.complete, 0);
  const totalTasks = plans.reduce((total, plan) => total + plan.progress.total, 0);
  const overallProgress = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-background">
      <header className="border-b bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/60 mb-2">My workspace</p>
              <h1 className="font-heading text-3xl md:text-4xl font-bold">Business launch dashboard</h1>
              <p className="text-primary-foreground/70 mt-2">{user?.email}</p>
            </div>
            <Link to="/survey">
              <Button className="bg-accent hover:bg-accent/90 text-white gap-2">
                <Plus className="w-4 h-4" /> New launch plan
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <section className="grid grid-cols-1 sm:grid-cols-3 border rounded-lg bg-card mb-10 overflow-hidden" aria-label="Account summary">
          <div className="p-5 border-b sm:border-b-0 sm:border-r">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
              <BriefcaseBusiness className="w-4 h-4" /> Active plans
            </div>
            <p className="text-3xl font-bold text-foreground">{plans.length}</p>
          </div>
          <div className="p-5 border-b sm:border-b-0 sm:border-r">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
              <CheckCircle2 className="w-4 h-4" /> Tasks completed
            </div>
            <p className="text-3xl font-bold text-foreground">{completedTasks}</p>
          </div>
          <div className="p-5">
            <div className="flex items-center justify-between text-sm mb-3">
              <span className="flex items-center gap-2 text-muted-foreground"><ClipboardList className="w-4 h-4" /> Overall progress</span>
              <span className="font-semibold text-accent">{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10" aria-label="Portal shortcuts">
          <Link to="/portal" className="border rounded-lg bg-card p-5 flex items-center justify-between gap-4 hover:border-accent transition-colors">
            <span className="flex items-center gap-3"><span className="w-10 h-10 rounded-md bg-accent/10 flex items-center justify-center"><Headphones className="w-5 h-5 text-accent" /></span><span><strong className="block">Customer portal</strong><span className="text-sm text-muted-foreground">Track consultation and provider requests</span></span></span>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
          </Link>
          <Link to="/provider/register" className="border rounded-lg bg-card p-5 flex items-center justify-between gap-4 hover:border-accent transition-colors">
            <span className="flex items-center gap-3"><span className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center"><Building2 className="w-5 h-5 text-primary" /></span><span><strong className="block">Provider portal</strong><span className="text-sm text-muted-foreground">Manage listings and incoming leads</span></span></span>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
          </Link>
        </section>

        <div className="flex items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="font-heading text-2xl font-bold">Your launch plans</h2>
            <p className="text-sm text-muted-foreground mt-1">Resume a checklist or begin a new business journey.</p>
          </div>
        </div>

        {isLoading && (
          <div className="min-h-52 flex items-center justify-center border rounded-lg bg-card">
            <Loader2 className="w-6 h-6 animate-spin text-accent" aria-label="Loading plans" />
          </div>
        )}

        {isError && (
          <div className="min-h-52 flex flex-col items-center justify-center text-center border rounded-lg bg-card p-6">
            <p className="font-semibold text-foreground">We couldn't load your plans.</p>
            <p className="text-sm text-muted-foreground mt-1 mb-4">Please retry the connection to your workspace.</p>
            <Button variant="outline" onClick={() => refetch()} className="gap-2">
              <RefreshCw className="w-4 h-4" /> Retry
            </Button>
          </div>
        )}

        {!isLoading && !isError && plans.length === 0 && (
          <div className="min-h-64 flex flex-col items-center justify-center text-center border border-dashed rounded-lg bg-card p-8">
            <div className="w-11 h-11 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <MapPin className="w-5 h-5 text-accent" />
            </div>
            <h3 className="font-heading text-xl font-bold">Create your first launch plan</h3>
            <p className="text-sm text-muted-foreground max-w-md mt-2 mb-5">Answer a short set of questions to build a checklist tailored to your business and jurisdiction.</p>
            <Link to="/survey"><Button className="gap-2"><Plus className="w-4 h-4" /> Start a plan</Button></Link>
          </div>
        )}

        {!isLoading && !isError && plans.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {plans.map((plan) => (
              <article key={plan.id} className="border rounded-lg bg-card p-5 flex flex-col">
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-accent">{plan.plan_type || "free"} plan</span>
                    </div>
                    <h3 className="font-heading text-xl font-bold truncate">{plan.business_name || plan.business_type?.replaceAll("_", " ") || "Business launch plan"}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{stageLabels[plan.business_stage] || "Launch planning"}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap">
                    <CalendarDays className="w-3.5 h-3.5" /> {formatDate(plan.updated_date)}
                  </div>
                </div>

                <div className="mt-auto">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">{plan.progress.complete} of {plan.progress.total} tasks</span>
                    <span className="font-semibold text-foreground">{plan.progress.percent}%</span>
                  </div>
                  <Progress value={plan.progress.percent} className="h-2 mb-5" />
                  <Link to={`/checklist?id=${plan.id}`}>
                    <Button variant="outline" className="w-full justify-between">
                      Open checklist <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
