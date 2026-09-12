begin;

drop policy if exists "Anyone can create events" on public.events;
create policy "Anyone can create events"
on public.events for insert
to anon, authenticated
with check (true);

grant select, insert, update on public.events to anon, authenticated;

commit;
