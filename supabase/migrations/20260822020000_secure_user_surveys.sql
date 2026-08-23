begin;

create extension if not exists pgcrypto;

create table if not exists public.business_surveys (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid default auth.uid() references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now()
);

alter table public.business_surveys
  add column if not exists owner_id uuid default auth.uid() references auth.users(id) on delete cascade,
  add column if not exists data jsonb not null default '{}'::jsonb,
  add column if not exists created_date timestamptz not null default now(),
  add column if not exists updated_date timestamptz not null default now();

alter table public.business_surveys alter column owner_id set default auth.uid();
alter table public.business_surveys alter column data set default '{}'::jsonb;
alter table public.business_surveys enable row level security;

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

drop trigger if exists business_surveys_set_updated_date on public.business_surveys;
create trigger business_surveys_set_updated_date
before update on public.business_surveys
for each row execute function public.set_updated_date();

drop policy if exists "Anyone can create surveys" on public.business_surveys;
drop policy if exists "Owners can create surveys" on public.business_surveys;
drop policy if exists "Owners can read surveys" on public.business_surveys;
drop policy if exists "Owners can update surveys" on public.business_surveys;

create policy "Owners can create surveys"
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

revoke all on public.business_surveys from anon;
grant select, insert, update on public.business_surveys to authenticated;

-- Remove the earlier capability-link API if it was deployed. Survey records are
-- now private account data and are accessed directly through owner-scoped RLS.
drop function if exists public.create_business_survey(uuid, jsonb);
drop function if exists public.get_business_survey(uuid);
drop function if exists public.update_business_survey(uuid, jsonb);
drop function if exists public.list_my_business_surveys();

create index if not exists business_surveys_owner_updated_idx
on public.business_surveys (owner_id, updated_date desc);

create index if not exists business_surveys_data_idx
on public.business_surveys using gin (data);

commit;
