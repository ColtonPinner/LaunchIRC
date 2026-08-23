import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BriefcaseBusiness, Building2, Loader2, Lock, Mail, UserRound } from "lucide-react";
import { launchpadClient } from "@/api/launchpadClient";
import AuthLayout from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfessionalAuth({ mode = "login", accountType = "provider" }) {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({ fullName: "", businessName: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isRegister = mode === "register";
  const isConsultant = accountType === "consultant";
  const accountCreated = searchParams.get("accountCreated") === "true";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (isRegister && form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      if (isRegister) {
        const { session } = await launchpadClient.auth.register({
          email: form.email,
          password: form.password,
          fullName: form.fullName,
          businessName: form.businessName,
          accountType,
        });
        window.location.href = session ? "/directory/join" : "/provider/login?accountCreated=true";
        return;
      }

      await launchpadClient.auth.loginViaEmailPassword(form.email, form.password);
      const user = await launchpadClient.auth.me();
      if (user.account_type !== accountType) {
        await launchpadClient.auth.logout();
        throw new Error(`This is not a ${accountType} account. Choose the correct account type.`);
      }
      window.location.href = isConsultant ? "/staff/inquiries" : "/provider";
    } catch (err) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      icon={isConsultant ? BriefcaseBusiness : Building2}
      title={isRegister ? "Create a provider account" : isConsultant ? "Consultant sign in" : "Provider sign in"}
      subtitle={isRegister ? "Apply to the directory and manage incoming leads" : isConsultant ? "Access the Launch IRC consultation workspace" : "Manage your listings and applicants"}
      footer={isRegister ? (
        <>Already registered? <Link to="/provider/login" className="text-primary font-medium hover:underline">Provider sign in</Link></>
      ) : (
        isConsultant
          ? <>Need a different workspace? <Link to="/account" className="text-primary font-medium hover:underline">Choose account type</Link></>
          : <>Need a provider account? <Link to="/provider/register" className="text-primary font-medium hover:underline">Create one</Link></>
      )}
    >
      {accountCreated && <div className="mb-4 p-3 rounded-md bg-accent/10 text-sm">Check your email to confirm your provider account, then sign in.</div>}
      {error && <div role="alert" className="mb-4 p-3 rounded-md bg-destructive/10 text-destructive text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegister && (
          <>
            <div className="space-y-2"><Label htmlFor="professional-name">Your name</Label><div className="relative"><UserRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input id="professional-name" value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} className="pl-10 h-12" required /></div></div>
            <div className="space-y-2"><Label htmlFor="business-name">Business name</Label><div className="relative"><Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input id="business-name" value={form.businessName} onChange={(event) => setForm({ ...form, businessName: event.target.value })} className="pl-10 h-12" required /></div></div>
          </>
        )}
        <div className="space-y-2"><Label htmlFor="professional-email">Email</Label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input id="professional-email" type="email" autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="pl-10 h-12" required /></div></div>
        <div className="space-y-2"><Label htmlFor="professional-password">Password</Label><div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input id="professional-password" type="password" autoComplete={isRegister ? "new-password" : "current-password"} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="pl-10 h-12" minLength={8} required /></div></div>
        {isRegister && <div className="space-y-2"><Label htmlFor="professional-confirm">Confirm password</Label><div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input id="professional-confirm" type="password" autoComplete="new-password" value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} className="pl-10 h-12" minLength={8} required /></div></div>}
        <Button type="submit" className="w-full h-12" disabled={loading}>{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : isRegister ? "Create provider account" : isConsultant ? "Consultant sign in" : "Provider sign in"}</Button>
      </form>

      <div className="mt-5 pt-5 border-t text-center text-sm text-muted-foreground">
        Looking for your requests? <Link to="/customer/login" className="text-primary font-medium hover:underline">Customer sign in</Link>
      </div>
    </AuthLayout>
  );
}
