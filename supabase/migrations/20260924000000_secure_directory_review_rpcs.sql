begin;

create or replace function public.accept_directory_listing(p_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  updated_listing public.directory_listings;
begin
  if coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') not in ('staff', 'admin') then
    raise exception 'Not authorized';
  end if;

  update public.directory_listings
  set data = coalesce(data, '{}'::jsonb)
    || '{"is_approved": true, "status": "accepted"}'::jsonb
  where id = p_id
  returning * into updated_listing;

  if updated_listing.id is null then
    raise exception 'Business listing not found';
  end if;

  return to_jsonb(updated_listing);
end;
$$;

create or replace function public.reject_directory_listing(p_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  updated_listing public.directory_listings;
begin
  if coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') not in ('staff', 'admin') then
    raise exception 'Not authorized';
  end if;

  update public.directory_listings
  set data = coalesce(data, '{}'::jsonb)
    || '{"is_approved": false, "status": "rejected"}'::jsonb
  where id = p_id
  returning * into updated_listing;

  if updated_listing.id is null then
    raise exception 'Business listing not found';
  end if;

  return to_jsonb(updated_listing);
end;
$$;

revoke all on function public.accept_directory_listing(uuid) from public, anon;
revoke all on function public.reject_directory_listing(uuid) from public, anon;
grant execute on function public.accept_directory_listing(uuid) to authenticated;
grant execute on function public.reject_directory_listing(uuid) to authenticated;

commit;
