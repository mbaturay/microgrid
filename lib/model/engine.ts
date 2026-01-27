import { IntervalData, ModelOutputs, TrackType } from "@/lib/model/types";

const DEFAULT_OUTPUTS: ModelOutputs = {
  npv: 0,
  roi: 0,
  paybackYears: 0,
  totalCapex: 0,
  annualSavings: 0,
  totalTaxBenefit: 0,
  status: "stubbed",
  computed: [],
  stubbed: [
    "npv",
    "roi",
    "paybackYears",
    "totalCapex",
    "annualSavings",
    "totalTaxBenefit",
  ],
};

export function computeOutputs(
  variables: Record<string, number | string | boolean>,
  intervalData: IntervalData | undefined,
  track: TrackType
): ModelOutputs {
  const capex = Number(variables.capex_total ?? 3200000);
  const annualSavings = Number(variables.annual_savings ?? 540000);
  const taxBenefit = Number(variables.tax_benefit ?? 220000);
  const discountRate = Number(variables.discount_rate ?? 0.08);
  const projectLife = Number(variables.project_life_years ?? 20);
  const incentive = Number(variables.incentive_rate ?? 0.12);
  const contingency = Number(variables.contingency_rate ?? 0.08);

  const adjustedCapex = capex * (1 + contingency) * (1 - incentive);
  const roi = adjustedCapex > 0 ? annualSavings / adjustedCapex : 0;
  const paybackYears = annualSavings > 0 ? adjustedCapex / annualSavings : 0;
  const npv =
    annualSavings > 0
      ? Array.from({ length: projectLife }, (_, idx) => idx + 1).reduce(
          (sum, year) => sum + annualSavings / Math.pow(1 + discountRate, year),
          -adjustedCapex
        )
      : 0;

  const trackMultiplier = track === "track-2" ? 1.15 : track === "track-3" ? 0.92 : 1;
  const adjustedSavings = annualSavings * trackMultiplier;

  const computed = [
    "npv",
    "roi",
    "paybackYears",
    "totalCapex",
    "annualSavings",
    "totalTaxBenefit",
  ];

  return {
    npv,
    roi,
    paybackYears,
    totalCapex: adjustedCapex,
    annualSavings: adjustedSavings,
    totalTaxBenefit: taxBenefit,
    status: intervalData ? "computed" : "partial",
    computed,
    stubbed: intervalData ? [] : ["interval_savings_adjustment"],
  };
}

export function summarizeIntervalData(rows: { timestamp: string; value: number }[]) {
  const totalRows = rows.length;
  const timestamps = new Set<string>();
  let duplicates = 0;
  let outliers = 0;

  const values = rows.map((row) => row.value).filter((value) => !Number.isNaN(value));
  const mean = values.reduce((sum, value) => sum + value, 0) / (values.length || 1);
  const variance =
    values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) /
    (values.length || 1);
  const std = Math.sqrt(variance);

  const months = new Set<string>();

  rows.forEach((row) => {
    if (timestamps.has(row.timestamp)) {
      duplicates += 1;
    }
    timestamps.add(row.timestamp);

    const date = new Date(row.timestamp);
    if (!Number.isNaN(date.getTime())) {
      months.add(`${date.getFullYear()}-${date.getMonth() + 1}`);
    }

    if (std > 0 && Math.abs(row.value - mean) > std * 3) {
      outliers += 1;
    }
  });

  const missingMonths = Math.max(0, 12 - months.size);
  const status = duplicates || outliers || missingMonths ? "warn" : "ok";

  return { duplicates, outliers, missingMonths, totalRows, status } as const;
}
