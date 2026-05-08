# Ingestion Operations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a traceable ingestion operations workbench and protected scheduled ingestion foundation for `智渔观察`.

**Architecture:** Extend Prisma with `IngestionRun`, refactor ingestion into a tracked runner that returns stats, then expose those stats through admin queries, a server action, and a protected cron API. Keep collectors narrow and safe by reusing sample ingestion data until real sources are vetted.

**Tech Stack:** Next.js App Router, TypeScript, Prisma, SQLite, Vitest, Playwright, GitHub Actions.

---

## File Structure

- Modify: `prisma/schema.prisma` to add `IngestionRun` and `Source.ingestionRuns`.
- Modify: `prisma/migrations/000_init/migration.sql` to create the new table for fresh local databases.
- Modify: `scripts/apply-sqlite-schema.ts` to make schema application idempotent for existing local databases.
- Create: `src/lib/ingestion/sample-items.ts` for deterministic sample collector input.
- Modify: `src/lib/ingestion/pipeline.ts` to return structured stats.
- Create: `src/lib/ingestion/runs.ts` for tracked run orchestration.
- Modify: `scripts/ingest-sample.ts` to use tracked CLI runs.
- Modify: `src/lib/queries/admin.ts` to fetch ingestion dashboard data.
- Modify: `src/app/actions/admin.ts` to add manual ingestion action.
- Modify: `src/components/admin/AdminShell.tsx` to include the ingestion nav item.
- Create: `src/components/admin/IngestionRunTable.tsx`.
- Create: `src/components/admin/SourceHealthTable.tsx`.
- Create: `src/app/admin/ingestion/page.tsx`.
- Create: `src/lib/cron/auth.ts`.
- Create: `src/app/api/cron/ingest/route.ts`.
- Create: `scripts/call-cron-ingest.ts`.
- Create: `.github/workflows/ingest-cron.yml`.
- Modify: `.env.example` and `README.md`.
- Add/modify tests under `tests/unit` and `tests/e2e`.

## Tasks

### Task 1: Spec and Plan

- [x] Write `docs/superpowers/specs/2026-05-08-ingestion-operations-design.md`.
- [x] Write `docs/superpowers/plans/2026-05-08-ingestion-operations.md`.
- [ ] Commit and push with `docs: add ingestion operations plan`.

### Task 2: Data Model and Pipeline Stats

- [ ] Write failing tests in `tests/unit/ingestion.test.ts` for `ingestItems` returning `{ itemsSeen, itemsCreated, duplicates, riskCount, intelItems }`.
- [ ] Run `npm run test -- tests/unit/ingestion.test.ts` and verify the new tests fail because stats are missing.
- [ ] Add `IngestionRun` to `prisma/schema.prisma` and migration SQL.
- [ ] Make `scripts/apply-sqlite-schema.ts` idempotently create missing tables and indexes.
- [ ] Refactor `src/lib/ingestion/pipeline.ts` to return stats.
- [ ] Run `npm run db:generate`, `npm run db:migrate`, and `npm run test -- tests/unit/ingestion.test.ts`.
- [ ] Commit and push with `feat: add ingestion run data model`.

### Task 3: Tracked Runs

- [ ] Create tests for `runSampleIngestion` success and failure in `tests/unit/ingestion-runs.test.ts`.
- [ ] Run the new test and verify it fails because `runSampleIngestion` does not exist.
- [ ] Create `src/lib/ingestion/sample-items.ts`.
- [ ] Create `src/lib/ingestion/runs.ts` to create/update `IngestionRun`, update source health, and return stats.
- [ ] Update `scripts/ingest-sample.ts`.
- [ ] Run `npm run ingest:sample` and targeted tests.
- [ ] Commit and push with `feat: track ingestion runs`.

### Task 4: Admin Workbench

- [ ] Add query tests or focused unit coverage for admin ingestion dashboard shape where practical.
- [ ] Modify `src/lib/queries/admin.ts` with `getAdminIngestionDashboard`.
- [ ] Add `triggerSampleIngestion` to `src/app/actions/admin.ts`.
- [ ] Create admin components and `/admin/ingestion`.
- [ ] Add `采集` nav item.
- [ ] Extend `tests/e2e/admin.spec.ts` to verify the ingestion workbench appears on desktop and mobile.
- [ ] Run E2E and commit with `feat: add ingestion admin workbench`.

### Task 5: Cron Endpoint and Deployment Setup

- [ ] Create `tests/unit/cron-auth.test.ts` for accepted and rejected bearer tokens.
- [ ] Implement `src/lib/cron/auth.ts`.
- [ ] Create `src/app/api/cron/ingest/route.ts`.
- [ ] Add `CRON_SECRET` to `.env.example`.
- [ ] Create `scripts/call-cron-ingest.ts`.
- [ ] Create `.github/workflows/ingest-cron.yml`.
- [ ] Update README deployment and schedule instructions.
- [ ] Run `npm run test`.
- [ ] Commit and push with `feat: add protected ingestion cron`.

### Task 6: Final Verification

- [ ] Run `npm run test`.
- [ ] Run `npm run build`.
- [ ] Run `npm run test:e2e`.
- [ ] Check `git status --short`.
- [ ] Push final state to GitHub.
