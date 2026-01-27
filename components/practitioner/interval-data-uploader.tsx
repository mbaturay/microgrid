"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { summarizeIntervalData } from "@/lib/model/engine";
import { IntervalData } from "@/lib/model/types";

export default function IntervalDataUploader({
  value,
  onChange,
  readOnly = false,
}: {
  value?: IntervalData;
  onChange: (data?: IntervalData) => void;
  readOnly?: boolean;
}) {
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    const text = await file.text();
    const lines = text.trim().split(/\r?\n/);
    if (!lines.length) return;

    const header = lines[0].split(",").map((cell) => cell.trim());
    const timestampIndex = header.findIndex((cell) =>
      cell.toLowerCase().includes("timestamp")
    );
    const valueIndex = header.findIndex((cell) =>
      ["kw", "kwh"].includes(cell.toLowerCase())
    );

    if (timestampIndex < 0 || valueIndex < 0) {
      setError("CSV must include Timestamp and kW/kWh columns.");
      return;
    }

    const unit = header[valueIndex].toLowerCase() === "kwh" ? "kWh" : "kW";

    const rows = lines.slice(1).map((line) => {
      const cols = line.split(",");
      return {
        timestamp: cols[timestampIndex],
        value: Number(cols[valueIndex]),
      };
    });

    const qa = summarizeIntervalData(rows);
    setError(null);
    onChange({ rows, unit, qa });
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Interval Data Upload</CardTitle>
          <Badge className="bg-ink/10 text-ink">CSV</Badge>
        </div>
        <p className="text-sm text-ink/60">
          Timestamp format: YYYY-MM-DD HH:MM:SS. Second column must be kW or kWh.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <input
          type="file"
          accept=".csv"
          disabled={readOnly}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        {value && (
          <div className="rounded-2xl border border-ink/10 bg-mist p-4 text-sm">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={value.qa.status === "ok" ? "bg-jade/20 text-ink" : "bg-sun/20 text-ink"}>
                QA {value.qa.status.toUpperCase()}
              </Badge>
              <span>{value.rows.length} rows</span>
              <span>{value.unit}</span>
            </div>
            <div className="mt-3 grid gap-2 text-xs text-ink/60 md:grid-cols-3">
              <div>Duplicates: {value.qa.duplicates}</div>
              <div>Outliers: {value.qa.outliers}</div>
              <div>Missing Months: {value.qa.missingMonths}</div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="mt-3"
              onClick={() => onChange(undefined)}
              disabled={readOnly}
            >
              Clear upload
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
