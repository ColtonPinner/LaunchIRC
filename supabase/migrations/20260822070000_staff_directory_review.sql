begin;

drop policy if exists "Staff can read directory listings" on public.directory_listings;
create policy "Staff can read directory listings"
on public.directory_listings for select
to authenticated
using (
  (select auth.jwt() -> 'app_metadata' ->> 'role') in ('staff', 'admin')
);

drop policy if exists "Staff can update directory listings" on public.directory_listings;
create policy "Staff can update directory listings"
on public.directory_listings for update
to authenticated
using (
  (select auth.jwt() -> 'app_metadata' ->> 'role') in ('staff', 'admin')
)
with check (
  (select auth.jwt() -> 'app_metadata' ->> 'role') in ('staff', 'admin')
);

grant update on public.directory_listings to authenticated;

commit;
