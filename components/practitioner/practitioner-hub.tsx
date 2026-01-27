"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Download, UploadCloud, Lock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { loadPortfolio, savePortfolio } from "@/lib/model/storage";
import { computeOutputs } from "@/lib/model/engine";
import { ProjectModel, TrackType } from "@/lib/model/types";
import { formatCurrency, formatPercent } from "@/lib/utils";
import TrackSelector from "@/components/practitioner/track-selector";
import VariablesForm from "@/components/practitioner/variables-form";
import OutputsPanel from "@/components/practitioner/outputs-panel";
import IntervalDataUploader from "@/components/practitioner/interval-data-uploader";
import OutputsSummary from "@/components/practitioner/outputs-summary";

const tabList = [
  "Overview",
  "Budget",
  "Model Variables",
  "Interval Data",
  "Utility Baseline",
  "Solar Baseline",
  "Consumption",
  "Outputs",
];

type LensMode = "executive" | "practitioner";

export default function PractitionerHub({
  projectId,
  mode = "practitioner",
}: {
  projectId?: string;
  mode?: LensMode;
}) {
  const [projects, setProjects] = useState<ProjectModel[]>([]);
  const [activeId, setActiveId] = useState<string | undefined>(projectId);

  useEffect(() => {
    const loaded = loadPortfolio();
    setProjects(loaded);
    if (!activeId && loaded.length) setActiveId(loaded[0].id);
  }, [activeId]);

  const activeProject = useMemo(
    () => projects.find((project) => project.id === activeId),
    [projects, activeId]
  );

  const updateProject = (updated: ProjectModel) => {
    const next = projects.map((project) =>
      project.id === updated.id ? updated : project
    );
    setProjects(next);
    savePortfolio(next);
  };

  const handleVariableChange = (key: string, value: number | string | boolean) => {
    if (!activeProject) return;
    const variables = { ...activeProject.variables, [key]: value };
    const outputs = computeOutputs(variables, activeProject.intervalData, activeProject.track);
    updateProject({ ...activeProject, variables, outputs });
  };

  const handleReset = (key: string, defaultValue: number | string | boolean | undefined) => {
    if (!activeProject) return;
    const nextValue = defaultValue ?? "";
    handleVariableChange(key, nextValue);
  };

  const handleTrackChange = (track: TrackType) => {
    if (!activeProject) return;
    const outputs = computeOutputs(activeProject.variables, activeProject.intervalData, track);
    updateProject({ ...activeProject, track, outputs });
  };

  const handleIntervalChange = (intervalData?: ProjectModel["intervalData"]) => {
    if (!activeProject) return;
    const outputs = computeOutputs(activeProject.variables, intervalData, activeProject.track);
    updateProject({ ...activeProject, intervalData, outputs });
  };

  const exportJson = () => {
    if (!activeProject) return;
    const blob = new Blob([JSON.stringify(activeProject, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${activeProject.name.replace(/\s+/g, "-").toLowerCase()}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const importJson = async (file: File) => {
    if (!activeProject) return;
    const text = await file.text();
    const imported = JSON.parse(text) as ProjectModel;
    updateProject({ ...activeProject, ...imported });
  };

  if (!activeProject) {
    return (
      <Card>
        <CardContent className="p-6">Loading project workspace...</CardContent>
      </Card>
    );
  }

  const isExecutive = mode === "executive";

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-soft">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-ink/50">
                {isExecutive ? "Executive Lens" : "Practitioner Workspace"}
              </p>
              <h1 className="mt-2 text-3xl font-semibold">
                {activeProject.name}
              </h1>
              <p className="mt-2 text-sm text-ink/60">
                {activeProject.region} · {activeProject.stage}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 rounded-full bg-mist p-1">
                <Link
                  href={`/project/${activeProject.id}?lens=executive`}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                    isExecutive ? "bg-white text-ink shadow" : "text-ink/60"
                  }`}
                >
                  Executive
                </Link>
                <Link
                  href={`/project/${activeProject.id}?lens=practitioner`}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                    !isExecutive ? "bg-white text-ink shadow" : "text-ink/60"
                  }`}
                >
                  Practitioner
                </Link>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={exportJson}
                disabled={isExecutive}
              >
                <Download className="h-4 w-4" />
                Export Project JSON
              </Button>
              <label className={`inline-flex items-center gap-2 rounded-full border border-ink/20 px-4 py-2 text-sm font-medium text-ink/70 ${isExecutive ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-mist"}`}>
                <UploadCloud className="h-4 w-4" />
                Import JSON
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  disabled={isExecutive}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) importJson(file);
                  }}
                />
              </label>
            </div>
          </div>
          <Separator className="my-6" />
          <div className="grid gap-4 md:grid-cols-3">
            <SummaryStat label="CapEx" value={formatCurrency(activeProject.outputs.totalCapex)} />
            <SummaryStat label="ROI" value={formatPercent(activeProject.outputs.roi)} />
            <SummaryStat
              label="Annual Savings"
              value={formatCurrency(activeProject.outputs.annualSavings)}
            />
          </div>
          {isExecutive && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-ink/5 px-3 py-1 text-xs text-ink/60">
              <Lock className="h-3 w-3" />
              Executive lens is view-only. Switch to Practitioner to edit inputs.
            </div>
          )}
        </div>
        <TrackSelector
          value={activeProject.track}
          onChange={handleTrackChange}
          disabled={isExecutive}
        />
      </section>

      <section>
        <Tabs defaultValue={tabList[0]}>
          <TabsList className="flex flex-wrap gap-2">
            {tabList.map((tab) => (
              <TabsTrigger key={tab} value={tab}>
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="Overview">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid gap-6 lg:grid-cols-[1.4fr_1fr]"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Guided Workflow</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-ink/70">
                  <p>
                    Start by confirming the Track selection, then refine Model
                    Variables and Budget Intake. Calculated tables are locked.
                  </p>
                  <div className="rounded-2xl border border-ink/10 bg-mist p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-ink/50">
                      Workflow Cue
                    </p>
                    <ol className="mt-3 space-y-2">
                      <li>1. Select Track + confirm scenario intent.</li>
                      <li>2. Update Model Variables and Budget Intake.</li>
                      <li>3. Upload interval data and validate QA.</li>
                      <li>4. Review outputs and export summary.</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
              <OutputsPanel outputs={activeProject.outputs} />
            </motion.div>
          </TabsContent>

          <TabsContent value="Budget">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Budget Intake (Read-only)</CardTitle>
                  <Badge className="bg-ink/10 text-ink">
                    <Lock className="mr-1 h-3 w-3" />
                    Locked
                  </Badge>
                </div>
                <p className="text-sm text-ink/60">
                  Do not edit calculated tables. Update Model Variables instead.
                </p>
              </CardHeader>
              <CardContent>
                <div className="data-grid p-4">
                  <div className="grid grid-cols-3 text-xs uppercase tracking-[0.2em] text-ink/50">
                    <span>Category</span>
                    <span>Assumption</span>
                    <span>Value</span>
                  </div>
                  <div className="mt-3 space-y-2 text-sm">
                    <Row label="Solar CapEx" value={formatCurrency(activeProject.variables.capex_total as number)} />
                    <Row label="Battery CapEx" value={formatCurrency(620000)} />
                    <Row label="Construction" value={formatCurrency(410000)} />
                    <Row label="Soft Costs" value={formatCurrency(185000)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="Model Variables">
            <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
              <VariablesForm
                values={activeProject.variables}
                onChange={handleVariableChange}
                onReset={handleReset}
                readOnly={isExecutive}
              />
              <OutputsPanel outputs={activeProject.outputs} />
            </div>
          </TabsContent>

          <TabsContent value="Interval Data">
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <IntervalDataUploader
                value={activeProject.intervalData}
                onChange={handleIntervalChange}
                readOnly={isExecutive}
              />
              <Card>
                <CardHeader>
                  <CardTitle>QA Expectations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-ink/70">
                  <p>
                    CSV must include a Timestamp column (YYYY-MM-DD HH:MM:SS) and
                    a second column labeled kW or kWh.
                  </p>
                  <ul className="space-y-2">
                    <li>• Duplicate timestamps flagged.</li>
                    <li>• Missing months and outliers surfaced.</li>
                    <li>• No editing calculated tables here.</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="Utility Baseline">
            <Card>
              <CardHeader>
                <CardTitle>Utility Baseline (Read-only)</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-ink/70">
                Baseline tables are computed. Update Model Variables or Interval
                Data to adjust.
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="Solar Baseline">
            <Card>
              <CardHeader>
                <CardTitle>Solar Baseline (Read-only)</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-ink/70">
                Solar production tables are locked in this POC.
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="Consumption">
            <Card>
              <CardHeader>
                <CardTitle>Consumption Module</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-ink/70">
                Track selection adjusts consumption module visibility. Track {activeProject.track.replace("track-", "")} is active.
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="Outputs">
            <OutputsSummary outputs={activeProject.outputs} />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-white px-4 py-3">
      <p className="text-xs uppercase tracking-[0.2em] text-ink/50">{label}</p>
      <p className="mt-2 text-lg font-semibold text-ink">{value}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-3 text-sm">
      <span className="text-ink/70">{label}</span>
      <span className="text-ink/50">Calculated</span>
      <span className="text-ink">{value}</span>
    </div>
  );
}
