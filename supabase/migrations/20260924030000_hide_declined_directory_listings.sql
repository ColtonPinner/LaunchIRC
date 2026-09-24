begin;

create or replace function public.list_pending_directory_listings()
returns jsonb
language sql
security definer
stable
set search_path = ''
as $$
  select case
    when not public.can_review_directory() then
      jsonb_build_object('error', 'Not authorized')
    else coalesce(
      (
        select jsonb_agg(to_jsonb(listing) order by listing.created_date desc)
        from public.directory_listings listing
        where not coalesce((listing.data ->> 'is_approved')::boolean, false)
          and coalesce(listing.data ->> 'status', 'pending') not in ('accepted', 'rejected')
      ),
      '[]'::jsonb
    )
  end;
$$;

revoke all on function public.list_pending_directory_listings() from public, anon;
grant execute on function public.list_pending_directory_listings() to authenticated;

commit;
