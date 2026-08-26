import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Building2, CalendarDays, CheckCircle2, Inbox, Loader2, Mail, Phone, RefreshCw, Save, UserPlus } from "lucide-react";
import { launchpadClient } from "@/api/launchpadClient";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const statuses = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "in_progress", label: "In progress" },
  { value: "closed", label: "Closed" },
];

const categoryLabels = {
  attorney: "Attorney",
  accountant_cpa: "Accountant / CPA",
  real_estate: "Real Estate",
  insurance: "Insurance",
  banking_lending: "Banking & Lending",
  contractor: "Contractor",
  architect: "Architect",
  marketing: "Marketing",
  it_services: "IT Services",
  permits_consulting: "Permits Consulting",
  other: "Other",
};

const serviceLabels = {
  full_concierge: "Full concierge",
  property_search: "Property search",
  permits_licensing: "Permits and licensing",
  financial_guidance: "Financial guidance",
  legal_setup: "Legal setup",
  other: "Other",
};

const formatDate = (value) => new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
}).format(new Date(value));

const getStatus = (inquiry) => inquiry.status || "new";

export default function Inquiries() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const canManageTeam = ['admin', 'staff'].includes(user?.role);
  const [workspaceTab, setWorkspaceTab] = useState("consultations");
  const [filter, setFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(null);
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: "", fullName: "" });
  const [inviteError, setInviteError] = useState("");
  const [inviteSuccess, setInviteSuccess] = useState("");

  const { data: inquiries = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["staff-inquiries"],
    queryFn: () => launchpadClient.entities.ConciergeRequest.list("-created_date"),
  });

  const filtered = filter === "all"
    ? inquiries
    : inquiries.filter((inquiry) => getStatus(inquiry) === filter);
  const selected = filtered.find((inquiry) => inquiry.id === selectedId) || filtered[0];

  useEffect(() => {
    setNotes(selected?.staff_notes || "");
    setSaved(false);
  }, [selected?.id, selected?.staff_notes]);

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => launchpadClient.entities.ConciergeRequest.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["staff-inquiries"] }),
  });

  const { data: pendingListings = [], isLoading: isLoadingListings, isError: isListingsError, refetch: refetchListings } = useQuery({
    queryKey: ["staff-pending-listings"],
    queryFn: () => launchpadClient.entities.DirectoryListing.listPending(),
  });

  const { data: providerLeads = [], isLoading: isLoadingLeads, isError: isLeadsError, refetch: refetchLeads } = useQuery({
    queryKey: ["staff-provider-leads"],
    queryFn: () => launchpadClient.entities.ProviderLead.listForProvider(),
  });

  const approveMutation = useMutation({
    mutationFn: (id) => launchpadClient.entities.DirectoryListing.approve(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["staff-pending-listings"] }),
  });

  const { data: consultants = [], isLoading: isLoadingConsultants, isError: isConsultantsError, refetch: refetchConsultants } = useQuery({
    queryKey: ["staff-consultants"],
    queryFn: () => launchpadClient.admin.listConsultants(),
    enabled: canManageTeam,
  });

  const inviteMutation = useMutation({
    mutationFn: (payload) => launchpadClient.admin.inviteConsultant(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-consultants"] });
      setInviteForm({ email: "", fullName: "" });
      setInviteSuccess("Invite sent. They'll receive an email to set their password.");
    },
    onError: (error) => setInviteError(error.message || "Could not invite consultant"),
  });

  const handleInvite = (event) => {
    event.preventDefault();
    setInviteError("");
    setInviteSuccess("");
    inviteMutation.mutate(inviteForm);
  };

  const updateStatus = (status) => {
    if (!selected) return;
    updateMutation.mutate({ id: selected.id, data: { status } });
  };

  const saveNotes = async () => {
    if (!selected) return;
    await updateMutation.mutateAsync({ id: selected.id, data: { staff_notes: notes } });
    setSaved(true);
  };

  const newCount = inquiries.filter((inquiry) => getStatus(inquiry) === "new").length;

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-background">
      <header className="border-b bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-9">
          <div className="flex items-end justify-between gap-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/60 mb-2">Staff workspace</p>
              <h1 className="font-heading text-3xl md:text-4xl font-bold">Client inquiries</h1>
              <p className="text-primary-foreground/70 mt-2">Review requests and keep outreach moving.</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 border border-white/15 rounded-md text-sm">
              <Inbox className="w-4 h-4 text-accent" /> {newCount} new
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-2 mb-6 border-b">
          <button
            onClick={() => setWorkspaceTab("consultations")}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px ${workspaceTab === "consultations" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            Consultations
          </button>
          <button
            onClick={() => setWorkspaceTab("listings")}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px flex items-center gap-2 ${workspaceTab === "listings" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            Directory listings
            {pendingListings.length > 0 && <span className="text-[11px] font-semibold bg-accent/10 text-accent rounded-full px-1.5 py-0.5">{pendingListings.length}</span>}
          </button>
          <button
            onClick={() => setWorkspaceTab("leads")}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px flex items-center gap-2 ${workspaceTab === "leads" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            Provider leads
            {providerLeads.length > 0 && <span className="text-[11px] font-semibold bg-accent/10 text-accent rounded-full px-1.5 py-0.5">{providerLeads.length}</span>}
          </button>
          {canManageTeam && (
            <button
              onClick={() => setWorkspaceTab("team")}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px ${workspaceTab === "team" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              Team
            </button>
          )}
        </div>

        {workspaceTab === "consultations" && (
          <>
            <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
              {[{ value: "all", label: "All" }, ...statuses].map((status) => {
                const count = status.value === "all"
                  ? inquiries.length
                  : inquiries.filter((inquiry) => getStatus(inquiry) === status.value).length;
                return (
                  <button
                    key={status.value}
                    onClick={() => { setFilter(status.value); setSelectedId(null); }}
                    className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap border transition-colors ${
                      filter === status.value ? "bg-primary text-primary-foreground border-primary" : "bg-card hover:bg-muted"
                    }`}
                  >
                    {status.label} <span className="ml-1 opacity-65">{count}</span>
                  </button>
                );
              })}
            </div>

            {isLoading && (
              <div className="min-h-72 flex items-center justify-center border rounded-lg bg-card">
                <Loader2 className="w-6 h-6 animate-spin text-accent" aria-label="Loading inquiries" />
              </div>
            )}

            {isError && (
              <div className="min-h-72 flex flex-col items-center justify-center text-center border rounded-lg bg-card p-6">
                <p className="font-semibold">Inquiries could not be loaded.</p>
                <p className="text-sm text-muted-foreground mt-1 mb-4">Check staff access and try again.</p>
                <Button variant="outline" onClick={() => refetch()} className="gap-2"><RefreshCw className="w-4 h-4" /> Retry</Button>
              </div>
            )}

            {!isLoading && !isError && filtered.length === 0 && (
              <div className="min-h-72 flex flex-col items-center justify-center text-center border border-dashed rounded-lg bg-card p-6">
                <CheckCircle2 className="w-8 h-8 text-accent mb-3" />
                <h2 className="font-heading text-xl font-bold">Nothing in this queue</h2>
                <p className="text-sm text-muted-foreground mt-1">New consultation requests will appear here.</p>
              </div>
            )}

            {!isLoading && !isError && filtered.length > 0 && selected && (
              <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.4fr)] border rounded-lg bg-card overflow-hidden min-h-[32rem]">
                <div className="border-b lg:border-b-0 lg:border-r max-h-[34rem] overflow-y-auto">
                  {filtered.map((inquiry) => (
                    <button
                      key={inquiry.id}
                      onClick={() => setSelectedId(inquiry.id)}
                      className={`w-full text-left p-4 border-b last:border-b-0 transition-colors ${
                        selected.id === inquiry.id ? "bg-accent/5 border-l-4 border-l-accent" : "hover:bg-muted/50 border-l-4 border-l-transparent"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-semibold truncate">{inquiry.name}</p>
                          <p className="text-sm text-muted-foreground truncate">{inquiry.email}</p>
                        </div>
                        <span className="text-[11px] font-semibold uppercase tracking-wide text-accent whitespace-nowrap">
                          {statuses.find((status) => status.value === getStatus(inquiry))?.label}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-3">{serviceLabels[inquiry.service_needed] || "General inquiry"}</p>
                    </button>
                  ))}
                </div>

                <section className="p-5 md:p-7">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-6 border-b">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-1">{serviceLabels[selected.service_needed] || "General inquiry"}</p>
                      <h2 className="font-heading text-2xl font-bold">{selected.name}</h2>
                      {selected.business_type && <p className="text-sm text-muted-foreground mt-1">{selected.business_type}</p>}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CalendarDays className="w-3.5 h-3.5" /> {formatDate(selected.created_date)}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 py-5 border-b">
                    <a href={`mailto:${selected.email}`}><Button variant="outline" size="sm" className="gap-2"><Mail className="w-4 h-4" /> Email</Button></a>
                    {selected.phone && <a href={`tel:${selected.phone}`}><Button variant="outline" size="sm" className="gap-2"><Phone className="w-4 h-4" /> Call</Button></a>}
                  </div>

                  <div className="py-5 border-b">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Message</p>
                    <p className="text-sm leading-6 whitespace-pre-wrap">{selected.message || "No additional message was provided."}</p>
                  </div>

                  <div className="py-5 border-b">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Status</p>
                    <div className="flex flex-wrap gap-2">
                      {statuses.map((status) => (
                        <button
                          key={status.value}
                          onClick={() => updateStatus(status.value)}
                          disabled={updateMutation.isPending}
                          className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors ${
                            getStatus(selected) === status.value ? "bg-primary text-primary-foreground border-primary" : "hover:bg-muted"
                          }`}
                        >
                          {status.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-5">
                    <label htmlFor="staff-notes" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">Private staff notes</label>
                    <Textarea id="staff-notes" value={notes} onChange={(event) => { setNotes(event.target.value); setSaved(false); }} className="min-h-28" placeholder="Add follow-up details, next steps, or context..." />
                    <div className="flex items-center justify-between gap-3 mt-3">
                      <span className="text-xs text-muted-foreground">{saved ? "Notes saved" : "Visible to staff only"}</span>
                      <Button size="sm" onClick={saveNotes} disabled={updateMutation.isPending} className="gap-2">
                        {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save notes
                      </Button>
                    </div>
                  </div>
                </section>
              </div>
            )}
          </>
        )}

        {workspaceTab === "listings" && (
          <>
            {isLoadingListings && (
              <div className="min-h-72 flex items-center justify-center border rounded-lg bg-card">
                <Loader2 className="w-6 h-6 animate-spin text-accent" aria-label="Loading directory listings" />
              </div>
            )}

            {isListingsError && (
              <div className="min-h-72 flex flex-col items-center justify-center text-center border rounded-lg bg-card p-6">
                <p className="font-semibold">Listings could not be loaded.</p>
                <Button variant="outline" onClick={() => refetchListings()} className="gap-2 mt-4"><RefreshCw className="w-4 h-4" /> Retry</Button>
              </div>
            )}

            {!isLoadingListings && !isListingsError && pendingListings.length === 0 && (
              <div className="min-h-72 flex flex-col items-center justify-center text-center border border-dashed rounded-lg bg-card p-6">
                <CheckCircle2 className="w-8 h-8 text-accent mb-3" />
                <h2 className="font-heading text-xl font-bold">No listings awaiting review</h2>
                <p className="text-sm text-muted-foreground mt-1">New provider applications will appear here.</p>
              </div>
            )}

            {!isLoadingListings && !isListingsError && pendingListings.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingListings.map((listing) => (
                  <article key={listing.id} className="border rounded-lg bg-card p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center"><Building2 className="w-5 h-5 text-primary" /></div>
                      <span className="px-2 py-1 rounded-md border text-[11px] font-semibold uppercase bg-amber-50 text-amber-700 border-amber-200">Pending review</span>
                    </div>
                    <h3 className="font-semibold">{listing.company_name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{categoryLabels[listing.category] || listing.category}</p>
                    {listing.description && <p className="text-sm text-muted-foreground mt-3 line-clamp-3">{listing.description}</p>}
                    <div className="space-y-1.5 text-sm text-muted-foreground mt-4">
                      {listing.email && <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> {listing.email}</div>}
                      {listing.phone && <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> {listing.phone}</div>}
                    </div>
                    <Button
                      size="sm"
                      className="w-full mt-4 gap-2"
                      disabled={approveMutation.isPending}
                      onClick={() => approveMutation.mutate(listing.id)}
                    >
                      {approveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />} Approve listing
                    </Button>
                  </article>
                ))}
              </div>
            )}
          </>
        )}

        {workspaceTab === "leads" && (
          <>
            {isLoadingLeads && (
              <div className="min-h-72 flex items-center justify-center border rounded-lg bg-card">
                <Loader2 className="w-6 h-6 animate-spin text-accent" aria-label="Loading provider leads" />
              </div>
            )}

            {isLeadsError && (
              <div className="min-h-72 flex flex-col items-center justify-center text-center border rounded-lg bg-card p-6">
                <p className="font-semibold">Provider leads could not be loaded.</p>
                <Button variant="outline" onClick={() => refetchLeads()} className="gap-2 mt-4"><RefreshCw className="w-4 h-4" /> Retry</Button>
              </div>
            )}

            {!isLoadingLeads && !isLeadsError && providerLeads.length === 0 && (
              <div className="min-h-72 flex flex-col items-center justify-center text-center border border-dashed rounded-lg bg-card p-6">
                <CheckCircle2 className="w-8 h-8 text-accent mb-3" />
                <h2 className="font-heading text-xl font-bold">No provider leads yet</h2>
                <p className="text-sm text-muted-foreground mt-1">Customer requests to directory providers will appear here.</p>
              </div>
            )}

            {!isLoadingLeads && !isLeadsError && providerLeads.length > 0 && (
              <div className="divide-y border rounded-lg bg-card">
                {providerLeads.map((lead) => (
                  <article key={lead.id} className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">{lead.name}</h3>
                        <span className="text-[11px] font-semibold uppercase tracking-wide text-accent whitespace-nowrap">{lead.status}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{lead.email}{lead.message ? ` — ${lead.message}` : ""}</p>
                    </div>
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap"><CalendarDays className="w-3.5 h-3.5" /> {formatDate(lead.created_date)}</span>
                  </article>
                ))}
              </div>
            )}
          </>
        )}

        {workspaceTab === "team" && canManageTeam && (
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-6">
            <div className="border rounded-lg bg-card p-5 md:p-6 h-fit">
              <h2 className="font-heading text-lg font-bold mb-1">Invite a consultant</h2>
              <p className="text-sm text-muted-foreground mb-5">They'll receive an email to set their own password and sign in at /consultant/login.</p>
              {inviteError && <div role="alert" className="mb-4 p-3 rounded-md bg-destructive/10 text-destructive text-sm">{inviteError}</div>}
              {inviteSuccess && <div className="mb-4 p-3 rounded-md bg-emerald-50 text-emerald-700 text-sm">{inviteSuccess}</div>}
              <form onSubmit={handleInvite} className="space-y-4">
                <div>
                  <Label htmlFor="invite-name">Full name</Label>
                  <Input id="invite-name" value={inviteForm.fullName} onChange={(event) => setInviteForm({ ...inviteForm, fullName: event.target.value })} className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="invite-email">Email *</Label>
                  <Input id="invite-email" type="email" required value={inviteForm.email} onChange={(event) => setInviteForm({ ...inviteForm, email: event.target.value })} className="mt-1.5" />
                </div>
                <Button type="submit" disabled={inviteMutation.isPending || !inviteForm.email} className="w-full gap-2">
                  {inviteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />} Send invite
                </Button>
              </form>
            </div>

            <div className="border rounded-lg bg-card overflow-hidden">
              <div className="px-5 py-4 border-b">
                <h2 className="font-heading text-lg font-bold">Consultants</h2>
              </div>
              {isLoadingConsultants && (
                <div className="min-h-40 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin text-accent" />
                </div>
              )}
              {isConsultantsError && (
                <div className="p-6 text-center">
                  <p className="text-sm font-semibold">Consultants could not be loaded.</p>
                  <Button variant="outline" size="sm" onClick={() => refetchConsultants()} className="gap-2 mt-3"><RefreshCw className="w-4 h-4" /> Retry</Button>
                </div>
              )}
              {!isLoadingConsultants && !isConsultantsError && consultants.length === 0 && (
                <p className="p-6 text-sm text-muted-foreground text-center">No consultants yet.</p>
              )}
              {!isLoadingConsultants && !isConsultantsError && consultants.length > 0 && (
                <div className="divide-y">
                  {consultants.map((consultant) => (
                    <div key={consultant.id} className="px-5 py-3.5 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium truncate">{consultant.full_name || consultant.email}</p>
                        <p className="text-sm text-muted-foreground truncate">{consultant.email}</p>
                      </div>
                      <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap">{consultant.role}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
