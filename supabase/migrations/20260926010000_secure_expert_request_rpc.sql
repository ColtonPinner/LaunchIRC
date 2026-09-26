begin;

revoke all on function public.list_expert_requests() from public, anon;
grant execute on function public.list_expert_requests() to authenticated;

commit;
