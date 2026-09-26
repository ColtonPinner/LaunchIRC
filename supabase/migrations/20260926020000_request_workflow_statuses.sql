begin;

alter table public.survey_expert_requests
  drop constraint if exists survey_expert_requests_status_check;
alter table public.survey_expert_requests
  add constraint survey_expert_requests_status_check
  check (status in ('new', 'accepted', 'contacted', 'closed', 'declined'));

alter table public.provider_leads
  drop constraint if exists provider_leads_status_check;
alter table public.provider_leads
  add constraint provider_leads_status_check
  check (status in ('new', 'accepted', 'contacted', 'closed'));

create or replace function public.update_expert_request_status(p_id uuid, p_status text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  updated_request public.survey_expert_requests;
begin
  if not public.can_view_expert_requests() then
    raise exception 'Not authorized';
  end if;

  if p_status not in ('new', 'accepted', 'contacted', 'closed', 'declined') then
    raise exception 'Invalid status';
  end if;

  update public.survey_expert_requests
  set status = p_status,
      claimed_by = case when p_status in ('new', 'declined') then null else auth.uid() end
  where id = p_id
  returning * into updated_request;

  if updated_request.id is null then
    raise exception 'Request not found';
  end if;

  return jsonb_build_object(
    'id', updated_request.id,
    'survey_id', updated_request.survey_id,
    'kind', updated_request.kind,
    'status', updated_request.status,
    'claimed_by', updated_request.claimed_by,
    'created_date', updated_request.created_date,
    'updated_date', updated_request.updated_date
  );
end;
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
  if p_status not in ('new', 'accepted', 'contacted', 'closed') then
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

revoke all on function public.update_expert_request_status(uuid, text) from public, anon;
revoke all on function public.update_provider_lead_status(uuid, text) from public, anon;
grant execute on function public.update_expert_request_status(uuid, text) to authenticated;
grant execute on function public.update_provider_lead_status(uuid, text) to authenticated;

commit;
