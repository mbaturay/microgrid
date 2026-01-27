import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const root = process.cwd();
const schemaPath = path.join(root, "lib", "model", "generated", "variables.schema.json");
const formulasPath = path.join(root, "lib", "model", "generated", "formulas.json");

if (!fs.existsSync(schemaPath) || !fs.existsSync(formulasPath)) {
  execSync("npm run generate:model", { stdio: "inherit" });
}
