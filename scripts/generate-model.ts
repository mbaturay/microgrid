import fs from "node:fs";
import path from "node:path";
import * as xlsx from "xlsx";

const ROOT = process.cwd();
const workbookPath = path.join(ROOT, "data", "calculator.xlsx");
const outputDir = path.join(ROOT, "lib", "model", "generated");
const schemaPath = path.join(outputDir, "variables.schema.json");
const formulasPath = path.join(outputDir, "formulas.json");

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

function inferType(value: unknown, label: string) {
  if (typeof value === "boolean") return "boolean";
  if (typeof value === "number") {
    if (label.toLowerCase().includes("%") || label.toLowerCase().includes("rate")) {
      return "percent";
    }
    if (label.toLowerCase().includes("cost") || label.toLowerCase().includes("capex")) {
      return "currency";
    }
    return "number";
  }
  if (value instanceof Date) return "date";
  return "string";
}

function fallbackSchema() {
  return JSON.parse(fs.readFileSync(schemaPath, "utf-8"));
}

function generateFromWorkbook() {
  if (!fs.existsSync(workbookPath)) {
    return null;
  }

  const workbook = xlsx.readFile(workbookPath, { cellDates: true });
  const sheetName = workbook.SheetNames.find((name) =>
    name.toLowerCase().includes("model variables")
  );
  if (!sheetName) {
    return null;
  }

  const sheet = workbook.Sheets[sheetName];
  const rows = xlsx.utils.sheet_to_json(sheet, {
    header: 1,
    blankrows: false,
  }) as unknown[][];

  const headers = (rows[0] || []).map((value: unknown) =>
    String(value).toLowerCase()
  );
  const headerIndex = (name: string) => headers.findIndex((h) => h.includes(name));

  const idxLabel = headerIndex("label");
  const idxName = headerIndex("name");
  const idxSection = headerIndex("section");
  const idxDefault = headerIndex("default");
  const idxMin = headerIndex("min");
  const idxMax = headerIndex("max");
  const idxType = headerIndex("type");
  const idxUnits = headerIndex("unit");
  const idxOptions = headerIndex("option");
  const idxCell = headerIndex("cell");

  const sections = new Map<string, any[]>();

  rows.slice(1).forEach((row) => {
    const label = row[idxLabel] ?? row[idxName];
    if (!label) return;

    const key = row[idxName]
      ? String(row[idxName]).trim()
      : String(label).trim().toLowerCase().replace(/\s+/g, "_");

    const section = row[idxSection] ? String(row[idxSection]) : "Model Variables";
    const type = row[idxType]
      ? String(row[idxType]).toLowerCase()
      : inferType(row[idxDefault], String(label));

    const variable = {
      key,
      label: String(label),
      cell: idxCell >= 0 ? String(row[idxCell]) : undefined,
      type,
      unit: idxUnits >= 0 ? row[idxUnits] : undefined,
      min: idxMin >= 0 ? Number(row[idxMin]) : undefined,
      max: idxMax >= 0 ? Number(row[idxMax]) : undefined,
      options:
        idxOptions >= 0 && row[idxOptions]
          ? String(row[idxOptions]).split(",").map((v) => v.trim())
          : undefined,
      default: row[idxDefault],
    };

    if (!sections.has(section)) sections.set(section, []);
    sections.get(section)?.push(variable);
  });

  return {
    sections: Array.from(sections.entries()).map(([title, variables]) => ({
      title,
      variables,
    })),
  };
}

function generateFormulas() {
  return {
    outputs: {
      npv: "computed",
      roi: "computed",
      paybackYears: "computed",
      totalCapex: "computed",
      annualSavings: "computed",
      totalTaxBenefit: "computed",
    },
    notes: "Partial formula coverage for POC. Extend with Excel-derived dependencies.",
  };
}

ensureDir(outputDir);

const schema = generateFromWorkbook() ?? fallbackSchema();
const formulas = generateFormulas();

fs.writeFileSync(schemaPath, JSON.stringify(schema, null, 2));
fs.writeFileSync(formulasPath, JSON.stringify(formulas, null, 2));

console.log("Model schema and formulas generated.");
