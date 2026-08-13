-- =====================================================================
--  PHASE 2 — SCHEDULED DATA RETENTION CLEANUP
--  Run AFTER: phase2-privacy.sql
--  Safe to re-run (idempotent).
--
--  Retention policy (as documented on the /privacy page):
--   • contact events (hashed IP)     → 90 days
--   • activity logs                  → 180 days
--   • soft-deleted donors/requests   → 180 days (then hard-deleted)
--   • completed/cancelled requests   → 365 days (then archived)
-- =====================================================================

-- -------------------------------------------------------------------
-- 1) Single entry-point that applies the whole retention policy.
--    Invoke via pg_cron (Supabase cron), e.g. daily at 3am Dhaka (~21:00 UTC):
--
--      select cron.schedule('shantichakra-cleanup', '0 21 * * *',
--        $$select public.run_retention_cleanup()$$);
--
-- -------------------------------------------------------------------
create or replace function public.run_retention_cleanup()
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_contact_events int;
  v_activity_logs int;
begin
  -- contact events: 90 days
  select public.prune_contact_events(90) into v_contact_events;

  -- activity logs: 180 days
  with deleted as (
    delete from public.activity_logs
    where created_at < now() - interval '180 days'
    returning 1
  )
  select count(*)::int into v_activity_logs from deleted;

  -- hard-delete donors soft-deleted more than 180 days ago
  delete from public.donors
  where deleted_at is not null and deleted_at < now() - interval '180 days';

  -- hard-delete blood requests soft-deleted more than 180 days ago
  delete from public.blood_requests
  where deleted_at is not null and deleted_at < now() - interval '180 days';

  -- archive completed/cancelled requests older than 365 days
  -- (soft-delete keeps an audit trail before the hard-delete above)
  update public.blood_requests
  set deleted_at = now()
  where deleted_at is null
    and status in ('completed', 'cancelled')
    and created_at < now() - interval '365 days';

  return jsonb_build_object(
    'pruned_contact_events', v_contact_events,
    'pruned_activity_logs', v_activity_logs,
    'ran_at', now()
  );
end;
$$;

revoke all on function public.run_retention_cleanup() from public;
grant execute on function public.run_retention_cleanup() to service_role;
