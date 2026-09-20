# Abhay Chand — Portfolio

A content-managed personal portfolio. The public site reads from a SQLite
database; everything on it — profile, experience, projects, skills,
certifications, achievements — is edited through a private `/admin` panel,
with no code changes required to update content.

## Stack, and why

- **Next.js (App Router, TypeScript)** — one codebase for the public site and
  the admin panel, server-rendered for speed and SEO.
- **SQLite via Drizzle ORM** (`better-sqlite3`) — a single-file database, no
  server process to run or manage. Right-sized for one person's content;
  Drizzle's schema is a straightforward swap to Postgres later if this ever
  needs multi-instance/serverless hosting.
- **Tailwind CSS** for styling, self-hosted fonts (`@fontsource`) so the site
  has no runtime dependency on Google's font CDN.
- **A single admin account**, session cookie (signed JWT), password hashed
  with bcrypt. This is a one-person CMS, not a multi-user system, so there's
  deliberately no user management, roles, or SaaS auth provider.

## Getting started

```bash
npm install
npm run db:push        # creates the SQLite schema
npm run db:seed        # loads your profile/projects/etc (only run once)
npm run dev
```

Visit `http://localhost:3000` for the public site and
`http://localhost:3000/admin` for the CMS.

**Default admin login** (seeded): `abhay@example.com` / `changeme123`.

**Change this immediately:**

```bash
npm run admin:set-password -- you@realdomain.com "a-strong-new-password"
```

This updates the login email and password together. Log in again with the
new credentials afterward.

### Environment variables

Required, in `.env`:

```
SESSION_SECRET="<random 32+ byte hex string>"
```

Generate a fresh `SESSION_SECRET` before deploying anywhere real —
the one in this project was generated for local development only:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Using the admin panel

Everything under `/admin` maps directly to a section of the public site:

- **Profile** — name, title, tagline, bio, photo, resume, contact links,
  focus areas. There's one profile row; the form edits it directly.
- **Experience** — one entry per role. Leave "End date" blank for your
  current role. Reorder with the ↑/↓ controls; unpublish to hide without
  deleting.
- **Projects** — category (AI/GenAI or Data Analytics) drives the color tag
  and grouping on the homepage. "Featured" is available for future use if
  you want to highlight specific projects more prominently. Cover images and
  tech stack chips are edited inline.
- **Skills** — grouped lists (e.g. "GenAI & LLM Systems"); add or remove
  individual skills within a group.
- **Certifications** / **Achievements** — simple entries, reorderable.

Changes take effect on the public site immediately — there's no build step,
cache to clear, or deploy to trigger for a content change.

### Uploading images and your resume

Any "Photo", "Cover image", or "Resume" field has an upload button. Files are
stored in `public/uploads/` and referenced by path in the database. Accepted
types: JPEG, PNG, WebP (images) and PDF (resume). Max size 8 MB.

## Project structure

```
src/
  app/                  Public pages + /admin UI + API routes
  components/           Public site components (project rows, tags, etc.)
  components/admin/     Generic, config-driven admin form/list components
  db/
    schema.ts           Drizzle schema — the source of truth for content shape
    seed.ts             One-time seed with your merged resume content
  lib/
    data.ts             Public read queries (published content only)
    admin-repo.ts        Generic CRUD used by the admin API
    resource-ui.ts       Field configuration that drives the admin forms
    session.ts, require-admin.ts   Auth
  proxy.ts               Route protection for /admin and /api/admin/*
```

### Adding a new content type later

Because the admin UI is config-driven rather than hand-built per resource,
adding something new (e.g. "Publications") is:

1. Add a table to `src/db/schema.ts`, run `npm run db:push`.
2. Add an entry to `RESOURCES` in `src/lib/admin-repo.ts`.
3. Add an entry to `RESOURCE_UI` in `src/lib/resource-ui.ts` describing its
   fields.
4. Add a public read function in `src/lib/data.ts` and render it on the
   homepage where it belongs.

No new admin pages or API routes are needed — the generic `/admin/[resource]`
page and `/api/admin/content/[resource]` routes pick it up automatically.

## Deployment

**Important:** this uses a local SQLite file and on-disk image uploads, both
of which need a **persistent filesystem**. It will not work as-is on a
serverless platform with an ephemeral filesystem (e.g. Vercel's default
serverless functions) — uploads and database writes would disappear between
requests.

Straightforward options:

- **A small VPS or PaaS with persistent disk** (Railway, Render, Fly.io, a
  DigitalOcean droplet): run `npm run build && npm run start`, and mount a
  persistent volume at `data/` and `public/uploads/`.
- **Docker**, with `data/` and `public/uploads/` as mounted volumes.

If you later want serverless hosting, swap the Drizzle SQLite driver for a
Postgres one (e.g. Neon or Supabase) and move uploads to object storage
(e.g. S3) — the schema and admin UI don't need to change, only
`src/db/index.ts` and the upload route.

## Notes on content accuracy

The seeded content merges your two resume versions as agreed: Wavygo is
presented as one role spanning AI product development, data analysis, and
the support chatbot (not as separate conflicting jobs); certifications are
de-duplicated across both versions; your contact email is left unset — add
your real one in **Profile** before sharing the site publicly.
