export type VariableType =
  | "number"
  | "percent"
  | "currency"
  | "boolean"
  | "enum"
  | "date"
  | "string";

export interface VariableSchemaItem {
  key: string;
  label: string;
  cell?: string;
  type: VariableType;
  unit?: string;
  min?: number;
  max?: number;
  options?: string[];
  default?: number | string | boolean;
  section?: string;
  description?: string;
}

export interface VariableSchema {
  sections: {
    title: string;
    description?: string;
    variables: VariableSchemaItem[];
  }[];
}

export type TrackType = "track-1" | "track-2" | "track-3";

export type OutputStatus = "computed" | "partial" | "stubbed";

export interface ModelOutputs {
  npv: number;
  roi: number;
  paybackYears: number;
  totalCapex: number;
  annualSavings: number;
  totalTaxBenefit: number;
  status: OutputStatus;
  computed: string[];
  stubbed: string[];
}

export interface IntervalQA {
  duplicates: number;
  missingMonths: number;
  outliers: number;
  totalRows: number;
  status: "ok" | "warn";
}

export interface IntervalData {
  rows: { timestamp: string; value: number }[];
  unit: "kW" | "kWh";
  qa: IntervalQA;
}

export interface ProjectModel {
  id: string;
  name: string;
  stage: string;
  region: string;
  location: { lat: number; lng: number };
  capacityMw: number;
  variables: Record<string, number | string | boolean>;
  track: TrackType;
  intervalData?: IntervalData;
  outputs: ModelOutputs;
}

export interface PortfolioMetrics {
  totalProjects: number;
  totalCapacityMw: number;
  totalInvestment: number;
  avgRoi: number;
  avgPayback: number;
  carbonOffset: number;
}
