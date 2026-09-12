import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Building2, CalendarDays, Clock3, Headphones, Loader2, Mail, MessageSquare, Plus, RefreshCw } from "lucide-react";
import { launchpadClient } from "@/api/launchpadClient";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";

const statusDetails = {
  new: { label: "Received", className: "bg-blue-50 text-blue-700 border-blue-200" },
  contacted: { label: "Contacted", className: "bg-amber-50 text-amber-700 border-amber-200" },
  in_progress: { label: "In progress", className: "bg-orange-50 text-orange-700 border-orange-200" },
  closed: { label: "Complete", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
};

const formatDate = (value) => new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
}).format(new Date(value));

const Status = ({ value }) => {
  const status = statusDetails[value || "new"] || statusDetails.new;
  return <span className={`px-2 py-1 rounded-md border text-[11px] font-semibold uppercase ${status.className}`}>{status.label}</span>;
};

export default function CustomerPortal() {
  const { user } = useAuth();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["customer-portal", user?.id],
    queryFn: async () => {
      const [consultations, providerRequests] = await Promise.all([
        launchpadClient.portal.listMyConciergeRequests(),
        launchpadClient.portal.listMyProviderRequests(),
      ]);
      return { consultations, providerRequests };
    },
    enabled: !!user,
  });

  const consultations = data?.consultations || [];
  const providerRequests = data?.providerRequests || [];
  const activeCount = [...consultations, ...providerRequests].filter((request) => !["closed"].includes(request.status)).length;

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-background">
      <header className="page-header">
        <div className="page-header-inner">
          <p className="eyebrow mb-2">Customer portal</p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
            <div>
              <h1 className="font-heading text-3xl md:text-4xl font-bold">Your requests</h1>
              <p className="text-muted-foreground mt-2">Track conversations with B4IRC and local businesses.</p>
            </div>
            <span className="text-sm text-muted-foreground">{user?.email}</span>
          </div>
        </div>
      </header>

      <main className="page-container py-8 md:py-10">
        <section className="stat-grid mb-9" aria-label="Request summary">
          <div className="p-5"><p className="text-sm text-muted-foreground mb-1">Open requests</p><p className="text-3xl font-bold">{activeCount}</p></div>
          <div className="p-5"><p className="text-sm text-muted-foreground mb-1">B4IRC</p><p className="text-3xl font-bold">{consultations.length}</p></div>
          <div className="p-5"><p className="text-sm text-muted-foreground mb-1">Local businesses</p><p className="text-3xl font-bold">{providerRequests.length}</p></div>
        </section>

        {isLoading && <div className="min-h-64 flex items-center justify-center border rounded-lg"><Loader2 className="w-6 h-6 animate-spin text-accent" /></div>}
        {isError && (
          <div className="min-h-64 flex flex-col items-center justify-center text-center border rounded-lg p-6">
            <p className="font-semibold">Your requests could not be loaded.</p>
            <Button variant="outline" className="gap-2 mt-4" onClick={() => refetch()}><RefreshCw className="w-4 h-4" /> Retry</Button>
          </div>
        )}

        {!isLoading && !isError && (
          <div className="space-y-10">
            <section>
              <div className="flex items-center justify-between gap-4 mb-4">
                <div><h2 className="font-heading text-2xl font-bold">B4IRC consultations</h2><p className="text-sm text-muted-foreground mt-1">Requests sent to our concierge team.</p></div>
                <Link to="/concierge#contact"><Button size="sm" className="gap-2"><Plus className="w-4 h-4" /> New request</Button></Link>
              </div>
              {consultations.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {consultations.map((request) => (
                    <article key={request.id} className="border rounded-lg bg-card p-5">
                      <div className="flex items-start justify-between gap-3 mb-4"><Headphones className="w-5 h-5 text-accent" /><Status value={request.status} /></div>
                      <h3 className="font-semibold">{request.service_needed?.replaceAll("_", " ") || "General consultation"}</h3>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{request.message || "No additional details provided."}</p>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-5"><CalendarDays className="w-3.5 h-3.5" /> Submitted {formatDate(request.created_date)}</div>
                    </article>
                  ))}
                </div>
              ) : <EmptyState icon={Headphones} title="No consultation requests" text="Reach out when you need hands-on help with your launch." action="Request consultation" to="/concierge#contact" />}
            </section>

            <section>
              <div className="flex items-center justify-between gap-4 mb-4">
                <div><h2 className="font-heading text-2xl font-bold">Provider requests</h2><p className="text-sm text-muted-foreground mt-1">Messages sent to businesses in the directory.</p></div>
                <Link to="/directory"><Button size="sm" variant="outline" className="gap-2"><Building2 className="w-4 h-4" /> Find providers</Button></Link>
              </div>
              {providerRequests.length ? (
                <div className="divide-y border rounded-lg bg-card">
                  {providerRequests.map((request) => (
                    <article key={request.id} className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1"><h3 className="font-semibold truncate">{request.provider_name || "Local provider"}</h3><Status value={request.status} /></div>
                        <p className="text-sm text-muted-foreground line-clamp-1">{request.message}</p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground whitespace-nowrap"><Clock3 className="w-3.5 h-3.5" /> {formatDate(request.updated_date)}</div>
                    </article>
                  ))}
                </div>
              ) : <EmptyState icon={MessageSquare} title="No provider requests" text="Contact a directory provider and track the request here." action="Browse directory" to="/directory" />}
            </section>

            <div className="border-t pt-6 flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground flex items-center gap-2"><Mail className="w-4 h-4" /> Need general help? elliese@launchindianriver.com</p>
              <Link to="/dashboard"><Button variant="ghost" className="gap-2">Business dashboard <ArrowRight className="w-4 h-4" /></Button></Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function EmptyState({ icon: Icon, title, text, action, to }) {
  return (
    <div className="border border-dashed rounded-lg p-7 text-center">
      <Icon className="w-7 h-7 text-muted-foreground mx-auto mb-3" />
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1 mb-4">{text}</p>
      <Link to={to}><Button variant="outline" size="sm" className="gap-2">{action} <ArrowRight className="w-4 h-4" /></Button></Link>
    </div>
  );
}
