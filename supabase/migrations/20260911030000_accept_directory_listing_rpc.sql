begin;

-- Function to accept a directory business listing
create or replace function public.accept_directory_listing(p_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_record record;
  updated_data jsonb;
  result record;
begin
  select * into target_record from public.directory_listings where id = p_id;
  if target_record.id is null then
    raise exception 'Business listing with ID % not found', p_id;
  end if;

  updated_data := coalesce(target_record.data, '{}'::jsonb) || '{"is_approved": true, "status": "accepted"}'::jsonb;

  update public.directory_listings
  set data = updated_data,
      updated_date = now()
  where id = p_id
  returning * into result;

  return jsonb_build_object(
    'id', result.id,
    'owner_id', result.owner_id,
    'data', result.data,
    'created_date', result.created_date,
    'updated_date', result.updated_date
  );
end;
$$;

-- Function to reject a directory business listing
create or replace function public.reject_directory_listing(p_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_record record;
  updated_data jsonb;
  result record;
begin
  select * into target_record from public.directory_listings where id = p_id;
  if target_record.id is null then
    raise exception 'Business listing with ID % not found', p_id;
  end if;

  updated_data := coalesce(target_record.data, '{}'::jsonb) || '{"is_approved": false, "status": "rejected"}'::jsonb;

  update public.directory_listings
  set data = updated_data,
      updated_date = now()
  where id = p_id
  returning * into result;

  return jsonb_build_object(
    'id', result.id,
    'owner_id', result.owner_id,
    'data', result.data,
    'created_date', result.created_date,
    'updated_date', result.updated_date
  );
end;
$$;

grant execute on function public.accept_directory_listing(uuid) to authenticated;
grant execute on function public.reject_directory_listing(uuid) to authenticated;

commit;
