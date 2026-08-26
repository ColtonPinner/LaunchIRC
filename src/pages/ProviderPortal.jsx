import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Building2, CalendarDays, Inbox, Loader2, Mail, Phone, Plus, RefreshCw, UserPlus } from "lucide-react";
import { launchpadClient } from "@/api/launchpadClient";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";

const leadStatuses = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "closed", label: "Closed" },
];

const surveyFields = [
  ["business_stage", "Business stage"],
  ["has_property", "Property status"],
  ["jurisdiction", "Jurisdiction"],
  ["needs_construction", "Construction or renovations"],
  ["business_type", "Business type"],
  ["funding_needs", "Financing needs"],
  ["business_structure", "Business structure"],
  ["has_employees", "Expected employees"],
  ["help_level", "Requested help level"],
  ["plan_type", "Checklist plan"],
];

const humanize = (value) => {
  if (value === true) return "Yes";
  if (value === false) return "No";
  if (!value) return "Not answered";
  return String(value).replaceAll("_", " ");
};

const getSurveyRows = (survey) => {
  const designations = [
    survey.is_woman_owned && "Woman-owned",
    survey.is_minority_owned && "Minority-owned",
    survey.is_veteran_owned && "Veteran-owned",
    survey.is_first_time_owner && "First-time business owner",
  ].filter(Boolean);

  return [
    ...surveyFields.map(([key, label]) => ({ label, value: humanize(survey[key]) })),
    { label: "Special designations", value: designations.join(", ") || "None selected" },
    { label: "Customer name", value: survey.full_name || "Not provided" },
    { label: "Customer email", value: survey.email || "Not provided" },
    { label: "Customer phone", value: survey.phone || "Not provided" },
  ];
};

const formatDate = (value) => new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
}).format(new Date(value));

export default function ProviderPortal() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState(null);
  const [leadFilter, setLeadFilter] = useState("all");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["provider-portal", user?.id],
    queryFn: async () => {
      const [listings, leads] = await Promise.all([
        launchpadClient.entities.DirectoryListing.listMine(user.id),
        launchpadClient.entities.ProviderLead.listForProvider(),
      ]);
      return { listings, leads };
    },
    enabled: !!user,
  });

  const listings = data?.listings || [];
  const leads = data?.leads || [];
  const filteredLeads = leadFilter === "all" ? leads : leads.filter((lead) => lead.status === leadFilter);
  const selected = filteredLeads.find((lead) => lead.id === selectedId) || filteredLeads[0];
  const listingById = Object.fromEntries(listings.map((listing) => [listing.id, listing]));

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => launchpadClient.entities.ProviderLead.updateStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["provider-portal", user?.id] }),
  });

  const newCount = leads.filter((lead) => lead.status === "new").length;

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-background">
      <header className="border-b bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/60 mb-2">Business portal</p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
            <div><h1 className="font-heading text-3xl md:text-4xl font-bold">Business leads</h1><p className="text-primary-foreground/70 mt-2">Manage your directory presence and incoming opportunities.</p></div>
            <Link to="/directory/join"><Button className="bg-accent hover:bg-accent/90 text-white gap-2"><Plus className="w-4 h-4" /> Add listing</Button></Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        {isLoading && <div className="min-h-72 flex items-center justify-center border rounded-lg"><Loader2 className="w-6 h-6 animate-spin text-accent" /></div>}
        {isError && (
          <div className="min-h-72 flex flex-col items-center justify-center text-center border rounded-lg p-6">
            <p className="font-semibold">Your business workspace could not be loaded.</p>
            <Button variant="outline" className="gap-2 mt-4" onClick={() => refetch()}><RefreshCw className="w-4 h-4" /> Retry</Button>
          </div>
        )}

        {!isLoading && !isError && (
          <>
            <section className="mb-10">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div><h2 className="font-heading text-2xl font-bold">Your listings</h2><p className="text-sm text-muted-foreground mt-1">Approval status and directory visibility.</p></div>
              </div>
              {listings.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {listings.map((listing) => (
                    <article key={listing.id} className="border rounded-lg bg-card p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center"><Building2 className="w-5 h-5 text-primary" /></div>
                        <span className={`px-2 py-1 rounded-md border text-[11px] font-semibold uppercase ${listing.is_approved ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>{listing.is_approved ? "Live" : "In review"}</span>
                      </div>
                      <h3 className="font-semibold mt-4">{listing.company_name}</h3>
                      <p className="text-sm text-muted-foreground mt-1 capitalize">{listing.category?.replaceAll("_", " ")}</p>
                      {listing.is_approved && <Link to={`/directory#${listing.company_name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}`} className="text-sm text-accent font-medium inline-block mt-4 hover:underline">View public listing</Link>}
                    </article>
                  ))}
                </div>
              ) : (
                <div className="border border-dashed rounded-lg p-7 text-center"><Building2 className="w-7 h-7 text-muted-foreground mx-auto mb-3" /><h3 className="font-semibold">No business listing yet</h3><p className="text-sm text-muted-foreground mt-1 mb-4">Apply to appear in the local business directory.</p><Link to="/directory/join"><Button size="sm">Apply to join</Button></Link></div>
              )}
            </section>

            <section>
              <div className="flex items-center justify-between gap-4 mb-4">
                <div><h2 className="font-heading text-2xl font-bold">Applicants</h2><p className="text-sm text-muted-foreground mt-1">People requesting help through your directory listings.</p></div>
                <span className="flex items-center gap-2 text-sm font-medium text-accent"><UserPlus className="w-4 h-4" /> {newCount} new</span>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-3 mb-3">
                {[{ value: "new", label: "New applicants" }, { value: "all", label: "All" }, ...leadStatuses.slice(1)].map((status) => {
                  const count = status.value === "all" ? leads.length : leads.filter((lead) => lead.status === status.value).length;
                  return (
                    <button
                      key={status.value}
                      onClick={() => { setLeadFilter(status.value); setSelectedId(null); }}
                      className={`px-3 py-2 rounded-md border text-sm font-medium whitespace-nowrap ${leadFilter === status.value ? "bg-primary text-primary-foreground border-primary" : "bg-card hover:bg-muted"}`}
                    >
                      {status.label} <span className="ml-1 opacity-65">{count}</span>
                    </button>
                  );
                })}
              </div>

              {!filteredLeads.length ? (
                <div className="border border-dashed rounded-lg p-8 text-center"><Inbox className="w-8 h-8 text-muted-foreground mx-auto mb-3" /><h3 className="font-semibold">{leadFilter === "new" ? "No new applicants" : "No applicants in this view"}</h3><p className="text-sm text-muted-foreground mt-1">New customer requests will appear here.</p></div>
              ) : selected && (
                <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.35fr)] border rounded-lg bg-card overflow-hidden min-h-[28rem]">
                  <div className="border-b lg:border-b-0 lg:border-r max-h-[30rem] overflow-y-auto">
                    {filteredLeads.map((lead) => (
                      <button key={lead.id} onClick={() => setSelectedId(lead.id)} className={`w-full text-left p-4 border-b last:border-b-0 border-l-4 ${selected.id === lead.id ? "bg-accent/5 border-l-accent" : "hover:bg-muted/50 border-l-transparent"}`}>
                        <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="font-semibold truncate">{lead.name}</p><p className="text-sm text-muted-foreground truncate">{listingById[lead.listing_id]?.company_name || "Business listing"}</p></div><span className="text-[11px] font-semibold uppercase text-accent">{leadStatuses.find((status) => status.value === lead.status)?.label}</span></div>
                        <p className="text-xs text-muted-foreground mt-3">{formatDate(lead.created_date)}</p>
                      </button>
                    ))}
                  </div>

                  <div className="p-5 md:p-7">
                    <div className="flex items-start justify-between gap-4 pb-5 border-b"><div><p className="text-xs uppercase tracking-wider text-accent font-semibold mb-1">{listingById[selected.listing_id]?.company_name}</p><h3 className="font-heading text-2xl font-bold">{selected.name}</h3></div><span className="flex items-center gap-1.5 text-xs text-muted-foreground"><CalendarDays className="w-3.5 h-3.5" /> {formatDate(selected.created_date)}</span></div>
                    <div className="flex flex-wrap gap-2 py-5 border-b"><a href={`mailto:${selected.email}`}><Button variant="outline" size="sm" className="gap-2"><Mail className="w-4 h-4" /> Email</Button></a>{selected.phone && <a href={`tel:${selected.phone}`}><Button variant="outline" size="sm" className="gap-2"><Phone className="w-4 h-4" /> Call</Button></a>}</div>
                    <div className="py-5 border-b"><p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">Request</p><p className="text-sm leading-6 whitespace-pre-wrap">{selected.message}</p></div>
                    {selected.survey_data && (
                      <details className="py-5 border-b" open>
                        <summary className="text-xs uppercase tracking-wider text-muted-foreground font-semibold cursor-pointer">Shared survey answers</summary>
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mt-4">
                          {getSurveyRows(selected.survey_data).map((row) => (
                            <div key={row.label}>
                              <dt className="text-xs text-muted-foreground">{row.label}</dt>
                              <dd className="text-sm font-medium mt-0.5 capitalize">{row.value}</dd>
                            </div>
                          ))}
                        </dl>
                      </details>
                    )}
                    <div className="pt-5"><p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">Status</p><div className="flex flex-wrap gap-2">{leadStatuses.map((status) => <button key={status.value} disabled={statusMutation.isPending} onClick={() => statusMutation.mutate({ id: selected.id, status: status.value })} className={`px-3 py-1.5 rounded-md border text-xs font-semibold ${selected.status === status.value ? "bg-primary text-primary-foreground border-primary" : "hover:bg-muted"}`}>{status.label}</button>)}</div></div>
                  </div>
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
