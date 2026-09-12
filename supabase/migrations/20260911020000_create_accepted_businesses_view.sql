begin;

-- Create database view for accepted/approved businesses
create or replace view public.accepted_businesses as
select
  id,
  owner_id,
  data->>'company_name' as company_name,
  data->>'category' as category,
  data->>'description' as description,
  data->>'email' as email,
  data->>'phone' as phone,
  data->>'website' as website,
  data->>'address' as address,
  data->>'city' as city,
  data->>'state' as state,
  data->>'zip' as zip,
  data->>'ein' as ein,
  data->>'sponsor_level' as sponsor_level,
  coalesce((data->>'is_approved')::boolean, false) as is_approved,
  coalesce(data->>'status', 'accepted') as status,
  data,
  created_date,
  updated_date
from public.directory_listings
where coalesce((data->>'is_approved')::boolean, false) = true
   or data->>'status' = 'accepted';

-- Grant read permissions on accepted businesses view
grant select on public.accepted_businesses to anon, authenticated;

-- RPC function to list accepted businesses
create or replace function public.list_accepted_businesses()
returns setof public.accepted_businesses
language sql
security definer
stable
set search_path = ''
as $$
  select * from public.accepted_businesses
  order by created_date desc;
$$;

grant execute on function public.list_accepted_businesses() to anon, authenticated;

commit;
