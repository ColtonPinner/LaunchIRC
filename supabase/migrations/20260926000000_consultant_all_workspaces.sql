begin;

drop policy if exists "Providers can submit directory listings" on public.directory_listings;
create policy "Providers and consultants can submit directory listings"
on public.directory_listings for insert
to authenticated
with check (
  owner_id = (select auth.uid())
  and (
    public.can_review_directory()
    or exists (
      select 1
      from public.account_profiles profile
      where profile.id = (select auth.uid())
        and profile.account_type = 'provider'
    )
  )
);

create or replace function public.can_view_expert_requests()
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select
    public.can_review_directory()
    or exists (
      select 1
      from public.directory_listings listing
      where listing.owner_id = auth.uid()
        and coalesce((listing.data ->> 'is_approved')::boolean, false)
    );
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
    or public.can_review_directory();
$$;

create or replace function public.update_provider_lead_status(p_id uuid, p_status text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  updated_lead public.provider_leads;
begin
  if p_status not in ('new', 'contacted', 'closed') then
    raise exception 'Invalid lead status';
  end if;

  update public.provider_leads lead
  set status = p_status
  where lead.id = p_id
    and (
      exists (
        select 1
        from public.directory_listings listing
        where listing.id = lead.listing_id
          and listing.owner_id = auth.uid()
      )
      or public.can_review_directory()
    )
  returning lead.* into updated_lead;

  if updated_lead.id is null then
    raise exception 'Lead not found';
  end if;

  return jsonb_build_object(
    'id', updated_lead.id,
    'listing_id', updated_lead.listing_id,
    'survey_id', updated_lead.survey_id,
    'data', updated_lead.data,
    'status', updated_lead.status,
    'created_date', updated_lead.created_date,
    'updated_date', updated_lead.updated_date
  );
end;
$$;

revoke all on function public.can_view_expert_requests() from public, anon;
revoke all on function public.list_my_provider_leads() from public, anon;
revoke all on function public.update_provider_lead_status(uuid, text) from public, anon;

grant execute on function public.can_view_expert_requests() to authenticated;
grant execute on function public.list_my_provider_leads() to authenticated;
grant execute on function public.update_provider_lead_status(uuid, text) to authenticated;

commit;
