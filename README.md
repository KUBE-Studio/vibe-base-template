# Basistemplate

Startpunkt für neue Projekte: SvelteKit 2 + Svelte 5, tRPC, Drizzle/Postgres,
better-auth mit Admin-Freigabe, Tailwind-Design-System, Docker-Deployment und ein
CI-Gate aus Lint, Typecheck, Tests und Dead-Code-Analyse.

Die Architektur- und Arbeitsregeln stehen in **[AGENTS.md](AGENTS.md)**.

## Was drin ist

- **Auth komplett**: Registrierung mit E-Mail-Bestätigung, Login, Passwort-Reset,
  Google-OAuth, Rollen (`admin` / `user`), Admin-Freigabe neuer Accounts,
  Soft-Delete inkl. Re-Registrierung.
- **tRPC** über HTTP und WebSocket (Subscriptions), mit typsicherem Client und
  `createCaller` für Server-`load()`.
- **Drizzle + Postgres**, Repository-Pattern, Migrationen laufen beim Start.
- **UI-Bibliothek**: Button, Chip, Dialog, Dropdown, Popover, Tabs, Tooltip,
  Inputs, Tabellen mit Pagination/Filtern, Sidebar-Layout, Toasts.
- **Admin-Bereich**: Benutzerverwaltung und Registrierungs-Freigaben.
- **Deployment**: Dockerfile, docker-compose, nginx-Vorlage, GitHub-Actions für
  Provisionierung, Deploy und Zertifikatserneuerung.

## Neues Projekt starten

```bash
bun install
cp .env.example .env      # DATABASE_URL, AUTH_SECRET, … ausfüllen
bun run db:generate init  # nur nötig, wenn das Schema geändert wurde
bun run dev
```

Danach anpassen:

1. `src/lib/config.ts` — `APP_NAME`, `APP_DESCRIPTION`
2. `package.json` — `name`
3. `static/images/logo.svg` und `src/lib/assets/favicon.svg`
4. Farben und Tokens in `src/lib/styles/app.css` (`--color-primary-*`)
5. `AGENTS.md` — Produktbeschreibung ergänzen, Template-Hinweis oben löschen

Ohne `BREVO_API_KEY` werden Mails im Dev-Modus **nicht versendet, sondern in die
Server-Konsole geschrieben** — inklusive Bestätigungs- und Reset-Link. Eine frische
Kopie ist damit ohne externen Account voll benutzbar.

Ein Admin-Account entsteht, indem man sich registriert, den Bestätigungslink aus der
Konsole öffnet und die Rolle in der Datenbank einmalig auf `admin` sowie
`registration_status` auf `approved` setzt:

```bash
psql "$DATABASE_URL" -c "update \"user\" set role='admin', registration_status='approved' where email='dein@mail.de';"
```

## Befehle

```bash
bun run dev        # Dev-Server
bun run verify     # lint + check + test + knip (läuft genauso in der CI)
bun run build      # Produktions-Build
bun run db:studio  # Drizzle Studio
```
