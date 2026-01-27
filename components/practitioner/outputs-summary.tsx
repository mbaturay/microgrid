"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ModelOutputs } from "@/lib/model/types";
import { formatCurrency, formatPercent, formatNumber } from "@/lib/utils";

export default function OutputsSummary({ outputs }: { outputs: ModelOutputs }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Green Ink Summary</CardTitle>
            <Badge className="bg-jade/20 text-ink">Executive View</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-ink/70">
          <div className="rounded-2xl border border-ink/10 bg-mist p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-ink/50">
              Outcome Narrative
            </p>
            <p className="mt-2">
              Project is trending toward a {formatPercent(outputs.roi)} ROI with
              payback in {formatNumber(outputs.paybackYears, 1)} years. CapEx is
              modeled at {formatCurrency(outputs.totalCapex)}.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Stat label="NPV" value={formatCurrency(outputs.npv)} />
            <Stat label="Annual Savings" value={formatCurrency(outputs.annualSavings)} />
            <Stat label="Tax Benefit" value={formatCurrency(outputs.totalTaxBenefit)} />
            <Stat label="Output Status" value={outputs.status.toUpperCase()} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Download Center</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full">Export JSON (Live)</Button>
          <Button className="w-full" variant="outline">
            Export CSV (Live)
          </Button>
          <Button className="w-full" variant="ghost" disabled>
            Export PDF (Coming Soon)
          </Button>
          <p className="text-xs text-ink/50">
            Computed outputs are live. Items labeled &quot;Coming Soon&quot; are mocked.
          </p>
        </CardContent>
      </Card>
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
