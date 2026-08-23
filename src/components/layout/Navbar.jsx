import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, MapPin, Sparkles, LayoutDashboard, LogIn, LogOut, Inbox } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

const baseNavLinks = [
  { label: "Home", path: "/" },
  { label: "Guides", path: "/guides" },
  { label: "Directory", path: "/directory" },
  { label: "Events", path: "/events" },
  { label: "Concierge", path: "/concierge" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const isConsultant = user?.account_type === "consultant";
  const isProvider = user?.account_type === "provider";
  const isWorkspaceAccount = isConsultant || isProvider;
  const workspacePath = isConsultant ? "/staff/inquiries" : isProvider ? "/provider" : "/dashboard";
  const workspaceLabel = isConsultant ? "Consultations" : isProvider ? "Provider portal" : "Dashboard";
  const navLinks = isWorkspaceAccount ? baseNavLinks : [...baseNavLinks, { label: "My Portal", path: "/portal" }];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <span className="font-heading text-lg font-bold text-foreground leading-none block">
                Launch IRC
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">
                Indian River County
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.path
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link to={workspacePath}>
                  <Button variant="outline" className="gap-2">
                    {isConsultant || isProvider ? <Inbox className="w-4 h-4" /> : <LayoutDashboard className="w-4 h-4" />}
                    {workspaceLabel}
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => logout()} title="Log out">
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Link to="/account">
                <Button variant="ghost" className="gap-2">
                  <LogIn className="w-4 h-4" />
                  Log in
                </Button>
              </Link>
            )}
            {!isWorkspaceAccount && (
              <Link to="/survey">
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold gap-2">
                  <Sparkles className="w-4 h-4" />
                  Get Started Free
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0">
              <div className="flex flex-col h-full">
                <div className="p-6 border-b">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <span className="font-heading text-lg font-bold">Launch IRC</span>
                  </div>
                </div>
                <div className="flex-1 p-4 space-y-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setOpen(false)}
                      className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        location.pathname === link.path
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-muted"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
                <div className="p-4 border-t">
                  <Link to={isAuthenticated ? workspacePath : "/account"} onClick={() => setOpen(false)}>
                    <Button variant="outline" className="w-full mb-2 gap-2">
                      {isAuthenticated ? (isConsultant || isProvider ? <Inbox className="w-4 h-4" /> : <LayoutDashboard className="w-4 h-4" />) : <LogIn className="w-4 h-4" />}
                      {isAuthenticated ? workspaceLabel : "Account sign in"}
                    </Button>
                  </Link>
                  {!isWorkspaceAccount && (
                    <Link to="/survey" onClick={() => setOpen(false)}>
                      <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold gap-2">
                        <Sparkles className="w-4 h-4" />
                        Get Started Free
                      </Button>
                    </Link>
                  )}
                  {isAuthenticated && (
                    <Button variant="ghost" className="w-full mt-2 gap-2" onClick={() => logout()}>
                      <LogOut className="w-4 h-4" /> Log out
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}