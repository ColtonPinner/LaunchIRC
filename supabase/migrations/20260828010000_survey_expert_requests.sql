begin;

-- Surveys are owner-private. When a user opts in to expert contact (survey Q10),
-- a request row is published here so approved directory businesses can respond.
create table if not exists public.survey_expert_requests (
  id uuid primary key default gen_random_uuid(),
  survey_id uuid not null unique references public.business_surveys(id) on delete cascade,
  requester_id uuid references auth.users(id) on delete set null,
  kind text not null default 'expert' check (kind in ('expert', 'realtor')),
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  claimed_by uuid references auth.users(id) on delete set null,
  provider_notes text not null default '',
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now()
);

alter table public.survey_expert_requests enable row level security;

drop trigger if exists survey_expert_requests_set_updated_date on public.survey_expert_requests;
create trigger survey_expert_requests_set_updated_date
before update on public.survey_expert_requests
for each row execute function public.set_updated_date();

create index if not exists survey_expert_requests_status_idx
on public.survey_expert_requests (status, updated_date desc);

-- Keeps the request list in sync with the survey answers.
create or replace function public.sync_survey_expert_request()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  wants_expert boolean;
  wants_realtor boolean;
begin
  wants_expert := coalesce(new.data ->> 'wants_expert_contact', '') = 'yes';
  wants_realtor := coalesce(new.data ->> 'wants_realtor_contact', '') = 'yes';

  if wants_expert or wants_realtor then
    insert into public.survey_expert_requests (survey_id, requester_id, kind)
    values (
      new.id,
      new.owner_id,
      case when wants_realtor and not wants_expert then 'realtor' else 'expert' end
    )
    on conflict (survey_id) do update set
      kind = excluded.kind,
      updated_date = now();
  else
    -- Opting back out withdraws the request unless a business already engaged.
    delete from public.survey_expert_requests
    where survey_id = new.id and status = 'new';
  end if;

  return new;
end;
$$;

drop trigger if exists sync_survey_expert_request_after_change on public.business_surveys;
create trigger sync_survey_expert_request_after_change
after insert or update of data on public.business_surveys
for each row execute function public.sync_survey_expert_request();

-- Only owners of an approved listing (or staff) may see opted-in requests.
create or replace function public.can_view_expert_requests()
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select
    (select auth.jwt() -> 'app_metadata' ->> 'role') in ('staff', 'admin')
    or exists (
      select 1
      from public.directory_listings listing
      where listing.owner_id = auth.uid()
        and coalesce((listing.data ->> 'is_approved')::boolean, false)
    );
$$;

drop policy if exists "Approved businesses can read expert requests" on public.survey_expert_requests;
create policy "Approved businesses can read expert requests"
on public.survey_expert_requests for select
to authenticated
using (public.can_view_expert_requests());

drop policy if exists "Requesters can read their own expert request" on public.survey_expert_requests;
create policy "Requesters can read their own expert request"
on public.survey_expert_requests for select
to authenticated
using (requester_id = (select auth.uid()));

create or replace function public.list_expert_requests()
returns jsonb
language sql
security definer
stable
set search_path = ''
as $$
  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', request.id,
        'survey_id', request.survey_id,
        'kind', request.kind,
        'status', request.status,
        'claimed_by', request.claimed_by,
        'provider_notes', request.provider_notes,
        'survey_data', survey.data,
        'name', survey.data ->> 'full_name',
        'email', survey.data ->> 'email',
        'phone', survey.data ->> 'phone',
        'business_type', survey.data ->> 'business_type',
        'business_stage', survey.data ->> 'business_stage',
        'jurisdiction', survey.data ->> 'jurisdiction',
        'created_date', request.created_date,
        'updated_date', request.updated_date
      ) order by request.updated_date desc
    ),
    '[]'::jsonb
  )
  from public.survey_expert_requests request
  join public.business_surveys survey on survey.id = request.survey_id
  where public.can_view_expert_requests();
$$;

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

  if p_status not in ('new', 'contacted', 'closed') then
    raise exception 'Invalid status';
  end if;

  update public.survey_expert_requests
  set status = p_status,
      claimed_by = case when p_status = 'new' then null else auth.uid() end
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

revoke all on function public.list_expert_requests() from public;
revoke all on function public.update_expert_request_status(uuid, text) from public;
revoke all on function public.can_view_expert_requests() from public;

grant select on public.survey_expert_requests to authenticated;
grant execute on function public.can_view_expert_requests() to authenticated;
grant execute on function public.list_expert_requests() to authenticated;
grant execute on function public.update_expert_request_status(uuid, text) to authenticated;

-- Publish requests for surveys that already opted in before this migration.
insert into public.survey_expert_requests (survey_id, requester_id, kind)
select
  survey.id,
  survey.owner_id,
  case
    when coalesce(survey.data ->> 'wants_realtor_contact', '') = 'yes'
      and coalesce(survey.data ->> 'wants_expert_contact', '') <> 'yes'
    then 'realtor'
    else 'expert'
  end
from public.business_surveys survey
where coalesce(survey.data ->> 'wants_expert_contact', '') = 'yes'
   or coalesce(survey.data ->> 'wants_realtor_contact', '') = 'yes'
on conflict (survey_id) do nothing;

commit;
