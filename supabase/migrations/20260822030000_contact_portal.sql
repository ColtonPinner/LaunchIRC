begin;

alter table public.concierge_requests alter column owner_id drop not null;
alter table public.concierge_requests alter column owner_id set default auth.uid();
alter table public.concierge_requests enable row level security;

drop policy if exists "Anyone can submit concierge requests" on public.concierge_requests;
drop policy if exists "Staff can read concierge requests" on public.concierge_requests;
drop policy if exists "Staff can update concierge requests" on public.concierge_requests;

create policy "Anyone can submit concierge requests"
on public.concierge_requests for insert
to anon, authenticated
with check (
  (owner_id is null or owner_id = (select auth.uid()))
  and jsonb_typeof(data) = 'object'
  and length(trim(data ->> 'name')) between 1 and 120
  and length(trim(data ->> 'email')) between 3 and 320
  and not (data ? 'status')
  and not (data ? 'staff_notes')
);

create policy "Staff can read concierge requests"
on public.concierge_requests for select
to authenticated
using (
  (select auth.jwt() -> 'app_metadata' ->> 'role') in ('staff', 'admin')
);

create policy "Staff can update concierge requests"
on public.concierge_requests for update
to authenticated
using (
  (select auth.jwt() -> 'app_metadata' ->> 'role') in ('staff', 'admin')
)
with check (
  (select auth.jwt() -> 'app_metadata' ->> 'role') in ('staff', 'admin')
);

grant insert on public.concierge_requests to anon, authenticated;
grant select, update on public.concierge_requests to authenticated;

create index if not exists concierge_requests_status_updated_idx
on public.concierge_requests ((coalesce(data ->> 'status', 'new')), updated_date desc);

commit;
