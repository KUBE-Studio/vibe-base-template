# CLAUDE.md

Die verbindlichen Regeln für dieses Repo stehen in **[AGENTS.md](AGENTS.md)** —
Architektur, Konventionen, Workflow, und was hier bewusst _nicht_ getan wird.
Lies die Datei, bevor du Code änderst.

## Kurzfassung

- `bun run verify` (lint + check + test + knip) muss grün sein, bevor etwas fertig ist.
- Datenzugriff nur über Repositories, API nur über tRPC, Auth nur über
  Route-Gruppen + Middlewares.
- UI-Texte deutsch, Code englisch. Enum-Labels nach `src/lib/labels.ts`.
- Schema-Änderung → `bun run db:generate <name>` → Migration mitcommitten.
- Styling nur über die Design-Tokens aus `src/lib/styles/app.css`.
