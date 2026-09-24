begin;

create or replace function public.remove_directory_listing(p_id uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  removed_id uuid;
begin
  if not public.can_review_directory() then
    raise exception 'Not authorized';
  end if;

  delete from public.directory_listings
  where id = p_id
  returning id into removed_id;

  if removed_id is null then
    raise exception 'Business listing not found';
  end if;

  return removed_id;
end;
$$;

revoke all on function public.remove_directory_listing(uuid) from public, anon;
grant execute on function public.remove_directory_listing(uuid) to authenticated;

commit;
