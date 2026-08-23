import React from "react";
import { Link, Navigate } from "react-router-dom";
import { ArrowRight, BriefcaseBusiness, Building2, MapPin, UserRound } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

const accountTypes = [
  {
    title: "Customer",
    description: "Create launch plans, track consultations, and contact local providers.",
    icon: UserRound,
    login: "/customer/login",
    register: "/customer/register",
  },
  {
    title: "Service provider",
    description: "Manage your directory listing and respond to new applicants.",
    icon: Building2,
    login: "/provider/login",
    register: "/provider/register",
  },
  {
    title: "Consultant",
    description: "Review Launch IRC consultation requests and manage follow-up.",
    icon: BriefcaseBusiness,
    login: "/consultant/login",
  },
];

export default function AccountAccess() {
  const { user, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    const workspace = user?.account_type === "consultant" ? "/staff/inquiries" : user?.account_type === "provider" ? "/provider" : "/dashboard";
    return <Navigate to={workspace} replace />;
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center"><MapPin className="w-5 h-5 text-primary-foreground" /></span>
            <span className="font-heading font-bold text-lg">Launch IRC</span>
          </Link>
        </div>
      </header>

      <section className="flex-1 flex items-center py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 w-full">
          <div className="max-w-2xl mb-9">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent mb-2">Account access</p>
            <h1 className="font-heading text-3xl md:text-4xl font-bold">Choose your workspace</h1>
            <p className="text-muted-foreground mt-3">Each account type has a separate workspace and permissions.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 border rounded-lg bg-card overflow-hidden">
            {accountTypes.map((account, index) => (
              <article key={account.title} className={`p-6 flex flex-col min-h-72 ${index < accountTypes.length - 1 ? "border-b md:border-b-0 md:border-r" : ""}`}>
                <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-5"><account.icon className="w-5 h-5 text-primary" /></div>
                <h2 className="font-heading text-xl font-bold">{account.title}</h2>
                <p className="text-sm text-muted-foreground leading-6 mt-2">{account.description}</p>
                <div className="mt-auto pt-7 space-y-2">
                  <Link to={account.login} className="h-10 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium flex items-center justify-between">
                    Sign in <ArrowRight className="w-4 h-4" />
                  </Link>
                  {account.register && (
                    <Link to={account.register} className="h-10 px-4 rounded-md border text-sm font-medium flex items-center justify-center hover:bg-muted">
                      Create account
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
