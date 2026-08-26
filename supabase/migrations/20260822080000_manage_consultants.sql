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

-- Bootstrap/ops helper: promote an existing account to consultant by email.
-- Intentionally granted to no API role - callable only from the SQL editor
-- (postgres) or the service role, e.g.:
--   select public.promote_to_consultant('you@example.com', 'admin');
create or replace function public.promote_to_consultant(p_email text, p_role text default 'staff')
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_id uuid;
begin
  if p_role not in ('staff', 'admin') then
    raise exception 'Role must be staff or admin';
  end if;

  update auth.users
  set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role', p_role)
  where lower(email) = lower(trim(p_email))
  returning id into target_id;

  if target_id is null then
    raise exception 'No account found for %', p_email;
  end if;

  return target_id;
end;
$$;

-- Supabase default privileges grant execute to anon/authenticated on new
-- functions, so revoke those roles explicitly - not just PUBLIC.
revoke all on function public.promote_to_consultant(text, text) from public, anon, authenticated;

commit;
