# Basistemplate

Startpunkt für neue Projekte: SvelteKit 2 + Svelte 5, tRPC, Drizzle/Postgres,
better-auth mit Admin-Freigabe, Tailwind-Design-System, Docker-Deployment und ein
CI-Gate aus Lint, Typecheck, Tests und Dead-Code-Analyse.

Die Architektur- und Arbeitsregeln stehen in **[AGENTS.md](AGENTS.md)**.

## Was drin ist

- **Auth komplett**: Registrierung mit E-Mail-Bestätigung, Login, Passwort-Reset,
  Google-Login (optional), Rollen (`admin` / `user`), Admin-Freigabe neuer Accounts,
  Soft-Delete inkl. Re-Registrierung.
- **tRPC** über HTTP und WebSocket (Subscriptions), mit typsicherem Client und
  `createCaller` für Server-`load()`.
- **Drizzle + Postgres**, Repository-Pattern, Migrationen laufen beim Start.
- **UI-Bibliothek**: Button, Chip, Dialog, Dropdown, Popover, Tabs, Tooltip,
  Inputs, Tabellen mit Pagination/Filtern, Sidebar-Layout, Toasts.
- **Admin-Bereich**: Benutzerverwaltung und Registrierungs-Freigaben.
- **Deployment**: Dockerfile, docker-compose, nginx-Vorlage, GitHub-Actions für
  Provisionierung, Deploy und Zertifikatserneuerung.

## Voraussetzungen

- [Bun](https://bun.sh) 1.3 oder neuer
- [Docker](https://docs.docker.com/get-docker/) für die lokale Datenbank (oder ein eigenes
  Postgres, dann `DATABASE_URL` in `.env` anpassen)

## Neues Projekt starten

Auf GitHub **„Use this template“** → eigenes Repository anlegen und klonen, dann:

```bash
bun install
cp .env.example .env      # passt so für die lokale Entwicklung
bun run db:up             # Postgres in Docker starten
bun run dev               # http://localhost:5173
```

Danach anpassen:

1. `src/lib/config.ts` — `APP_NAME`, `APP_DESCRIPTION`
2. `package.json` — `name`
3. `static/images/logo.svg` und `src/lib/assets/favicon.svg`
4. Farben und Tokens in `src/lib/styles/app.css` (`--color-primary-*`)
5. `AGENTS.md` — Produktbeschreibung ergänzen, Template-Hinweis oben löschen

## Erster Login und erster Admin

Ohne `BREVO_API_KEY` werden Mails im Dev-Modus **nicht versendet, sondern in die
Konsole von `bun run dev` geschrieben** — inklusive Bestätigungs- und Reset-Link. Eine
frische Kopie ist damit ohne externen Account voll benutzbar.

1. Unter `/auth/register` registrieren.
2. Den Bestätigungslink aus der Konsole öffnen.
3. Das Konto zum Admin machen — neue Accounts brauchen eine Freigabe, und beim ersten
   gibt es noch niemanden, der freigeben könnte:

```bash
bun run make-admin dein@mail.de
```

Alle weiteren Accounts gibt der Admin unter „Registrierungen“ frei.

Google-Login ist optional: Erst mit `GOOGLE_CLIENT_ID` und `GOOGLE_CLIENT_SECRET` in
`.env` erscheint der Button „Mit Google anmelden“.

## Befehle

```bash
bun run dev                  # Dev-Server
bun run verify               # lint + check + test + knip (läuft genauso in der CI)
bun run build                # Produktions-Build
bun run db:up / db:down      # lokale Datenbank starten / stoppen (Daten bleiben)
bun run db:generate <name>   # Migration nach einer Schema-Änderung erzeugen
bun run db:studio            # Drizzle Studio
bun run make-admin <E-Mail>  # Konto zum Admin machen
```

## Deployment (optional)

In einer frischen Kopie sind die Deploy-Workflows aus, damit nicht jeder Push auf
`main` an einem fehlenden Server scheitert. Einschalten:

1. Einen Server mit SSH-Zugang und eine Domain bereithalten; den A-Record der Domain
   auf den Server zeigen lassen.
2. Die Repository-Secrets anlegen, die oben in `.github/workflows/deploy.yml` stehen,
   dazu `CERTBOT_EMAIL`.
3. Den Workflow „Setup Infrastructure“ einmal von Hand starten (Docker, nginx,
   Zertifikat).
4. Unter Settings → Secrets and variables → Actions → Variables die Variable
   `DEPLOY_ENABLED` auf `true` setzen. Ab dann geht jeder Push auf `main` live.

Der erste Admin auf dem Server:

```bash
docker exec -it <repo-name>-db psql -U app -c "update \"user\" set role='admin', registration_status='approved' where email='dein@mail.de';"
```

## Lizenz

MIT, siehe [LICENSE](LICENSE). Die Schriften Onest und Geist Mono stehen unter der SIL
Open Font License (`static/fonts/*-OFL.txt`).
