import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Inbox, LayoutDashboard, LogIn, LogOut, Menu, Moon, Sparkles, Sun } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useTheme } from "@/lib/ThemeContext";

const baseNavLinks = [
  { label: "Home", path: "/" },
  { label: "Guides", path: "/guides" },
  { label: "Directory", path: "/directory" },
  { label: "Events", path: "/events" },
  { label: "The B4 Brief", path: "/the-b4-brief" },
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
      className={`site-navigation fixed inset-x-0 top-0 z-50 border-b bg-background/90 backdrop-blur-xl transition-all duration-300 ${
        scrolled ? "border-border shadow-sm" : "border-transparent"
      }`}
    >
      <div className="page-container">
        <div className="flex h-20 items-center justify-between gap-5">
          <Link to="/" className="group flex shrink-0 items-center" aria-label="Launch Indian River home">
            <span className="relative flex h-12 w-32 items-center justify-center overflow-hidden rounded-xl transition-transform duration-200 group-hover:-translate-y-0.5">
              <img
                src="/b4irc-logo.png"
                alt="B4IRC logo"
                className="h-9 w-auto object-contain"
                style={{ filter: isDark ? "none" : "invert(1)" }}
              />
            </span>
          </Link>

          <div className="hidden items-center rounded-xl border border-border/70 bg-card/80 p-1 lg:flex">
            {navLinks.map((link) => {
              const active = isActivePath(location.pathname, link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-all xl:px-3.5 ${
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
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
              <Button asChild className="ml-1">
                <Link to="/survey"><Sparkles /> Start free</Link>
              </Button>
            )}
          </div>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[88vw] max-w-sm border-l-border/70 p-0">
              <SheetTitle className="sr-only">Navigation menu</SheetTitle>
              <div className="flex h-full flex-col">
                <div className="border-b border-border/70 p-6">
                  <Link to="/" onClick={() => setOpen(false)} className="flex items-center">
                    <span className="flex h-10 w-24 items-center justify-center overflow-hidden rounded-xl">
                      <img
                        src="/b4irc-logo.png"
                        alt="B4IRC logo"
                        className="h-6 w-auto object-contain"
                        style={{ filter: isDark ? "none" : "invert(1)" }}
                      />
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
                    <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
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
