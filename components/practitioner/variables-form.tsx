"use client";

import schemaData from "@/lib/model/generated/variables.schema.json";
import { VariableSchema, VariableSchemaItem } from "@/lib/model/types";
import { cn, formatCurrency, formatPercent } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const schema = schemaData as VariableSchema;

export default function VariablesForm({
  values,
  onChange,
  onReset,
  readOnly = false,
}: {
  values: Record<string, number | string | boolean>;
  onChange: (key: string, value: number | string | boolean) => void;
  onReset: (key: string, defaultValue: number | string | boolean | undefined) => void;
  readOnly?: boolean;
}) {
  return (
    <div className="space-y-6">
      {schema.sections.map((section) => (
        <Card key={section.title}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{section.title}</CardTitle>
                {section.description && (
                  <p className="text-sm text-ink/60">{section.description}</p>
                )}
              </div>
              <Badge className="bg-ink/10 text-ink">
                {section.variables.length} inputs
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            {section.variables.map((variable) => (
              <VariableRow
                key={variable.key}
                variable={variable}
                value={values[variable.key]}
                onChange={onChange}
                onReset={onReset}
                readOnly={readOnly}
              />
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function VariableRow({
  variable,
  value,
  onChange,
  onReset,
  readOnly,
}: {
  variable: VariableSchemaItem;
  value: number | string | boolean | undefined;
  onChange: (key: string, value: number | string | boolean) => void;
  onReset: (key: string, defaultValue: number | string | boolean | undefined) => void;
  readOnly: boolean;
}) {
  const displayValue = value ?? variable.default ?? "";

  return (
    <div className="grid gap-3 rounded-2xl border border-ink/10 bg-white px-4 py-3 md:grid-cols-[1.4fr_1fr_auto] md:items-center">
      <div>
        <p className="text-sm font-medium text-ink">{variable.label}</p>
        <p className="text-xs text-ink/50">
          {variable.unit ? `${variable.unit} · ` : ""}Cell {variable.cell ?? "—"}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {renderInput(variable, displayValue, onChange, readOnly)}
        {variable.type === "percent" && (
          <span className="text-xs text-ink/50">{formatPercent(Number(displayValue) || 0)}</span>
        )}
        {variable.type === "currency" && (
          <span className="text-xs text-ink/50">{formatCurrency(Number(displayValue) || 0)}</span>
        )}
      </div>
      <div className="flex justify-end">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onReset(variable.key, variable.default)}
          disabled={readOnly}
        >
          Reset
        </Button>
      </div>
    </div>
  );
}

function renderInput(
  variable: VariableSchemaItem,
  value: number | string | boolean,
  onChange: (key: string, value: number | string | boolean) => void,
  readOnly: boolean
) {
  switch (variable.type) {
    case "boolean":
      return (
        <Switch
          checked={Boolean(value)}
          onCheckedChange={(checked) => onChange(variable.key, checked)}
          disabled={readOnly}
        />
      );
    case "enum":
      return (
        <Select
          value={String(value)}
          onValueChange={(next) => onChange(variable.key, next)}
          disabled={readOnly}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            {(variable.options ?? []).map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    default:
      return (
        <Input
          type={variable.type === "date" ? "date" : "number"}
          value={String(value)}
          min={variable.min}
          max={variable.max}
          disabled={readOnly}
          onChange={(event) => {
            const nextValue =
              variable.type === "string"
                ? event.target.value
                : Number(event.target.value);
            onChange(variable.key, nextValue);
          }}
          className={cn(
            "w-full",
            variable.type === "string" && "text-left"
          )}
        />
      );
  }
}
