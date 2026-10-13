# Swostik Overseas — Foreign Employment Consulting Website

A bilingual (English / नेपाली) company website with a built-in admin control
panel for a government-licensed overseas recruitment agency based in Nepal.

Built with **Next.js 16 (App Router)**, **TypeScript**, **Prisma 7**,
**PostgreSQL**, **Bootstrap 5**, and **next-intl**.

## Features

**Public website (`/[locale]`)**
- Landing page: hero + job search, stats, featured jobs, categories, countries
  and services.
- Job listings with search / filter (`/jobs`, `/jobs/[slug]`) and apply flow.
- Destination country guides (`/countries`, `/countries/[slug]`).
- Services, about, notices and a contact page with an inquiry form.
- Apply online with CV upload (PDF/DOC/DOCX, max 5 MB), or via WhatsApp / email.
- Nepali translation toggle on every public page.
- Auto-generated `sitemap.xml` and `robots.txt`, plus custom 404 and error pages.

**Admin control panel (`/admin`)**
- Cookie session login (bcrypt + JWT via `jose`).
- Dashboard with key stats and recent activity.
- Full CRUD for jobs, categories, countries, services, testimonials, FAQs and
  notices.
- Applications inbox (status workflow, CV download, filters) and queries inbox.
- Site-wide settings (company info, contact, socials, stats, branding) and a
  maintenance tool to clean up orphaned resume files.
- Change-password page.

## Requirements

- Node.js 20+
- PostgreSQL 14+ running locally

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment** — copy `.env.example` to `.env` and edit:

   ```bash
   cp .env.example .env
   ```

   | Variable | Purpose |
   | --- | --- |
   | `DATABASE_URL` | PostgreSQL connection string |
   | `AUTH_SECRET` | Secret used to sign session cookies |
   | `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seeded admin login |
   | `NEXT_PUBLIC_SITE_URL` | Public base URL (metadata / Open Graph) |

3. **Create the database schema and seed demo data**

   ```bash
   npm run db:migrate
   npm run db:seed
   ```

4. **Run the dev server**

   ```bash
   npm run dev
   ```

   - Website: <http://localhost:3000>
   - Admin: <http://localhost:3000/admin> (default `admin@swostik.com` / `admin123`)

> The English locale has no URL prefix (`/jobs`); Nepali is prefixed (`/ne/jobs`).

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run db:migrate` | Create/apply Prisma migrations |
| `npm run db:push` | Push schema without a migration (prototyping) |
| `npm run db:seed` | Seed the database with demo content |
| `npm run db:generate` | Regenerate the Prisma client |
| `npm run db:studio` | Open Prisma Studio |

## Project Structure

```
prisma/               # schema, migrations, seed
public/               # static assets + uploaded resumes (uploads/ is gitignored)
src/
  actions/            # server actions (public forms, admin CRUD, auth)
  app/
    [locale]/         # public bilingual pages
    admin/            # control panel (not localized)
  components/
    admin/            # admin UI (sidebar, forms, buttons)
    public/           # public UI (navbar, footer, cards, forms)
  generated/prisma/   # generated Prisma client (gitignored)
  i18n/               # next-intl routing / request config
  lib/                # prisma client, auth, settings, storage, formatting
  messages/           # en.json / ne.json translations
  proxy.ts            # next-intl middleware (Next 16 proxy)
```

## Deployment Notes

- Use a managed PostgreSQL database and set a strong `AUTH_SECRET`.
- Resume uploads write to `public/uploads/resumes`. For serverless hosting
  (e.g. Vercel) the filesystem is ephemeral — move this to object storage
  (S3 / R2 / Supabase Storage) before going live. The storage logic is
  isolated in `src/lib/storage.ts` and `src/actions/public.ts` to make that
  swap easy.
