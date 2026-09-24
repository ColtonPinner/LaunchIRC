begin;

do $$
declare
  provider_id uuid;
begin
  select id
  into provider_id
  from public.account_profiles
  where account_type = 'provider'
  order by created_date
  limit 1;

  if provider_id is null then
    raise exception 'A provider account is required to add the pending demo business';
  end if;

  insert into public.directory_listings (id, owner_id, data)
  values (
    'b4000000-0000-4000-8000-000000000001',
    provider_id,
    jsonb_build_object(
      'company_name', 'Treasure Coast Launch Lab',
      'category', 'Business Consulting',
      'description', 'Demo application for reviewing the business approval workflow.',
      'email', 'hello@treasurecoastlaunchlab.example',
      'phone', '(772) 555-0142',
      'website', 'https://treasurecoastlaunchlab.example',
      'address', '123 Business Way',
      'city', 'Vero Beach',
      'state', 'FL',
      'zip', '32960',
      'ein', '12-3456789',
      'is_approved', false,
      'is_sponsor', false,
      'sponsor_level', 'none',
      'status', 'pending'
    )
  )
  on conflict (id) do update
  set owner_id = excluded.owner_id,
      data = excluded.data;
end;
$$;

commit;
