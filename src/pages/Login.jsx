import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { launchpadClient, pendingSurvey } from "@/api/launchpadClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Mail, Lock, Loader2 } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

export default function Login() {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const accountCreated = searchParams.get("accountCreated") === "true";
  const hasPendingSurvey = !!pendingSurvey.get();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await launchpadClient.auth.loginViaEmailPassword(email, password);
      const user = await launchpadClient.auth.me();
      if (user.account_type !== "customer") {
        await launchpadClient.auth.logout();
        throw new Error("This is not a customer account. Choose the correct account type.");
      }
      const pending = pendingSurvey.get();
      if (pending) {
        const survey = await launchpadClient.entities.BusinessSurvey.create(pending);
        pendingSurvey.clear();
        window.location.href = `/checklist?id=${survey.id}`;
        return;
      }
      const returnTo = searchParams.get("returnTo");
      window.location.href = returnTo?.startsWith("/") && !returnTo.startsWith("//") ? returnTo : "/dashboard";
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      icon={LogIn}
      title="Business owner sign in"
      subtitle="Access your launch plan and requests"
      footer={
        <>
          Need a different account?{" "}
          <Link to="/customer/register" className="text-primary font-medium hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      {accountCreated && (
        <div className="mb-4 p-3 rounded-lg bg-accent/10 text-foreground text-sm">
          Check your email to confirm your account, then log in.
          {hasPendingSurvey && " Your completed survey is ready to save."}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              autoFocus
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>
        <Button type="submit" className="w-full h-12 font-medium" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Logging in...
            </>
          ) : (
            "Log in"
          )}
        </Button>
      </form>
      <div className="mt-5 pt-5 border-t text-center text-sm text-muted-foreground">
        Not a business owner? <Link to="/account" className="text-primary font-medium hover:underline">Choose account type</Link>
      </div>
    </AuthLayout>
  );
}
