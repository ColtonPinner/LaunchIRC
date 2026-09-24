begin;

create or replace function public.can_review_directory()
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select
    coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') in ('staff', 'admin')
    or exists (
      select 1
      from public.account_profiles profile
      where profile.id = auth.uid()
        and profile.account_type = 'consultant'
    );
$$;

create or replace function public.list_pending_directory_listings()
returns jsonb
language sql
security definer
stable
set search_path = ''
as $$
  select case
    when not public.can_review_directory() then
      jsonb_build_object('error', 'Not authorized')
    else coalesce(
      (
        select jsonb_agg(to_jsonb(listing) order by listing.created_date desc)
        from public.directory_listings listing
        where not coalesce((listing.data ->> 'is_approved')::boolean, false)
          and coalesce(listing.data ->> 'status', 'pending') <> 'accepted'
      ),
      '[]'::jsonb
    )
  end;
$$;

create or replace function public.accept_directory_listing(p_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  updated_listing public.directory_listings;
begin
  if not public.can_review_directory() then
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
  if not public.can_review_directory() then
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

drop policy if exists "Staff can read directory listings" on public.directory_listings;
create policy "Consultants can read directory listings"
on public.directory_listings for select
to authenticated
using (public.can_review_directory());

drop policy if exists "Staff can update directory listings" on public.directory_listings;
create policy "Consultants can update directory listings"
on public.directory_listings for update
to authenticated
using (public.can_review_directory())
with check (public.can_review_directory());

revoke all on function public.can_review_directory() from public, anon;
revoke all on function public.list_pending_directory_listings() from public, anon;
revoke all on function public.accept_directory_listing(uuid) from public, anon;
revoke all on function public.reject_directory_listing(uuid) from public, anon;

grant execute on function public.can_review_directory() to authenticated;
grant execute on function public.list_pending_directory_listings() to authenticated;
grant execute on function public.accept_directory_listing(uuid) to authenticated;
grant execute on function public.reject_directory_listing(uuid) to authenticated;

commit;
