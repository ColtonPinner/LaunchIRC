import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Progress } from "@heroui/progress";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  CircleDashed,
  MapPin,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const checklist = [
  { label: "Choose your business structure", detail: "Florida registration", done: true },
  { label: "Apply for your EIN", detail: "Federal tax ID", done: true },
  { label: "Confirm property zoning", detail: "Commercial C-1", active: true },
  { label: "Get your local tax receipt", detail: "Indian River County" },
  { label: "Review permits and inspections", detail: "Based on your location" },
];

const proofPoints = [
  { value: "6", label: "local guide categories" },
  { value: "1", label: "personalized launch plan" },
  { value: "Free", label: "to build your roadmap" },
];

export default function HeroSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative isolate overflow-hidden border-b border-border/70 bg-background">
      <div className="dot-grid absolute inset-0 -z-20 opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent_86%)]" />
      <div className="absolute -left-24 top-12 -z-10 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute right-0 top-0 -z-10 h-[34rem] w-[34rem] rounded-full bg-teal-500/[0.08] blur-3xl dark:bg-teal-300/[0.07]" />

      <div className="page-container py-20 sm:py-24 lg:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-20">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <Chip
              variant="flat"
              startContent={<MapPin className="h-3.5 w-3.5" />}
              classNames={{
                base: "mb-7 h-8 border border-accent/20 bg-accent/10 px-1.5 text-accent",
                content: "text-xs font-bold tracking-wide",
              }}
            >
              Built for Indian River County
            </Chip>

            <h1 className="max-w-3xl text-5xl font-extrabold leading-[0.98] text-foreground sm:text-6xl lg:text-[4.5rem]">
              Your local roadmap to <span className="text-accent">opening day.</span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-muted-foreground sm:text-xl">
              Turn your business idea into a clear, step-by-step launch plan—with local guidance for zoning, permits, funding, and compliance.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button
                as={Link}
                to="/survey"
                size="lg"
                radius="lg"
                endContent={<ArrowRight className="h-4 w-4" />}
                className="h-12 w-full bg-accent px-6 text-[0.9375rem] font-bold text-accent-foreground shadow-lg shadow-accent/20 transition-transform hover:-translate-y-0.5 sm:w-auto"
              >
                Build my free roadmap
              </Button>
              <Button
                as={Link}
                to="/guides"
                size="lg"
                radius="lg"
                variant="bordered"
                className="h-12 w-full border-border bg-card/70 px-6 text-[0.9375rem] font-bold text-foreground backdrop-blur-sm sm:w-auto"
              >
                Explore local guides
              </Button>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-accent" />
                Local expert-reviewed information
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-4 w-4 text-accent" />
                No credit card required
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.08, ease: "easeOut" }}
            className="relative mx-auto w-full max-w-xl"
          >
            <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-accent/20 via-transparent to-teal-500/10 blur-2xl" />
            <Card className="glass-panel overflow-hidden rounded-[1.75rem]" shadow="none">
              <CardBody className="p-0">
                <div className="flex items-center justify-between border-b border-border/70 px-5 py-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">Coffee shop launch plan</p>
                      <p className="text-xs text-muted-foreground">Vero Beach, Florida</p>
                    </div>
                  </div>
                  <Chip
                    size="sm"
                    variant="flat"
                    classNames={{ base: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400", content: "font-bold" }}
                  >
                    In progress
                  </Chip>
                </div>

                <div className="p-5 sm:p-6">
                  <div className="mb-5 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Launch progress</p>
                      <p className="mt-1 text-2xl font-extrabold tracking-tight text-foreground">2 of 5 complete</p>
                    </div>
                    <span className="text-sm font-bold text-accent">40%</span>
                  </div>
                  <Progress
                    aria-label="Launch plan progress"
                    value={40}
                    size="sm"
                    classNames={{ track: "h-2 bg-muted", indicator: "bg-accent" }}
                  />

                  <div className="mt-6 space-y-2.5">
                    {checklist.map((item, index) => (
                      <div
                        key={item.label}
                        className={`items-center gap-3 rounded-xl border px-3.5 py-3 sm:px-4 ${
                          index === checklist.length - 1 ? "hidden sm:flex" : "flex"
                        } ${
                          item.active
                            ? "border-accent/25 bg-accent/[0.07]"
                            : "border-transparent bg-muted/60"
                        }`}
                      >
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                            item.done
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : item.active
                              ? "bg-accent/20 text-accent"
                              : "bg-card text-muted-foreground"
                          }`}
                        >
                          {item.done ? <CheckCircle2 className="h-4 w-4" /> : <CircleDashed className="h-4 w-4" />}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className={`block truncate text-sm font-bold ${item.done ? "text-muted-foreground" : "text-foreground"}`}>
                            {item.label}
                          </span>
                          <span className="block truncate text-xs text-muted-foreground">{item.detail}</span>
                        </span>
                        {item.active && <ArrowRight className="h-4 w-4 shrink-0 text-accent" />}
                      </div>
                    ))}
                  </div>
                </div>
              </CardBody>
            </Card>

            <div className="absolute -bottom-5 -left-5 hidden items-center gap-3 rounded-2xl border border-border/70 bg-card px-4 py-3 shadow-elevated sm:flex">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs font-bold text-foreground">Personalized for you</p>
                <p className="text-[11px] text-muted-foreground">Based on your business and location</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-20 grid divide-y divide-border/70 rounded-2xl border border-border/70 bg-card/70 shadow-soft backdrop-blur sm:grid-cols-3 sm:divide-x sm:divide-y-0 lg:mt-24">
          {proofPoints.map((item) => (
            <div key={item.label} className="flex items-baseline gap-3 px-6 py-5 sm:block sm:text-center lg:flex lg:justify-center lg:text-left">
              <span className="text-2xl font-extrabold tracking-tight text-foreground">{item.value}</span>
              <span className="text-sm text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
