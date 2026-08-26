begin;

alter table public.account_profiles
  add column if not exists ein text not null default '';

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

  insert into public.account_profiles (id, account_type, full_name, business_name, ein)
  values (
    new.id,
    resolved_type,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'business_name', ''),
    coalesce(new.raw_user_meta_data ->> 'ein', '')
  )
  on conflict (id) do update set
    account_type = excluded.account_type,
    full_name = excluded.full_name,
    business_name = excluded.business_name,
    ein = excluded.ein,
    updated_date = now();

  return new;
end;
$$;

insert into public.account_profiles (id, account_type, full_name, business_name, ein)
select
  user_record.id,
  case
    when user_record.raw_app_meta_data ->> 'role' in ('staff', 'admin') then 'consultant'
    when user_record.raw_user_meta_data ->> 'account_type' = 'provider' then 'provider'
    else 'customer'
  end,
  coalesce(user_record.raw_user_meta_data ->> 'full_name', ''),
  coalesce(user_record.raw_user_meta_data ->> 'business_name', ''),
  coalesce(user_record.raw_user_meta_data ->> 'ein', '')
from auth.users user_record
on conflict (id) do update set
  ein = excluded.ein,
  updated_date = now();

commit;
