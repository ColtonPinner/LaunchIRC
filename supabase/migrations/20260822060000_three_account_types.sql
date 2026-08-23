begin;

create table if not exists public.account_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  account_type text not null check (account_type in ('customer', 'provider', 'consultant')),
  full_name text not null default '',
  business_name text not null default '',
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now()
);

alter table public.account_profiles enable row level security;

drop policy if exists "Users can read their account profile" on public.account_profiles;
create policy "Users can read their account profile"
on public.account_profiles for select
to authenticated
using (id = (select auth.uid()));

grant select on public.account_profiles to authenticated;

create or replace function public.sync_account_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  resolved_type text;
begin
  resolved_type := case
    when new.raw_app_meta_data ->> 'role' in ('staff', 'admin') then 'consultant'
    when new.raw_user_meta_data ->> 'account_type' = 'provider' then 'provider'
    else 'customer'
  end;

  insert into public.account_profiles (id, account_type, full_name, business_name)
  values (
    new.id,
    resolved_type,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'business_name', '')
  )
  on conflict (id) do update set
    account_type = excluded.account_type,
    full_name = excluded.full_name,
    business_name = excluded.business_name,
    updated_date = now();

  return new;
end;
$$;

drop trigger if exists sync_account_profile_after_auth_change on auth.users;
create trigger sync_account_profile_after_auth_change
after insert or update of raw_app_meta_data, raw_user_meta_data on auth.users
for each row execute function public.sync_account_profile();

insert into public.account_profiles (id, account_type, full_name, business_name)
select
  user_record.id,
  case
    when user_record.raw_app_meta_data ->> 'role' in ('staff', 'admin') then 'consultant'
    when user_record.raw_user_meta_data ->> 'account_type' = 'provider' then 'provider'
    else 'customer'
  end,
  coalesce(user_record.raw_user_meta_data ->> 'full_name', ''),
  coalesce(user_record.raw_user_meta_data ->> 'business_name', '')
from auth.users user_record
on conflict (id) do update set
  account_type = excluded.account_type,
  full_name = excluded.full_name,
  business_name = excluded.business_name,
  updated_date = now();

drop trigger if exists account_profiles_set_updated_date on public.account_profiles;
create trigger account_profiles_set_updated_date
before update on public.account_profiles
for each row execute function public.set_updated_date();

drop policy if exists "Anyone can submit directory listings" on public.directory_listings;
drop policy if exists "Providers can submit directory listings" on public.directory_listings;
create policy "Providers can submit directory listings"
on public.directory_listings for insert
to authenticated
with check (
  owner_id = (select auth.uid())
  and exists (
    select 1
    from public.account_profiles profile
    where profile.id = (select auth.uid())
      and profile.account_type = 'provider'
  )
);

commit;
