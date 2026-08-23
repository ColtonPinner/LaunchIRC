create extension if not exists pgcrypto;

create table public.business_surveys (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now()
);

create table public.concierge_requests (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now()
);

create table public.directory_listings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now()
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  data jsonb not null default '{}'::jsonb,
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now()
);

create or replace function public.set_updated_date()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_date = now();
  return new;
end;
$$;

create trigger business_surveys_set_updated_date
before update on public.business_surveys
for each row execute function public.set_updated_date();

create trigger concierge_requests_set_updated_date
before update on public.concierge_requests
for each row execute function public.set_updated_date();

create trigger directory_listings_set_updated_date
before update on public.directory_listings
for each row execute function public.set_updated_date();

create trigger events_set_updated_date
before update on public.events
for each row execute function public.set_updated_date();

alter table public.business_surveys enable row level security;
alter table public.concierge_requests enable row level security;
alter table public.directory_listings enable row level security;
alter table public.events enable row level security;

create policy "Anyone can create surveys"
on public.business_surveys for insert
to authenticated
with check ((select auth.uid()) = owner_id);

create policy "Owners can read surveys"
on public.business_surveys for select
to authenticated
using ((select auth.uid()) = owner_id);

create policy "Owners can update surveys"
on public.business_surveys for update
to authenticated
using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

create policy "Anyone can submit concierge requests"
on public.concierge_requests for insert
to authenticated
with check ((select auth.uid()) = owner_id);

create policy "Anyone can submit directory listings"
on public.directory_listings for insert
to authenticated
with check ((select auth.uid()) = owner_id);

create policy "Anyone can read approved directory listings"
on public.directory_listings for select
to anon, authenticated
using (coalesce((data ->> 'is_approved')::boolean, false));

create policy "Anyone can read events"
on public.events for select
to anon, authenticated
using (true);

grant select, insert, update on public.business_surveys to authenticated;
grant insert on public.concierge_requests to authenticated;
grant select on public.directory_listings to anon;
grant select, insert on public.directory_listings to authenticated;
grant select on public.events to anon, authenticated;

create index business_surveys_data_idx on public.business_surveys using gin (data);
create index directory_listings_data_idx on public.directory_listings using gin (data);
create index events_data_idx on public.events using gin (data);
