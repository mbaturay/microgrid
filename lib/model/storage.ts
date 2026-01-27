import { generateMockPortfolio } from "@/lib/model/mock";
import { ProjectModel } from "@/lib/model/types";

const STORAGE_KEY = "earthfinance-portfolio";

export function loadPortfolio(): ProjectModel[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return generateMockPortfolio();
  try {
    return JSON.parse(raw) as ProjectModel[];
  } catch {
    return generateMockPortfolio();
  }
}

export function savePortfolio(projects: ProjectModel[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}
