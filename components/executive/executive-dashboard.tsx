"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, ArrowUpRight, Leaf, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency, formatNumber, formatPercent } from "@/lib/utils";
import { loadPortfolio, savePortfolio } from "@/lib/model/storage";
import { ProjectModel } from "@/lib/model/types";

type LensMode = "executive" | "practitioner";

const STAGES = ["Proposed", "Analysis", "Green Ink", "Construction", "Complete"];

function useAnimatedNumber(value: number, duration = 900) {
  const [display, setDisplay] = useState(0);
  const previousRef = useRef(0);

  useEffect(() => {
    let frame: number;
    const start = performance.now();
    const from = previousRef.current;

    const tick = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      const next = from + (value - from) * progress;
      setDisplay(next);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  useEffect(() => {
    previousRef.current = value;
  }, [value]);

  return display;
}

function computeMetrics(projects: ProjectModel[]) {
  const totalProjects = projects.length;
  const totalCapacity = projects.reduce((sum, p) => sum + p.capacityMw, 0);
  const totalInvestment = projects.reduce(
    (sum, p) => sum + p.outputs.totalCapex,
    0
  );
  const avgRoi =
    projects.reduce((sum, p) => sum + p.outputs.roi, 0) /
    (projects.length || 1);
  const avgPayback =
    projects.reduce((sum, p) => sum + p.outputs.paybackYears, 0) /
    (projects.length || 1);
  const carbonOffset = totalCapacity * 1100;

  return {
    totalProjects,
    totalCapacity,
    totalInvestment,
    avgRoi,
    avgPayback,
    carbonOffset,
  };
}

export default function ExecutiveDashboard({
  lens = "executive",
}: {
  lens?: LensMode;
}) {
  const [projects, setProjects] = useState<ProjectModel[]>([]);

  useEffect(() => {
    const data = loadPortfolio();
    setProjects(data);
    savePortfolio(data);
  }, []);

  const metrics = useMemo(() => computeMetrics(projects), [projects]);
  const animatedInvestment = useAnimatedNumber(metrics.totalInvestment);
  const animatedCapacity = useAnimatedNumber(metrics.totalCapacity);
  const animatedCarbon = useAnimatedNumber(metrics.carbonOffset);

  const stageCounts = STAGES.map(
    (stage) => projects.filter((project) => project.stage === stage).length
  );

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-3xl border border-ink/10 bg-white p-8 shadow-soft">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-ink/50">
                {lens === "executive"
                  ? "Executive Portfolio Overview"
                  : "Practitioner Portfolio Overview"}
              </p>
              <h1 className="mt-2 text-3xl font-semibold">
                Solar & Microgrid Portfolio Command Center
              </h1>
              <p className="mt-3 max-w-xl text-sm text-ink/60">
                {lens === "executive"
                  ? "Read-only analytics for leadership visibility across pipeline, investment exposure, and ROI cadence."
                  : "Portfolio view for selecting a project workspace. Changes happen inside project detail."}
              </p>
            </div>
            <Badge className={lens === "executive" ? "bg-jade/10 text-jade" : "bg-sun/20 text-ink"}>
              {lens === "executive" ? "Read-only" : "Editable"}
            </Badge>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Badge className="bg-ink/10 text-ink">Portfolio Health: Stable</Badge>
            <Badge className="bg-sun/20 text-ink">$12.4M in review</Badge>
            <Badge className="bg-teal/10 text-teal">4 new projects this quarter</Badge>
          </div>
        </div>
        <Card className="gradient-sheen border-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-4 w-4 text-sun" />
              Executive Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl bg-white/70 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-ink/50">
                Risk Queue
              </p>
              <p className="mt-2 text-sm text-ink/70">
                3 sites require updated interval data QA.
              </p>
            </div>
            <div className="rounded-xl bg-white/70 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-ink/50">
                Decision Window
              </p>
              <p className="mt-2 text-sm text-ink/70">
                5 projects ready for Green Ink review.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <Card className="kpi-card">
          <CardHeader>
            <CardTitle>Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">
              {formatNumber(metrics.totalProjects)}
            </div>
            <p className="text-sm text-ink/60">Across 5 regions</p>
          </CardContent>
        </Card>
        <Card className="kpi-card">
          <CardHeader>
            <CardTitle>Total Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">
              {formatNumber(animatedCapacity, 1)} MW
            </div>
            <p className="text-sm text-ink/60">Pipeline capacity</p>
          </CardContent>
        </Card>
        <Card className="kpi-card">
          <CardHeader>
            <CardTitle>Total Investment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">
              {formatCurrency(animatedInvestment)}
            </div>
            <p className="text-sm text-ink/60">CapEx exposure</p>
          </CardContent>
        </Card>
        <Card className="kpi-card">
          <CardHeader>
            <CardTitle>Avg ROI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">
              {formatPercent(metrics.avgRoi)}
            </div>
            <p className="text-sm text-ink/60">Portfolio mean</p>
          </CardContent>
        </Card>
        <Card className="kpi-card">
          <CardHeader>
            <CardTitle>Avg Payback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">
              {formatNumber(metrics.avgPayback, 1)} yrs
            </div>
            <p className="text-sm text-ink/60">Time to breakeven</p>
          </CardContent>
        </Card>
        <Card className="kpi-card">
          <CardHeader>
            <CardTitle>Carbon Offset</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">
              {formatNumber(animatedCarbon, 0)} tCO₂
            </div>
            <p className="text-sm text-ink/60">Annual impact</p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="rounded-3xl border border-ink/10 bg-white p-6 shadow-soft"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Pipeline Stages</h2>
              <p className="text-sm text-ink/60">
                Progress snapshot across active projects.
              </p>
            </div>
            <Badge className="bg-ink/10 text-ink">This quarter</Badge>
          </div>
          <div className="mt-6 space-y-4">
            {STAGES.map((stage, index) => (
              <div key={stage} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>{stage}</span>
                  <span className="text-ink/60">{stageCounts[index]} projects</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-mist">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      stage === "Green Ink" ? "bg-jade" : "bg-teal"
                    )}
                    style={{
                      width: `${
                        (stageCounts[index] / Math.max(projects.length, 1)) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="rounded-3xl border border-ink/10 bg-white p-6 shadow-soft"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Live Portfolio Map</h2>
              <p className="text-sm text-ink/60">Clickable regional clusters.</p>
            </div>
            <MapPin className="h-5 w-5 text-teal" />
          </div>
          <div className="relative mt-6 h-64 overflow-hidden rounded-2xl bg-[radial-gradient(circle_at_20%_20%,rgba(255,181,31,0.25),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(11,133,98,0.2),transparent_50%),linear-gradient(135deg,#f6f7f8,#ffffff)]">
            {projects.slice(0, 14).map((project, index) => (
              <button
                key={project.id}
                className="group absolute"
                style={{
                  left: `${12 + (index * 7) % 80}%`,
                  top: `${18 + (index * 11) % 60}%`,
                }}
              >
                <span className="flex h-3 w-3 rounded-full bg-jade shadow-lg ring-4 ring-jade/20 transition group-hover:scale-125" />
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-ink/50">
            Map is illustrative with sanitized coordinates.
          </p>
        </motion.div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="rounded-3xl border border-ink/10 bg-white p-6 shadow-soft"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Recent Projects</h2>
              <p className="text-sm text-ink/60">
                Deep-link into the calculator workspace.
              </p>
            </div>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
          <div className="mt-6 space-y-4">
            {projects.slice(0, 5).map((project) => (
              <Link
                key={project.id}
                href={`/project/${project.id}?lens=${lens}`}
                className="flex items-center justify-between rounded-2xl border border-ink/10 bg-white px-4 py-3 transition hover:border-jade/40"
              >
                <div>
                  <p className="font-medium">{project.name}</p>
                  <p className="text-xs text-ink/50">
                    {project.region} · {project.stage}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-sm text-ink/60">
                  <span>{formatPercent(project.outputs.roi, 1)} ROI</span>
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="rounded-3xl border border-ink/10 bg-white p-6 shadow-soft"
        >
          <div className="flex items-center gap-2">
            <Leaf className="h-4 w-4 text-jade" />
            <h2 className="text-xl font-semibold">Executive Summary</h2>
          </div>
          <div className="mt-6 space-y-4 text-sm text-ink/70">
            <p>
              Portfolio is trending ahead of ROI targets. Four projects reach Green
              Ink within the next 30 days.
            </p>
            <div className="rounded-2xl border border-ink/10 bg-mist p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-ink/50">
                Priority Actions
              </p>
              <ul className="mt-3 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-jade" />
                  Approve interval data QA for 3 sites.
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-sun" />
                  Review CapEx revisions for MW-12.
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-teal" />
                  Confirm track selection on two off-grid facilities.
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
