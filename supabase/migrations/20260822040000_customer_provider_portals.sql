begin;

create table if not exists public.provider_leads (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.directory_listings(id) on delete cascade,
  sender_id uuid default auth.uid() references auth.users(id) on delete set null,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  provider_notes text not null default '',
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now()
);

alter table public.provider_leads enable row level security;

drop trigger if exists provider_leads_set_updated_date on public.provider_leads;
create trigger provider_leads_set_updated_date
before update on public.provider_leads
for each row execute function public.set_updated_date();

drop policy if exists "Anyone can contact approved providers" on public.provider_leads;
drop policy if exists "Providers can read their leads" on public.provider_leads;
drop policy if exists "Staff can read provider leads" on public.provider_leads;
drop policy if exists "Providers can read their listings" on public.directory_listings;

create policy "Anyone can contact approved providers"
on public.provider_leads for insert
to anon, authenticated
with check (
  (sender_id is null or sender_id = (select auth.uid()))
  and jsonb_typeof(data) = 'object'
  and length(trim(data ->> 'name')) between 1 and 120
  and length(trim(data ->> 'email')) between 3 and 320
  and exists (
    select 1
    from public.directory_listings listing
    where listing.id = listing_id
      and coalesce((listing.data ->> 'is_approved')::boolean, false)
  )
);

create policy "Providers can read their leads"
on public.provider_leads for select
to authenticated
using (
  exists (
    select 1
    from public.directory_listings listing
    where listing.id = listing_id
      and listing.owner_id = (select auth.uid())
  )
);

create policy "Staff can read provider leads"
on public.provider_leads for select
to authenticated
using (
  (select auth.jwt() -> 'app_metadata' ->> 'role') in ('staff', 'admin')
);

create policy "Providers can read their listings"
on public.directory_listings for select
to authenticated
using (owner_id = (select auth.uid()));

grant insert on public.provider_leads to anon, authenticated;
grant select on public.provider_leads to authenticated;

create or replace function public.list_my_concierge_requests()
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
        'data', request.data - 'staff_notes',
        'created_date', request.created_date,
        'updated_date', request.updated_date
      ) order by request.updated_date desc
    ),
    '[]'::jsonb
  )
  from public.concierge_requests request
  where request.owner_id = auth.uid();
$$;

create or replace function public.list_my_provider_requests()
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
        'provider_name', listing.data ->> 'company_name',
        'data', lead.data,
        'status', lead.status,
        'created_date', lead.created_date,
        'updated_date', lead.updated_date
      ) order by lead.updated_date desc
    ),
    '[]'::jsonb
  )
  from public.provider_leads lead
  join public.directory_listings listing on listing.id = lead.listing_id
  where lead.sender_id = auth.uid();
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
      or (auth.jwt() -> 'app_metadata' ->> 'role') in ('staff', 'admin')
    )
  returning lead.* into updated_lead;

  if updated_lead.id is null then
    raise exception 'Lead not found';
  end if;

  return jsonb_build_object(
    'id', updated_lead.id,
    'listing_id', updated_lead.listing_id,
    'data', updated_lead.data,
    'status', updated_lead.status,
    'created_date', updated_lead.created_date,
    'updated_date', updated_lead.updated_date
  );
end;
$$;

revoke all on function public.list_my_concierge_requests() from public;
revoke all on function public.list_my_provider_requests() from public;
revoke all on function public.update_provider_lead_status(uuid, text) from public;

grant execute on function public.list_my_concierge_requests() to authenticated;
grant execute on function public.list_my_provider_requests() to authenticated;
grant execute on function public.update_provider_lead_status(uuid, text) to authenticated;

create index if not exists provider_leads_listing_updated_idx
on public.provider_leads (listing_id, updated_date desc);

create index if not exists provider_leads_sender_updated_idx
on public.provider_leads (sender_id, updated_date desc);

commit;
