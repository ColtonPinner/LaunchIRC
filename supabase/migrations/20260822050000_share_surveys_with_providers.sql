begin;

alter table public.provider_leads
add column if not exists survey_id uuid references public.business_surveys(id) on delete set null;

create or replace function public.create_provider_lead(
  p_id uuid,
  p_listing_id uuid,
  p_data jsonb,
  p_survey_id uuid default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  created_lead public.provider_leads;
begin
  if jsonb_typeof(p_data) <> 'object'
    or length(trim(p_data ->> 'name')) not between 1 and 120
    or length(trim(p_data ->> 'email')) not between 3 and 320 then
    raise exception 'Invalid contact details';
  end if;

  if not exists (
    select 1
    from public.directory_listings listing
    where listing.id = p_listing_id
      and coalesce((listing.data ->> 'is_approved')::boolean, false)
  ) then
    raise exception 'Provider listing not found';
  end if;

  if p_survey_id is not null and not exists (
    select 1
    from public.business_surveys survey
    where survey.id = p_survey_id
      and survey.owner_id = auth.uid()
  ) then
    raise exception 'Survey not found';
  end if;

  insert into public.provider_leads (id, listing_id, sender_id, survey_id, data)
  values (p_id, p_listing_id, auth.uid(), p_survey_id, p_data)
  returning * into created_lead;

  return jsonb_build_object(
    'id', created_lead.id,
    'listing_id', created_lead.listing_id,
    'survey_id', created_lead.survey_id,
    'data', created_lead.data,
    'status', created_lead.status,
    'created_date', created_lead.created_date,
    'updated_date', created_lead.updated_date
  );
end;
$$;

create or replace function public.list_my_provider_leads()
returns jsonb
language sql
security definer
stable
set search_path = ''
as $$
  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', lead.id,
        'listing_id', lead.listing_id,
        'survey_id', lead.survey_id,
        'data', lead.data,
        'survey_data', survey.data,
        'status', lead.status,
        'created_date', lead.created_date,
        'updated_date', lead.updated_date
      ) order by lead.updated_date desc
    ),
    '[]'::jsonb
  )
  from public.provider_leads lead
  join public.directory_listings listing on listing.id = lead.listing_id
  left join public.business_surveys survey on survey.id = lead.survey_id
  where listing.owner_id = auth.uid()
    or (auth.jwt() -> 'app_metadata' ->> 'role') in ('staff', 'admin');
$$;

revoke insert on public.provider_leads from anon, authenticated;
revoke all on function public.create_provider_lead(uuid, uuid, jsonb, uuid) from public;
revoke all on function public.list_my_provider_leads() from public;

grant execute on function public.create_provider_lead(uuid, uuid, jsonb, uuid) to anon, authenticated;
grant execute on function public.list_my_provider_leads() to authenticated;

create index if not exists provider_leads_survey_idx
on public.provider_leads (survey_id)
where survey_id is not null;

commit;
