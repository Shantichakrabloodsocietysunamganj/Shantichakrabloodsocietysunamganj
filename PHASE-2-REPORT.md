# Phase 2 Completion Report — Project Hardening, Privacy, Performance & UX

Branch: `arena/019ffaa4-shantichakrabloodsocietysunamg`
Base commit: `3b0e868` (Phase 1 — privacy behavior preserved)

---

## 1. What changed (files)

### New SQL migrations (must be run manually in Supabase — NOT auto-executed)
| File | Purpose |
|---|---|
| `supabase/phase2-privacy.sql` | Base-table read lockdown (donors/requests/volunteers/profiles), donor opt-out (`public_visible`), leaderboard + donation-count RPCs, contact RPC hardening, retention prune helper |
| `supabase/phase2-consent-retention.sql` | Scheduled retention cleanup (`run_retention_cleanup()`) + pg_cron instructions |
| `supabase/MIGRATIONS.md` | Apply order, notes, future `001…008` split plan |

### New frontend source files
- `src/lib/phone.ts` — `normalizeBdPhone` / `toBdE164` / `toWhatsAppNumber` / `isValidBdPhone` (Bangla digits, `+880`/`880`/dash/spaces)
- `src/lib/date.ts` — `Asia/Dhaka` date-only helpers (`parseDateOnly`, `addDaysToDateOnly`, `diffDays`, `fmtDateOnly`…)
- `src/lib/validation.ts` — shared Zod schemas (`donorSchema`, `bloodRequestSchema`, `contactSchema`, `volunteerSchema`, `newsletterSchema`, `bdPhoneSchema`)
- `src/lib/sanitize.ts` — `maskName`, `toPublicRequest`, sensitive-field guard
- `src/lib/roles.ts` — `isAdminRole` / `isStaffRole` (fixes `"staff"` vs `"moderator"` mismatch)
- `src/lib/ip.ts` — hashed-IP + client-IP helpers
- `vitest.config.mts` + 5 test files (58 tests)

### Key modified files
- `src/app/requests/[id]/page.tsx` — **removed raw `contact_phone` + hemoglobin/disease/age/gender** from public detail; uses safe view + masked names
- `src/app/donor/[id]/page.tsx` — migrated to `public_donors` view; centralized eligibility
- `src/app/page.tsx`, `impact`, `components/home/*`, `blood-seekers`, `components/*Card` — safe-view reads, no more base-table `select("*")` on public surfaces
- `src/app/api/donors/[id]/contact` + `requests/[id]/contact` — strict UUID/channel validation, central phone normalization, generic errors
- `src/app/api/upload/route.ts` — EXIF strip, SVG block, format lock, magic-byte, generic errors, `isStaffRole`
- `src/app/api/chat/route.ts` — body-size cap, token budget, timeout, fallback, generic errors, **cache-key fix (single-turn only)**, prompt-injection/leak guard
- `src/lib/donation.ts` — single source of truth for the 90-day rule (calendar-date math, no timezone drift)
- `src/lib/useLiveRequests.ts`, `LiveRequestAlert.tsx`, `EmergencyBanner.tsx` — base-table realtime removed; safe-view polling; sessionStorage stores only sanitized projection
- `src/lib/supabase/middleware.ts`, `src/lib/auth.ts` — `requireStaff()`, `isStaffRole` (moderator = admin-equivalent for blood content)
- `src/app/privacy/page.tsx` — added phone-privacy, contact logging, hashed-IP, retention, opt-out, deletion/correction sections
- `src/app/become-donor/*` — consent notice + shared schema + phone normalization

---

## 2. Acceptance criteria — status

| # | Criterion | Status |
|---|---|---|
| 1 | Raw phone absent from public donor/request response | ✅ (views + detail pages) |
| 2 | Unnecessary medical data absent from public request | ✅ (`public_blood_requests` drops age/gender; detail page drops hemoglobin/disease/age/gender) |
| 3 | Anonymous base-table access blocked | ✅ via `phase2-privacy.sql` (⚠️ requires manual SQL apply) |
| 4 | Admin authorization server-side | ✅ middleware + server `getSession` checks |
| 5 | Upload rejects unauthorized | ✅ (`isStaffRole`, 401) |
| 6 | Contact endpoint rejects invalid input | ✅ (UUID regex + channel enum + phone normalization) |
| 7 | Rate limit tested | ⚠️ SQL-level (RPC), not unit-tested — see limitations |
| 8 | Phone normalization tested | ✅ 18 tests |
| 9 | Eligibility centralized | ✅ `donation.ts` single rule |
| 10 | Timezone/date tests pass | ✅ 13 tests |
| 11 | `any` usage reduced | ✅ security-critical paths; ~130 remain project-wide (admin UI) |
| 12 | Automated tests pass | ✅ 58/58 |
| 13 | Lint pass | ✅ (only pre-existing `<img>` warnings) |
| 14 | `tsc --noEmit` pass | ✅ |
| 15 | Build pass | ✅ |
| 16 | donor/request detail noindex | ✅ (preserved from Phase 1) |
| 17 | Privacy consent/opt-out plan | ✅ implemented + documented |
| 18 | No secret committed | ✅ |
| 19 | Manual browser validation | ⚠️ requires staging + Supabase migration first |
| 20 | Known limitations reported | ✅ below |

---

## 3. ⚠️ What YOU must do before/at deploy

1. **Run SQL in Supabase** (Dashboard → SQL Editor), in order:
   `schema.sql` → `donor-privacy.sql` → `requester-followup.sql` →
   `phase2-privacy.sql` → `phase2-consent-retention.sql`
2. **Verify in Supabase** (SQL):
   - `select * from pg_policies where tablename in ('donors','blood_requests','profiles','volunteers');`
   - Confirm `public_donors`, `public_blood_requests`, `public_volunteers` views exist.
   - (Optional) schedule cron: `select cron.schedule('shantichakra-cleanup','0 21 * * *', $$select public.run_retention_cleanup()$$);`
3. **Environment variables (Vercel)**: unchanged from Phase 1 — no new vars required. (Existing `CLOUDINARY_*`, `GEMINI_API_KEY`/`OPENAI_API_KEY`, `CONTACT_RATE_LIMIT_SALT` still used.)
4. **Deploy preview/staging**, then manual test URLs below.

### Manual test URLs
- `/donors` — donor cards, no phone in HTML source
- `/donor/{id}` — verify page loads (uses `public_donors`)
- `/requests` + `/requests/{id}` — request detail shows masked name, **no phone/medical fields**
- `/blood-seekers` — live feed (polling)
- `/become-donor` — consent notice + validation (try `০১৭...` Bangla digits)
- `/request-blood` — validation (past `needed_date` rejected)
- `/api/donors/{invalid}/contact?channel=call` → 400
- `/api/requests/{invalid}/contact?channel=call` → 400
- Anonymous visit to `/admin` → redirect to `/login`

---

## 4. Known limitations / follow-ups

1. **Rate limiting is in-memory** (upload/chat) and SQL-based (contact RPC) — resets per serverless instance; for hard limits use an edge/Redis layer or Supabase Edge Functions. Contact RPC rate-limit is not unit-tested (needs a live DB).
2. **`any` not fully eliminated** — ~130 occurrences remain, mostly in admin UI (`select("*")` on admin-only pages is acceptable; full type-gen from `supabase gen types` not yet wired).
3. **Admin export** (`/admin/reports`) includes raw phone in CSV — gated admin-only (client) + RLS (server). Documented decision: phones are needed for internal coordination. Export event is not explicitly logged (see retention policy for `activity_logs`).
4. **Integration/E2E tests** are scoped as future work — unit tests cover phone/eligibility/date/CSV/sanitization; endpoint/RLS tests require a live Supabase test project.
5. **`<img>` vs `next/image`** — DonorCard/donor-detail/admin still use `<img>` (lint warnings). Cloudinary hostname is already allowlisted for when migrated.
6. **Production DB verification** could not be performed from this sandbox (no `.env` credentials) — SQL apply status is unverified (per rule 10, not self-executed).

---

## 5. Rollback

- SQL migrations are additive/idempotent. To roll back the read-lockdown:
  ```sql
  -- restore public donor read
  drop policy if exists "Own or staff donor read" on public.donors;
  create policy "Public donor read" on public.donors for select using (approved or public.is_admin());
  -- restore public request read
  drop policy if exists "Own or staff request read" on public.blood_requests;
  create policy "Public blood request read" on public.blood_requests for select using (true);
  grant select on public.blood_requests to anon;
  ```
- Frontend: `git revert <phase-2 commit>` on the session branch.
