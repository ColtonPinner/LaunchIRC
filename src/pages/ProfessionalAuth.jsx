import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BriefcaseBusiness, Building2, Loader2, Lock, Mail, UserRound } from "lucide-react";
import { launchpadClient } from "@/api/launchpadClient";
import AuthLayout from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfessionalAuth({ mode = "login" }) {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({ fullName: "", businessName: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isRegister = mode === "register";
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
          accountType: "provider",
        });
        window.location.href = session ? "/directory/join" : "/professional/login?accountCreated=true";
        return;
      }

      await launchpadClient.auth.loginViaEmailPassword(form.email, form.password);
      const user = await launchpadClient.auth.me();
      const isStaff = ["staff", "admin"].includes(user.role);
      const isProvider = user.user_metadata?.account_type === "provider";
      if (!isStaff && !isProvider) {
        await launchpadClient.auth.logout();
        throw new Error("This is a customer account. Use customer sign in instead.");
      }
      window.location.href = isStaff ? "/staff/inquiries" : "/provider";
    } catch (err) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      icon={isRegister ? Building2 : BriefcaseBusiness}
      title={isRegister ? "Create a provider account" : "Professional sign in"}
      subtitle={isRegister ? "Apply to the directory and manage incoming leads" : "For Launch IRC staff and directory providers"}
      footer={isRegister ? (
        <>Already registered? <Link to="/professional/login" className="text-primary font-medium hover:underline">Professional sign in</Link></>
      ) : (
        <>Need a provider account? <Link to="/professional/register" className="text-primary font-medium hover:underline">Create one</Link></>
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
        <Button type="submit" className="w-full h-12" disabled={loading}>{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : isRegister ? "Create provider account" : "Professional sign in"}</Button>
      </form>

      <div className="mt-5 pt-5 border-t text-center text-sm text-muted-foreground">
        Looking for your requests? <Link to="/customer/login" className="text-primary font-medium hover:underline">Customer sign in</Link>
      </div>
    </AuthLayout>
  );
}
