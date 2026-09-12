begin;

-- Create trigger function that sends survey starts to both business and consultant tables
create or replace function public.sync_survey_to_business_and_consultant()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  existing_concierge_id uuid;
begin
  -- 1. Send to businesses (survey_expert_requests)
  insert into public.survey_expert_requests (survey_id, requester_id, kind)
  values (
    new.id,
    new.owner_id,
    case
      when coalesce(new.data ->> 'wants_realtor_contact', '') = 'yes'
        and coalesce(new.data ->> 'wants_expert_contact', '') <> 'yes'
      then 'realtor'
      else 'expert'
    end
  )
  on conflict (survey_id) do update set
    updated_date = now();

  -- 2. Send to consultants (concierge_requests)
  select id into existing_concierge_id
  from public.concierge_requests
  where data ->> 'survey_id' = new.id::text;

  if existing_concierge_id is null then
    insert into public.concierge_requests (owner_id, data)
    values (
      new.owner_id,
      jsonb_build_object(
        'survey_id', new.id,
        'name', coalesce(nullif(trim(new.data ->> 'full_name'), ''), 'New Business Start'),
        'email', coalesce(new.data ->> 'email', ''),
        'phone', coalesce(new.data ->> 'phone', ''),
        'business_type', coalesce(new.data ->> 'business_type', 'General'),
        'service_needed', coalesce(new.data ->> 'help_level', 'full_concierge'),
        'message', concat('New business launch survey started: ', coalesce(new.data ->> 'business_stage', 'Planning')),
        'status', 'new'
      )
    );
  else
    update public.concierge_requests
    set data = data || jsonb_build_object(
      'name', coalesce(nullif(trim(new.data ->> 'full_name'), ''), 'New Business Start'),
      'email', coalesce(new.data ->> 'email', ''),
      'phone', coalesce(new.data ->> 'phone', ''),
      'business_type', coalesce(new.data ->> 'business_type', 'General'),
      'service_needed', coalesce(new.data ->> 'help_level', 'full_concierge')
    )
    where id = existing_concierge_id;
  end if;

  return new;
end;
$$;

drop trigger if exists sync_survey_expert_request_after_change on public.business_surveys;
drop trigger if exists sync_survey_to_business_and_consultant_trigger on public.business_surveys;

create trigger sync_survey_to_business_and_consultant_trigger
after insert or update of data on public.business_surveys
for each row execute function public.sync_survey_to_business_and_consultant();

commit;
