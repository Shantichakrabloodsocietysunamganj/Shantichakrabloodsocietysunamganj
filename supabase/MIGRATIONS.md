# Database Migrations — apply order & notes

All files in this directory are **idempotent** (safe to re-run). Apply them in
this order in the Supabase SQL Editor (or via `supabase db push` if using the CLI).

## Current order

| # | File | Purpose |
|---|------|---------|
| 1 | `schema.sql` | Base schema, tables, RLS, realtime, requester follow-up |
| 2 | `donor-privacy.sql` | `public_donors` view, donor/request contact RPCs + logging (Phase 1) |
| 3 | `requester-followup.sql` | Device-ownership token + secure status RPC (Phase 1) |
| 4 | `phase2-privacy.sql` | **Phase 2** — base-table read lockdown, donor opt-out, leaderboard RPC |
| 5 | `phase2-consent-retention.sql` | **Phase 2** — scheduled retention cleanup + cron |

`enable-realtime.sql` is optional and only needed if the base-table realtime
publication is re-enabled (it is currently disabled for privacy reasons — the
frontend uses safe-view polling instead).

## Phase 2 SQL summary (what changed)

### `phase2-privacy.sql`
- `blood_requests`: `revoke select from anon` + scoped read policy
  (`requested_by = auth.uid() or is_staff()`).
- `public_blood_requests`: view tightened (drops `patient_age`, `patient_gender`;
  already excludes `contact_phone`, `hemoglobin`, `disease`, `requested_by`).
- `donors`: scoped read policy (`user_id = auth.uid() or is_staff()`).
- `public_donors`: view now respects `public_visible` opt-out flag.
- `donors.public_visible` column (opt-out from the public directory).
- `profiles`: read scoped to owner/staff (no more public phone/email).
- `public_volunteers`: safe view (no phone/email) + `revoke select from anon`.
- `get_donor_leaderboard(int)`: security-definer aggregation (donations are owner/staff-only).
- `get_donor_donation_count(uuid)`: public count for the donor-verify page.
- `get_donor_contact(...)`: now also rejects unavailable donors.
- `prune_contact_events(int)`: contact-event retention helper.

### `phase2-consent-retention.sql`
- `run_retention_cleanup()`: applies the retention policy (90d contact events,
  180d activity logs, 180d soft-deleted hard-delete, 365d request archival).
- Schedule it with pg_cron (see the file's header comment).

## ⚠️ IMPORTANT — verify against production

Phase 1 + Phase 2 SQL must be applied to the **production** Supabase project
before deploying this frontend, otherwise:

1. The old wide-open `"Public blood request read"` policy stays active and
   anonymous users can still read raw `blood_requests` rows.
2. The frontend now queries `public_donors` / `public_blood_requests` /
   `public_volunteers` — if the views are missing, those pages return no data.

**Do not execute migrations from application code.** Run them manually in the
Supabase Dashboard > SQL Editor, in the order above.

## Future migration split (planned, not yet applied)

The large `schema.sql` can be split into numbered migrations for cleaner
deployments and rollbacks:

```
001_initial_schema.sql
002_indexes.sql
003_soft_delete.sql
004_realtime.sql
005_requester_followup.sql
006_donor_privacy.sql
007_request_privacy.sql
008_consent_and_retention.sql
```

This is a documentation-only plan — `schema.sql` remains the single source of
truth until the split is performed and verified against production.
