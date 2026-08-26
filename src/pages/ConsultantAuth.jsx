import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BriefcaseBusiness, Loader2, Lock, Mail } from "lucide-react";
import { launchpadClient } from "@/api/launchpadClient";
import AuthLayout from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ConsultantAuth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await launchpadClient.auth.loginViaEmailPassword(email, password);
      const user = await launchpadClient.auth.me();
      if (user.account_type !== "consultant") {
        await launchpadClient.auth.logout();
        throw new Error("This is not a consultant account. Choose the correct account type.");
      }
      window.location.href = "/consultant";
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      icon={BriefcaseBusiness}
      title="Consultant sign in"
      subtitle="Access the Launch IRC consultation workspace"
      footer={
        <>
          Need a different workspace?{" "}
          <Link to="/account" className="text-primary font-medium hover:underline">
            Choose account type
          </Link>
        </>
      }
    >
      {error && (
        <div role="alert" className="mb-4 p-3 rounded-md bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="consultant-email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="consultant-email"
              type="email"
              autoComplete="email"
              autoFocus
              placeholder="you@launchindianriver.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="consultant-password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="consultant-password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>
        <Button type="submit" className="w-full h-12 font-medium" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Signing in...
            </>
          ) : (
            "Consultant sign in"
          )}
        </Button>
      </form>

      <p className="mt-5 pt-5 border-t text-center text-xs text-muted-foreground">
        Consultant accounts are provisioned by Launch IRC staff and cannot self-register.
      </p>
    </AuthLayout>
  );
}
