# AGENTS.md

Einstiegspunkt für jeden Agenten (menschlich oder KI), der in diesem Repo arbeitet.
**Zuerst lesen.** Hier stehen die Entscheidungen, die man nicht aus dem Code ableiten kann.

> Dieses Repo ist aus einem Basistemplate entstanden. Beim Start eines neuen Projekts:
> `src/lib/config.ts` (APP_NAME), `package.json` (`name`), `README.md` und den
> Produkt-Abschnitt unten anpassen — danach diesen Hinweis löschen.

## Was das hier ist

<!-- TODO: Zwei bis drei Sätze: Was macht die App, für wen, welches Problem löst sie. -->

## Stack

SvelteKit 2 + Svelte 5 (Runes-Modus erzwungen) · Bun · Vite · Tailwind CSS v4 ·
tRPC 11 (HTTP + WebSocket) · Drizzle ORM + Postgres · better-auth · Zod ·
`@sveltejs/adapter-node` · TypeScript strict.

**SvelteKit bleibt auf 2.x** (npm-Tag `version-2`, bekommt weiter Sicherheitsupdates):
KI-Assistenten schreiben noch SvelteKit-2-Code (`$lib`, `svelte.config.js`,
`$app/stores`), der unter 3 bricht. TypeScript bleibt auf 6, weil `svelte-check` 7 noch
nicht unterstützt.

## Architektur (Mentales Modell)

```
Browser ──tRPC client──► /api/trpc  ──► Router ──► Repositories ──► Postgres
        └─WebSocket────► /trpc-ws        │
                                         └──► Services (E-Mail, externe APIs)
SvelteKit load() ──createCaller()──► derselbe Router (kein HTTP-Roundtrip)
```

- **Eine API-Oberfläche: tRPC.** Server-`load()`-Funktionen rufen den Router über
  `createCaller(event)` auf, der Client über `client.api.*`. Es gibt **keine**
  parallelen `+server.ts`-Endpunkte für Dinge, die tRPC kann.
- **Repositories sind die einzige Stelle mit DB-Zugriff** (`src/lib/server/db/repositories/`).
  Prozeduren greifen über `ctx.repositories.*` zu, niemals direkt auf `db`.
- **Services kapseln externe Systeme** (`src/lib/server/services/`, z. B. Brevo).
  Sie kennen weder tRPC noch SvelteKit.
- **Auth ist ein Gate, kein Check pro Seite.** Die Route-Gruppen tragen die
  Zugriffsebene: `(authorized)` = eingeloggt, `(authorized)/(approved)` = vom
  Admin freigegeben. Serverseitig in `(authorized)/+layout.server.ts`, in tRPC
  über die Middlewares `requireLogin` / `requireApprovedUser` / `requireAdmin`.
- **Realtime** läuft über `ctx.ee` (EventEmitter) + tRPC-Subscriptions über den
  WebSocket-Server aus `trpc/wss.ts`. Referenz: `user.onProfileUpdated`.
  Einprozessig — bei Skalierung auf mehrere Nodes muss das nach Postgres
  LISTEN/NOTIFY oder Redis wandern.

## Verzeichnisse

| Pfad                            | Inhalt                                                                |
| ------------------------------- | --------------------------------------------------------------------- |
| `src/routes/`                   | Seiten + `load()`. Nur Seitenlogik, keine Geschäftslogik.             |
| `src/lib/components/`           | `base/` · `input/` · `layout/` · `table/` · `forms/` + Domänen-Ordner |
| `src/lib/server/db/`            | Schema, Migrationen, Repositories                                     |
| `src/lib/server/trpc/`          | Router, Kontext, Middlewares, WS-Setup                                |
| `src/lib/server/services/`      | Externe Integrationen                                                 |
| `src/lib/{types,labels,config}` | Enums & Typen · deutsche Labels · App-Identität                       |
| `src/lib/utils/`                | Reine Hilfsfunktionen (clientseitig nutzbar)                          |

## Konventionen

- **UI-Texte sind deutsch, Code/Bezeichner/Kommentare englisch.** Jedes Enum, das
  in der UI auftaucht, bekommt sein Label in `src/lib/labels.ts` — keine deutschen
  Strings neben Enum-Werten in Komponenten.
- **Server-only-Code liegt unter `src/lib/server/**` und wird nie in Client-Code
  importiert.** ESLint blockt das zusätzlich (`no-restricted-imports`).
- **Barrels (`index.ts`) exportieren nur, was den Ordner verlässt.** Ordnerinterne
  Bausteine bleiben relativ importiert und aus dem Barrel raus — knip erzwingt das.
  Ordnerübergreifend wird immer über das Barrel importiert, nie über Dateipfade.
- **Listen-State gehört in die URL**, nicht in Komponenten-State: Seite, Suche,
  Filter, Tab. Muster: `admin/users/+page.server.ts`.
- **Formulare**: `sveltekit-superforms` + Zod-Schema im `<script module>`-Block,
  `SPA: true`, Mutation über `client.api.*`. Muster: `forms/user-form.svelte`.
- **Editierbarer Komponenten-State wird per `$effect` aus den Props neu gesetzt**,
  damit `invalidateAll()` keine laufende Eingabe überschreibt.
- **Statusübergänge werden in der WHERE-Klausel abgesichert** (erwarteter
  Ausgangsstatus), nicht durch ein vorheriges SELECT. Muster:
  `registration-repository.ts`.
- **Benutzer werden soft-deleted.** `deletedAt` setzen, Sessions löschen — nie
  `DELETE FROM user`.
- **Styling nur über die Design-Tokens** aus `src/lib/styles/app.css`
  (`bg-bg-base`, `text-text-sub`, `gap-md`, `typography-sm`, …).
  `prettier-plugin-tailwindcss` sortiert die Klassen, `twMerge` löst
  `class`-Prop-Overrides auf.

## Workflow

```bash
bun install
bun run db:up            # lokales Postgres in Docker (docker-compose.dev.yml)
bun run dev              # Dev-Server (migriert die DB beim Start automatisch)
bun run verify           # lint + check + test + knip — vor jedem Commit
bun run db:generate <name>   # Migration aus Schema-Änderungen erzeugen
```

- **`bun run verify` muss grün sein, bevor etwas als fertig gilt.** Dieselben
  Schritte laufen in `.github/workflows/ci.yml`.
- **Schema-Änderungen erzeugen immer eine Migration** (`bun run db:generate`).
  Migrationen werden committet und beim Start automatisch angewendet
  (`hooks.server.ts`). Bereits ausgelieferte Migrationen werden nie editiert.
- `.env` aus `.env.example` erzeugen. Ohne `DATABASE_URL` startet nichts.
- Ohne `BREVO_API_KEY` schreibt der E-Mail-Service im Dev-Modus in die Konsole
  statt zu versenden (`services/email.ts`) — Bestätigungs- und Reset-Links stehen
  damit im Server-Log. In Produktion ist ein fehlender Key ein Konfigurationsfehler.
- Google-Login ist optional: ohne `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` wird der
  Provider nicht registriert und die Auth-Seiten blenden den Button aus
  (`googleLoginEnabled`, `routes/auth/+layout.server.ts`).
- Den ersten Admin macht `bun run make-admin <E-Mail>` — ohne Admin kann niemand eine
  Registrierung freigeben.

## Was Agenten hier nicht tun

- Keine neue Bibliothek für etwas hinzufügen, das der Stack schon kann
  (State, Formulare, Datums-Formatierung, HTTP).
- Keine Geschäftslogik in `+page.svelte` oder `load()` — sie gehört in Router
  und Repositories.
- Keine Rollenprüfung inline in einer Prozedur — dafür gibt es Middlewares.
- Keine Secrets, Hosts oder `.env`-Werte in Dateien, die committet werden.
- Keine ungenutzten Exporte/Dateien liegen lassen — knip schlägt sonst fehl.
- Kein `bun run format` über den ganzen Baum, nur um einen Lint-Fehler zu
  verstecken; die eigentliche Ursache beheben.

## Deployment

GitHub Actions → GHCR → SSH auf den Zielserver (`.github/workflows/deploy.yml`),
davor einmalig `setup.yml` (Docker, nginx, certbot). Deploy und Zertifikatserneuerung
laufen nur, wenn die Repository-Variable `DEPLOY_ENABLED` auf `true` steht — eine
frische Kopie hat keinen Server. nginx-Vorlage:
`nginx/app.conf` (`__DOMAIN__` wird beim Deploy ersetzt). Benötigte Secrets stehen
oben in `deploy.yml`.

> Diese Datei wird committet: Infrastruktur-Details ja, **Secrets niemals**.
