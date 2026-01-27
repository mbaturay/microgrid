import { computeOutputs } from "@/lib/model/engine";
import { ProjectModel, TrackType } from "@/lib/model/types";
import schema from "@/lib/model/generated/variables.schema.json";

const STAGES = ["Proposed", "Analysis", "Green Ink", "Construction", "Complete"];
const REGIONS = ["Southwest", "Mountain", "Midwest", "Coastal", "Gulf"];
const TRACKS: TrackType[] = ["track-1", "track-2", "track-3"];

function seededRandom(seed: number) {
  let value = seed % 2147483647;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

export function getDefaultVariables() {
  const variables: Record<string, number | string | boolean> = {};
  schema.sections.forEach((section) => {
    section.variables.forEach((variable) => {
      if (variable.default !== undefined) {
        variables[variable.key] = variable.default as never;
      }
    });
  });
  return variables;
}

export function generateMockPortfolio(count = 24): ProjectModel[] {
  const random = seededRandom(42);
  const baseVariables = getDefaultVariables();

  return Array.from({ length: count }).map((_, index) => {
    const capacityMw = Number((2 + random() * 18).toFixed(1));
    const stage = STAGES[index % STAGES.length];
    const track = TRACKS[index % TRACKS.length];
    const id = `proj-${index + 1}`;

    const variables = {
      ...baseVariables,
      capex_total: Math.round(1200000 + random() * 6200000),
      annual_savings: Math.round(180000 + random() * 750000),
      tax_benefit: Math.round(80000 + random() * 400000),
      project_life_years: 20 + Math.round(random() * 10),
      discount_rate: Number((0.06 + random() * 0.06).toFixed(3)),
    };

    const outputs = computeOutputs(variables, undefined, track);

    return {
      id,
      name: `Solar Microgrid ${index + 1}`,
      stage,
      region: REGIONS[index % REGIONS.length],
      location: {
        lat: 32 + random() * 12,
        lng: -118 + random() * 10,
      },
      capacityMw,
      variables,
      track,
      outputs,
    } satisfies ProjectModel;
  });
}
