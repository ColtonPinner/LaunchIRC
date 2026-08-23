import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Building2, CheckCircle2, Loader2, Mail, Send } from "lucide-react";
import { launchpadClient } from "@/api/launchpadClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/AuthContext";

export default function ProviderContact() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [form, setForm] = useState({ name: user?.user_metadata?.full_name || "", email: user?.email || "", phone: "", message: "" });
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [surveyId, setSurveyId] = useState("");

  const { data: listing, isLoading, isError } = useQuery({
    queryKey: ["provider-listing", id],
    queryFn: async () => (await launchpadClient.entities.DirectoryListing.filter({ id }))[0],
    enabled: !!id,
  });
  const { data: surveys = [] } = useQuery({
    queryKey: ["provider-contact-surveys", user?.id],
    queryFn: () => launchpadClient.entities.BusinessSurvey.listMine(),
    enabled: isAuthenticated,
  });
  const selectedSurveyId = surveyId || surveys[0]?.id || null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await launchpadClient.entities.ProviderLead.create(id, form, selectedSurveyId);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "We couldn't send your request. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="w-7 h-7 animate-spin text-accent" /></div>;
  if (isError || !listing) return <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6"><h1 className="font-heading text-2xl font-bold">Provider not found</h1><Link to="/directory"><Button variant="outline" className="mt-5">Back to directory</Button></Link></div>;

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-16">
        <Link to="/directory" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-7"><ArrowLeft className="w-4 h-4" /> Back to directory</Link>
        <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] border rounded-lg bg-card overflow-hidden">
          <aside className="bg-primary text-primary-foreground p-7 md:p-9">
            <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center mb-6"><Building2 className="w-6 h-6 text-accent" /></div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/60 mb-2">Contact provider</p>
            <h1 className="font-heading text-3xl font-bold">{listing.company_name}</h1>
            <p className="text-primary-foreground/70 mt-2 capitalize">{listing.category?.replaceAll("_", " ")}</p>
            {listing.description && <p className="text-sm leading-6 text-primary-foreground/75 mt-7">{listing.description}</p>}
            {isAuthenticated && <p className="text-xs text-primary-foreground/60 mt-8">This request will also appear in your customer portal.</p>}
          </aside>

          <main className="p-7 md:p-9">
            {submitted ? (
              <div className="min-h-96 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center mb-4"><CheckCircle2 className="w-6 h-6 text-emerald-600" /></div>
                <h2 className="font-heading text-2xl font-bold">Request sent</h2>
                <p className="text-sm text-muted-foreground mt-2 max-w-sm">{listing.company_name} can now review your message and contact you directly.</p>
                <div className="flex flex-wrap justify-center gap-2 mt-6"><Link to="/directory"><Button variant="outline">Browse directory</Button></Link>{isAuthenticated && <Link to="/portal"><Button>Track request</Button></Link>}</div>
              </div>
            ) : (
              <>
                <div className="mb-7"><h2 className="font-heading text-2xl font-bold">Tell them what you need</h2><p className="text-sm text-muted-foreground mt-1">Your contact details and message will be shared with this provider.</p></div>
                {error && <div role="alert" className="p-3 rounded-md bg-destructive/10 text-destructive text-sm mb-5">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div><Label htmlFor="lead-name">Name *</Label><Input id="lead-name" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="mt-1.5" /></div>
                    <div><Label htmlFor="lead-email">Email *</Label><Input id="lead-email" required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="mt-1.5" /></div>
                  </div>
                  <div><Label htmlFor="lead-phone">Phone</Label><Input id="lead-phone" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} className="mt-1.5" /></div>
                  {surveys.length > 0 && (
                    <div>
                      <Label htmlFor="lead-survey">Business plan to share</Label>
                      <select
                        id="lead-survey"
                        value={selectedSurveyId || ""}
                        onChange={(event) => setSurveyId(event.target.value)}
                        className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        {surveys.map((survey) => (
                          <option key={survey.id} value={survey.id}>
                            {(survey.business_type || "Business plan").replaceAll("_", " ")} · {new Date(survey.updated_date).toLocaleDateString()}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-muted-foreground mt-1.5">The provider will receive all answers from this saved survey with your request.</p>
                    </div>
                  )}
                  <div><Label htmlFor="lead-message">How can they help? *</Label><Textarea id="lead-message" required value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} placeholder="Share what you're working on, your timeline, and the help you need..." className="mt-1.5 min-h-36" /></div>
                  <Button type="submit" disabled={saving || !form.name || !form.email || !form.message} className="w-full h-11 gap-2">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Send to provider</Button>
                  <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1.5"><Mail className="w-3.5 h-3.5" /> The provider will reply using your contact details.</p>
                </form>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
