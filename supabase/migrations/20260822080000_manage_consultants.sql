begin;

create or replace function public.list_consultants()
returns table (id uuid, email text, full_name text, role text, created_date timestamptz)
language sql
security definer
stable
set search_path = ''
as $$
  select
    profile.id,
    auth_user.email,
    profile.full_name,
    auth_user.raw_app_meta_data ->> 'role' as role,
    profile.created_date
  from public.account_profiles profile
  join auth.users auth_user on auth_user.id = profile.id
  where profile.account_type = 'consultant'
    and (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  order by profile.created_date desc;
$$;

revoke all on function public.list_consultants() from public;
grant execute on function public.list_consultants() to authenticated;

commit;
