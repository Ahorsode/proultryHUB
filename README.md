# PoultryHub Ghana — Phase 1

Next.js App Router application for poultry farm construction quotes, project financial tracking, and read-only farm performance visibility.

## What is included

- Public rough-cost estimator at `/`
- Customer portal placeholder at `/customer`
- Open Phase 1 owner dashboard at `/admin`
- Quote generation, editing, recalculation, status changes, and conversion to projects
- Project expense and payment ledgers with derived spent, received, and outstanding values
- Read-only external farm performance adapter with realistic fallback data
- Supabase migration for all application-owned tables and Ghana region seeds

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.local.example` to `.env.local`.

3. Add your Supabase project URL and server key:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   ```

   The application runs with a process-local demo data store when these values are absent. Demo mutations survive while the development server process remains running but are not permanent.

4. Start the app:

   ```bash
   npm run dev
   ```

5. Open `http://localhost:3000`.

## Apply the Supabase migration

The schema lives at:

`supabase/migrations/20260619000100_initial_schema.sql`

Apply it using one of these approaches:

- Paste the migration into the Supabase SQL Editor for a new project.
- Or initialize/link the Supabase CLI and run `supabase db push`.

The migration:

- creates `regions`, `quotes`, `projects`, `expenses`, and `payments`
- installs `updated_at` triggers
- creates a `project_spend_summary` view
- enables RLS on every exposed table
- keeps Phase 1 database access server-only through the service role
- seeds all 16 Ghana regions with placeholder cost tiers

No service-role key is ever sent to the browser.

## External poultry management system

The second Supabase project is deliberately isolated. `src/lib/external-farm-data.ts` only calls a read-only HTTP endpoint:

```env
EXISTING_PLATFORM_API_URL=
EXISTING_PLATFORM_API_KEY=
```

Until those values are supplied, the app returns realistic mock farm summaries. It never creates a second Supabase database client and never writes to the external platform.

## Derived financials

The UI derives:

- amount spent from `expenses`
- amount received from `payments`
- amount outstanding from `budget_total - payments`

The application data layer computes these values from ledger entries. The migration also includes a `project_spend_summary` view for reporting.

## Client input still required

- Confirm regional high/medium/low tier assignments.
- Replace placeholder cost-per-bird, tier multipliers, trade splits, and facility sizing assumptions.
- Supply the read-only existing-platform Edge Function URL and API key.
- Agree a stable cross-system customer identifier; customer name is only a Phase 1 placeholder.
- Add Supabase Auth before exposing `/admin` outside controlled demos.
