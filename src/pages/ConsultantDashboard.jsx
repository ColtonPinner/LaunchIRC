import React from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Building2, CalendarDays, CheckCircle2, ClipboardList, Headphones, Inbox, Loader2, RefreshCw, UserPlus } from "lucide-react";
import { launchpadClient } from "@/api/launchpadClient";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";

const serviceLabels = {
  full_concierge: "Full concierge",
  property_search: "Property search",
  permits_licensing: "Permits and licensing",
  financial_guidance: "Financial guidance",
  legal_setup: "Legal setup",
  other: "Other",
};

const statusLabels = {
  new: "New",
  contacted: "Contacted",
  in_progress: "In progress",
  closed: "Closed",
};

const formatDate = (value) => new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
}).format(new Date(value));

const getStatus = (inquiry) => inquiry.status || "new";

export default function ConsultantDashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isAdmin = user?.role === "admin";

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["consultant-dashboard"],
    queryFn: async () => {
      const [inquiries, pendingListings] = await Promise.all([
        launchpadClient.entities.ConciergeRequest.list("-created_date"),
        launchpadClient.entities.DirectoryListing.listPending(),
      ]);
      return { inquiries, pendingListings };
    },
  });

  const approveMutation = useMutation({
    mutationFn: (id) => launchpadClient.entities.DirectoryListing.approve(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["consultant-dashboard"] }),
  });

  const inquiries = data?.inquiries || [];
  const pendingListings = data?.pendingListings || [];
  const newInquiries = inquiries.filter((inquiry) => getStatus(inquiry) === "new");
  const inProgress = inquiries.filter((inquiry) => ["contacted", "in_progress"].includes(getStatus(inquiry)));
  const closed = inquiries.filter((inquiry) => getStatus(inquiry) === "closed");
  const recentInquiries = inquiries.slice(0, 5);

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-background">
      <header className="page-header">
        <div className="page-header-inner">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="eyebrow mb-2">Consultant workspace</p>
              <h1 className="font-heading text-3xl md:text-4xl font-bold">Consultant dashboard</h1>
              <p className="text-muted-foreground mt-2">{user?.profile?.full_name || user?.email}</p>
            </div>
            <Link to="/staff/inquiries">
              <Button className="bg-accent hover:bg-accent/90 text-white gap-2">
                <Inbox className="w-4 h-4" /> Open inquiry queue
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="page-container py-8 md:py-10">
        {isLoading && (
          <div className="min-h-72 flex items-center justify-center border rounded-lg bg-card">
            <Loader2 className="w-6 h-6 animate-spin text-accent" aria-label="Loading dashboard" />
          </div>
        )}

        {isError && (
          <div className="min-h-72 flex flex-col items-center justify-center text-center border rounded-lg bg-card p-6">
            <p className="font-semibold">Your workspace could not be loaded.</p>
            <p className="text-sm text-muted-foreground mt-1 mb-4">Check consultant access and try again.</p>
            <Button variant="outline" onClick={() => refetch()} className="gap-2"><RefreshCw className="w-4 h-4" /> Retry</Button>
          </div>
        )}

        {!isLoading && !isError && (
          <>
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border rounded-lg bg-card overflow-hidden mb-9" aria-label="Workload summary">
              <div className="p-5 border-b lg:border-b-0 sm:border-r">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2"><Inbox className="w-4 h-4" /> New inquiries</div>
                <p className="text-3xl font-bold">{newInquiries.length}</p>
              </div>
              <div className="p-5 border-b lg:border-b-0 lg:border-r">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2"><ClipboardList className="w-4 h-4" /> In progress</div>
                <p className="text-3xl font-bold">{inProgress.length}</p>
              </div>
              <div className="p-5 border-b sm:border-b-0 sm:border-r">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2"><CheckCircle2 className="w-4 h-4" /> Closed</div>
                <p className="text-3xl font-bold">{closed.length}</p>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2"><Building2 className="w-4 h-4" /> Listings to review</div>
                <p className="text-3xl font-bold">{pendingListings.length}</p>
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10" aria-label="Quick actions">
              <Link to="/staff/inquiries" className="border rounded-lg bg-card p-5 flex items-center justify-between gap-4 hover:border-accent transition-colors">
                <span className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-md bg-accent/10 flex items-center justify-center"><Headphones className="w-5 h-5 text-accent" /></span>
                  <span><strong className="block">Consultations</strong><span className="text-sm text-muted-foreground">{newInquiries.length} awaiting first contact</span></span>
                </span>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </Link>
              <Link to="/staff/inquiries" className="border rounded-lg bg-card p-5 flex items-center justify-between gap-4 hover:border-accent transition-colors">
                <span className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center"><Building2 className="w-5 h-5 text-primary" /></span>
                  <span><strong className="block">Directory review</strong><span className="text-sm text-muted-foreground">{pendingListings.length} pending listings</span></span>
                </span>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </Link>
              {isAdmin && (
                <Link to="/staff/inquiries" className="border rounded-lg bg-card p-5 flex items-center justify-between gap-4 hover:border-accent transition-colors">
                  <span className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center"><UserPlus className="w-5 h-5 text-primary" /></span>
                    <span><strong className="block">Team</strong><span className="text-sm text-muted-foreground">Invite and manage consultants</span></span>
                  </span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </Link>
              )}
            </section>

            {pendingListings.length > 0 && (
              <section className="mb-10">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div>
                    <h2 className="font-heading text-2xl font-bold">Directory approvals</h2>
                    <p className="text-sm text-muted-foreground mt-1">Businesses waiting to be added to the public directory.</p>
                  </div>
                  <Link to="/staff/inquiries"><Button variant="outline" size="sm" className="gap-2">Review all <ArrowRight className="w-4 h-4" /></Button></Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pendingListings.slice(0, 4).map((listing) => (
                    <div key={listing.id} className="border rounded-lg bg-card p-5">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{listing.company_name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{listing.category || "Business listing"}</p>
                        </div>
                        <span className="px-2 py-1 rounded-md border text-[11px] font-semibold uppercase bg-amber-50 text-amber-700 border-amber-200">Pending</span>
                      </div>

                      {listing.ein && (
                        <p className="text-sm text-muted-foreground mb-3"><span className="font-medium text-foreground">EIN:</span> {listing.ein}</p>
                      )}

                      {listing.email && <p className="text-sm text-muted-foreground">{listing.email}</p>}

                      <Button
                        size="sm"
                        className="w-full mt-4 gap-2"
                        disabled={approveMutation.isPending}
                        onClick={() => approveMutation.mutate(listing.id)}
                      >
                        {approveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />} Approve business
                      </Button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section>
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="font-heading text-2xl font-bold">Recent inquiries</h2>
                  <p className="text-sm text-muted-foreground mt-1">The latest consultation requests from customers.</p>
                </div>
                <Link to="/staff/inquiries"><Button variant="outline" size="sm" className="gap-2">View all <ArrowRight className="w-4 h-4" /></Button></Link>
              </div>

              {recentInquiries.length === 0 ? (
                <div className="min-h-52 flex flex-col items-center justify-center text-center border border-dashed rounded-lg bg-card p-6">
                  <CheckCircle2 className="w-8 h-8 text-accent mb-3" />
                  <h3 className="font-heading text-xl font-bold">No inquiries yet</h3>
                  <p className="text-sm text-muted-foreground mt-1">New consultation requests will appear here.</p>
                </div>
              ) : (
                <div className="divide-y border rounded-lg bg-card">
                  {recentInquiries.map((inquiry) => (
                    <Link key={inquiry.id} to="/staff/inquiries" className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-muted/40 transition-colors">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold truncate">{inquiry.name}</h3>
                          <span className="text-[11px] font-semibold uppercase tracking-wide text-accent whitespace-nowrap">{statusLabels[getStatus(inquiry)]}</span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{serviceLabels[inquiry.service_needed] || "General inquiry"}{inquiry.message ? ` — ${inquiry.message}` : ""}</p>
                      </div>
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap"><CalendarDays className="w-3.5 h-3.5" /> {formatDate(inquiry.created_date)}</span>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
