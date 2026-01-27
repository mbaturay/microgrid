"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Leaf, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { loadPortfolio, savePortfolio } from "@/lib/model/storage";
import { ProjectModel } from "@/lib/model/types";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";

export default function ExecutiveProject({ projectId }: { projectId: string }) {
  const [projects, setProjects] = useState<ProjectModel[]>([]);

  useEffect(() => {
    const data = loadPortfolio();
    setProjects(data);
    savePortfolio(data);
  }, []);

  const project = useMemo(
    () => projects.find((item) => item.id === projectId),
    [projects, projectId]
  );

  if (!project) {
    return (
      <Card>
        <CardContent className="p-6">Loading project summary…</CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-ink/10 bg-white p-6 shadow-soft">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-ink/50">
              Executive Lens · Project Detail
            </p>
            <h1 className="mt-2 text-3xl font-semibold">{project.name}</h1>
            <p className="mt-2 text-sm text-ink/60">
              {project.region} · {project.stage} · {formatNumber(project.capacityMw, 1)} MW
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-jade/10 text-jade">Read-only</Badge>
            <Badge className="bg-ink/10 text-ink">
              <Lock className="mr-1 h-3 w-3" />
              Calculated tables locked
            </Badge>
          </div>
        </div>
        <Separator className="my-6" />
        <div className="grid gap-4 md:grid-cols-3">
          <Stat label="Total CapEx" value={formatCurrency(project.outputs.totalCapex)} />
          <Stat label="ROI" value={formatPercent(project.outputs.roi)} />
          <Stat
            label="Payback"
            value={`${formatNumber(project.outputs.paybackYears, 1)} yrs`}
          />
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={`/practitioner/${project.id}`}>
            <Button size="sm">
              Open Practitioner Workspace
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </Link>
          <Button size="sm" variant="outline">
            Download Executive Brief
          </Button>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Context</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-ink/70">
            <div className="rounded-2xl border border-ink/10 bg-mist p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-ink/50">
                Executive Summary
              </p>
              <p className="mt-2">
                Project is tracking to {formatPercent(project.outputs.roi)} ROI with
                {formatNumber(project.outputs.paybackYears, 1)} year payback. CapEx
                exposure is {formatCurrency(project.outputs.totalCapex)}.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Stat label="NPV" value={formatCurrency(project.outputs.npv)} />
              <Stat label="Annual Savings" value={formatCurrency(project.outputs.annualSavings)} />
              <Stat label="Tax Benefit" value={formatCurrency(project.outputs.totalTaxBenefit)} />
              <Stat label="Output Status" value={project.outputs.status.toUpperCase()} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Leaf className="h-4 w-4 text-jade" />
              <CardTitle>Decision Signals</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-ink/70">
            <div className="rounded-2xl border border-ink/10 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-ink/50">
                Pipeline Stage
              </p>
              <p className="mt-2 text-lg font-semibold text-ink">{project.stage}</p>
            </div>
            <div className="rounded-2xl border border-ink/10 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-ink/50">
                Track Selection
              </p>
              <p className="mt-2 text-lg font-semibold text-ink">
                {project.track.replace("track-", "Track ")}
              </p>
            </div>
            <div className="rounded-2xl border border-ink/10 bg-mist p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-ink/50">
                Next Action
              </p>
              <p className="mt-2">
                Validate interval data QA and confirm Green Ink readiness.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-white px-4 py-3">
      <p className="text-xs uppercase tracking-[0.2em] text-ink/50">{label}</p>
      <p className="mt-2 text-lg font-semibold text-ink">{value}</p>
    </div>
  );
}
