create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.regions (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  cost_tier text not null check (cost_tier in ('high', 'medium', 'low')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.quotes (
  id uuid primary key default gen_random_uuid(),
  customer_name text,
  customer_contact text,
  flock_size integer not null check (flock_size > 0),
  region_id uuid not null references public.regions(id),
  cost_tier_override text check (cost_tier_override in ('high', 'medium', 'low')),
  land_area_sqm numeric not null check (land_area_sqm >= 0),
  building_length_m numeric not null check (building_length_m >= 0),
  building_width_m numeric not null check (building_width_m >= 0),
  building_height_m numeric not null check (building_height_m >= 0),
  cage_count integer not null check (cage_count >= 0),
  water_system_notes text not null default '',
  cost_carpentry numeric not null default 0 check (cost_carpentry >= 0),
  cost_masonry numeric not null default 0 check (cost_masonry >= 0),
  cost_electrical numeric not null default 0 check (cost_electrical >= 0),
  cost_water_system numeric not null default 0 check (cost_water_system >= 0),
  cost_total numeric not null default 0 check (cost_total >= 0),
  status text not null default 'draft' check (status in ('draft', 'sent', 'accepted', 'declined')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid unique references public.quotes(id),
  customer_name text not null,
  customer_contact text not null default '',
  region_id uuid not null references public.regions(id),
  flock_size integer not null check (flock_size > 0),
  specification_snapshot jsonb not null default '{}'::jsonb,
  status text not null default 'registered' check (status in ('registered', 'in_progress', 'stocked', 'complete')),
  budget_total numeric not null default 0 check (budget_total >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  description text not null,
  amount numeric not null check (amount > 0),
  category text not null check (category in ('carpentry', 'masonry', 'electrical', 'water_system', 'other')),
  date date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  amount numeric not null check (amount > 0),
  date date not null default current_date,
  method text check (method in ('cash', 'bank_transfer', 'mobile_money')),
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index quotes_region_id_idx on public.quotes(region_id);
create index quotes_created_at_idx on public.quotes(created_at desc);
create index projects_region_id_idx on public.projects(region_id);
create index projects_status_idx on public.projects(status);
create index expenses_project_id_idx on public.expenses(project_id);
create index payments_project_id_idx on public.payments(project_id);

create trigger set_regions_updated_at before update on public.regions
for each row execute function public.set_updated_at();
create trigger set_quotes_updated_at before update on public.quotes
for each row execute function public.set_updated_at();
create trigger set_projects_updated_at before update on public.projects
for each row execute function public.set_updated_at();
create trigger set_expenses_updated_at before update on public.expenses
for each row execute function public.set_updated_at();
create trigger set_payments_updated_at before update on public.payments
for each row execute function public.set_updated_at();

create view public.project_spend_summary
with (security_invoker = true)
as
select
  p.id as project_id,
  p.budget_total,
  coalesce((select sum(exp.amount) from public.expenses exp where exp.project_id = p.id), 0) as amount_spent,
  coalesce((select sum(pay.amount) from public.payments pay where pay.project_id = p.id), 0) as amount_received,
  greatest(
    p.budget_total - coalesce((select sum(pay.amount) from public.payments pay where pay.project_id = p.id), 0),
    0
  ) as amount_outstanding
from public.projects p;

alter table public.regions enable row level security;
alter table public.quotes enable row level security;
alter table public.projects enable row level security;
alter table public.expenses enable row level security;
alter table public.payments enable row level security;

revoke all on public.regions, public.quotes, public.projects, public.expenses, public.payments from anon, authenticated;
revoke all on public.project_spend_summary from anon, authenticated;
grant all on public.regions, public.quotes, public.projects, public.expenses, public.payments to service_role;
grant select on public.project_spend_summary to service_role;

-- Placeholder cost tiers pending confirmation from the client.
insert into public.regions (id, name, cost_tier) values
  ('11111111-1111-4111-8111-111111111111', 'Greater Accra', 'high'),
  ('22222222-2222-4222-8222-222222222222', 'Ashanti', 'high'),
  ('33333333-3333-4333-8333-333333333333', 'Central', 'medium'),
  ('44444444-4444-4444-8444-444444444444', 'Eastern', 'medium'),
  ('55555555-5555-4555-8555-555555555555', 'Western', 'medium'),
  ('66666666-6666-4666-8666-666666666666', 'Western North', 'medium'),
  ('77777777-7777-4777-8777-777777777777', 'Volta', 'medium'),
  ('88888888-8888-4888-8888-888888888888', 'Oti', 'low'),
  ('99999999-9999-4999-8999-999999999999', 'Bono', 'medium'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Bono East', 'medium'),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'Ahafo', 'medium'),
  ('cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'Northern', 'low'),
  ('dddddddd-dddd-4ddd-8ddd-dddddddddddd', 'Savannah', 'low'),
  ('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee', 'North East', 'low'),
  ('ffffffff-ffff-4fff-8fff-ffffffffffff', 'Upper East', 'low'),
  ('12121212-1212-4212-8212-121212121212', 'Upper West', 'low');
