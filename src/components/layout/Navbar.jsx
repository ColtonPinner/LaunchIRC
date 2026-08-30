import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Inbox, LayoutDashboard, LogIn, LogOut, MapPin, Menu, Moon, Sparkles, Sun } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useTheme } from "@/lib/ThemeContext";

const baseNavLinks = [
  { label: "Home", path: "/" },
  { label: "Guides", path: "/guides" },
  { label: "Directory", path: "/directory" },
  { label: "Events", path: "/events" },
  { label: "Concierge", path: "/concierge" },
];

const isActivePath = (pathname, path) =>
  path === "/" ? pathname === path : pathname === path || pathname.startsWith(`${path}/`);

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const isConsultant = user?.account_type === "consultant";
  const isProvider = user?.account_type === "provider";
  const isWorkspaceAccount = isConsultant || isProvider;
  const workspacePath = isConsultant ? "/consultant" : isProvider ? "/provider" : "/dashboard";
  const workspaceLabel = isConsultant ? "Consultant dashboard" : isProvider ? "Business portal" : "Dashboard";
  const navLinks = isWorkspaceAccount ? baseNavLinks : [...baseNavLinks, { label: "My Portal", path: "/portal" }];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      aria-label="Primary navigation"
      className={`fixed inset-x-0 top-0 z-50 border-b bg-background/90 backdrop-blur-xl transition-all duration-300 ${
        scrolled ? "border-border/80 shadow-soft" : "border-transparent"
      }`}
    >
      <div className="page-container">
        <div className="flex h-[4.5rem] items-center justify-between gap-5">
          <Link to="/" className="group flex shrink-0 items-center gap-3" aria-label="Launch Indian River home">
            <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform duration-200 group-hover:-translate-y-0.5">
              <MapPin className="h-5 w-5" />
              <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-background bg-accent" />
            </span>
            <span className="hidden sm:block">
              <span className="block text-[0.95rem] font-extrabold leading-none tracking-[-0.03em] text-foreground">Launch Indian River</span>
              <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.19em] text-muted-foreground">Business launchpad</span>
            </span>
          </Link>

          <div className="hidden items-center rounded-xl border border-border/70 bg-muted/60 p-1 lg:flex">
            {navLinks.map((link) => {
              const active = isActivePath(location.pathname, link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition-all xl:px-3.5 ${
                    active
                      ? "bg-card text-foreground shadow-soft"
                      : "text-muted-foreground hover:bg-card/60 hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden shrink-0 items-center gap-1.5 lg:flex">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <Sun /> : <Moon />}
            </Button>

            {isAuthenticated ? (
              <>
                <Button asChild variant="outline" className="gap-2">
                  <Link to={workspacePath}>
                    {isConsultant || isProvider ? <Inbox /> : <LayoutDashboard />}
                    <span className="hidden xl:inline">{workspaceLabel}</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" onClick={() => logout()} title="Log out" aria-label="Log out">
                  <LogOut />
                </Button>
              </>
            ) : (
              <Button asChild variant="ghost" className="gap-2">
                <Link to="/account"><LogIn /> Log in</Link>
              </Button>
            )}

            {!isWorkspaceAccount && (
              <Button asChild className="ml-1 bg-accent text-white shadow-sm hover:bg-accent/90">
                <Link to="/survey"><Sparkles /> Start free</Link>
              </Button>
            )}
          </div>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden" aria-label="Open navigation menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[88vw] max-w-sm border-l-border/70 p-0">
              <SheetTitle className="sr-only">Navigation menu</SheetTitle>
              <div className="flex h-full flex-col">
                <div className="border-b border-border/70 p-6">
                  <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                      <MapPin className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block font-extrabold tracking-tight">Launch Indian River</span>
                      <span className="block text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Business launchpad</span>
                    </span>
                  </Link>
                </div>

                <div className="flex-1 space-y-1 p-4">
                  {navLinks.map((link) => {
                    const active = isActivePath(location.pathname, link.path);
                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        aria-current={active ? "page" : undefined}
                        onClick={() => setOpen(false)}
                        className={`block rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                          active ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
                        }`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </div>

                <div className="space-y-2 border-t border-border/70 p-4">
                  <Button variant="outline" className="w-full justify-start gap-2" onClick={toggleTheme}>
                    {isDark ? <Sun /> : <Moon />}
                    {isDark ? "Use light mode" : "Use dark mode"}
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start gap-2">
                    <Link to={isAuthenticated ? workspacePath : "/account"} onClick={() => setOpen(false)}>
                      {isAuthenticated ? (isWorkspaceAccount ? <Inbox /> : <LayoutDashboard />) : <LogIn />}
                      {isAuthenticated ? workspaceLabel : "Account sign in"}
                    </Link>
                  </Button>
                  {!isWorkspaceAccount && (
                    <Button asChild className="w-full bg-accent text-white hover:bg-accent/90">
                      <Link to="/survey" onClick={() => setOpen(false)}><Sparkles /> Start free</Link>
                    </Button>
                  )}
                  {isAuthenticated && (
                    <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => logout()}>
                      <LogOut /> Log out
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
