# Earth Finance Microgrid ROI Studio (POC)

A vibe-code, standalone Next.js demo that reimagines the Excel-based Solar/Microgrid ROI calculator with two personas:

- **Executive View**: read-only portfolio analytics (map, pipeline stages, KPI cards).
- **Practitioner View**: editable model variables, guided workflow, live outputs, and export/import JSON.

## How model generation works

This POC **does not connect to Excel at runtime**. The Excel workbook is used only at build time.

- Place the workbook at `data/calculator.xlsx`.
- Run `npm run generate:model` to create:
  - `lib/model/generated/variables.schema.json`
  - `lib/model/generated/formulas.json`

If the workbook is missing, the script falls back to a seeded mock schema.

## What is mocked vs computed

Computed (local engine):
- NPV
- ROI
- Payback
- Total CapEx
- Annual Savings
- Total Tax Benefit

Mocked / simplified:
- Detailed formula dependency graph
- Full interval-data-driven adjustments
- PDF export and advanced output tables

Outputs are tagged as **computed** or **partial** inside the UI.

## Extending formulas next

1. Expand `scripts/generate-model.ts` to parse more Excel formulas.
2. Map additional outputs into `lib/model/engine.ts`.
3. Update UI confidence badges and output detail lists.

## Getting started

```bash
npm install
npm run dev
```

## Notes

- Portfolio/project data is sanitized mock data.
- Practitioner edits are stored in LocalStorage.
- Executive view is strictly read-only.
