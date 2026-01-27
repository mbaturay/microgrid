"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";
import { ModelOutputs } from "@/lib/model/types";

const statusColor: Record<string, string> = {
  computed: "bg-jade/20 text-ink",
  partial: "bg-sun/20 text-ink",
  stubbed: "bg-ink/10 text-ink",
};

export default function OutputsPanel({ outputs }: { outputs: ModelOutputs }) {
  return (
    <Card className="sticky top-24 h-fit">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Live Outputs</CardTitle>
          <Badge className={statusColor[outputs.status]}>
            {outputs.status.toUpperCase()}
          </Badge>
        </div>
        <p className="text-sm text-ink/60">
          Updates on every variable edit.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <OutputRow label="Net Present Value" value={formatCurrency(outputs.npv)} />
        <OutputRow label="ROI" value={formatPercent(outputs.roi)} />
        <OutputRow
          label="Payback"
          value={`${formatNumber(outputs.paybackYears, 1)} yrs`}
        />
        <OutputRow label="Total CapEx" value={formatCurrency(outputs.totalCapex)} />
        <OutputRow
          label="Annual Savings"
          value={formatCurrency(outputs.annualSavings)}
        />
        <OutputRow
          label="Total Tax Benefit"
          value={formatCurrency(outputs.totalTaxBenefit)}
        />
        <div className="rounded-2xl border border-ink/10 bg-mist p-3 text-xs text-ink/60">
          Computed outputs use the local POC engine. Items flagged as partial are
          derived from simplified formulas.
        </div>
      </CardContent>
    </Card>
  );
}

function OutputRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-ink/60">{label}</span>
      <span className="font-medium text-ink">{value}</span>
    </div>
  );
}
