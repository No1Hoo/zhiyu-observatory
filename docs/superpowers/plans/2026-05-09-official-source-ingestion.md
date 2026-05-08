# Official Source Ingestion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add controlled official-source web ingestion so `智渔观察` can collect real public links from trusted aquaculture information sources.

**Architecture:** Keep parsing pure and testable in `src/lib/ingestion/official-web.ts`, keep source configuration in `official-sources.ts`, and orchestrate tracked per-source runs through `runs.ts`. Reuse the existing ingestion pipeline, admin workbench, and cron auth layer.

**Tech Stack:** Next.js App Router, TypeScript, Prisma, SQLite, Vitest, Playwright, native `fetch`, HTML anchor parsing via regex constrained to link extraction.

---

## File Structure

- Create: `src/lib/ingestion/official-sources.ts` for curated source configuration.
- Create: `src/lib/ingestion/official-web.ts` for pure HTML link extraction and network collector.
- Modify: `src/lib/ingestion/runs.ts` to add `runOfficialWebIngestion`.
- Create: `scripts/ingest-official.ts` for local official ingestion.
- Modify: `package.json` to add `ingest:official`.
- Modify: `src/app/actions/admin.ts` to add `triggerOfficialIngestion`.
- Modify: `src/app/admin/ingestion/page.tsx` to add official ingestion button.
- Modify: `src/components/admin/SourceHealthTable.tsx` to show method/type.
- Modify: `src/app/api/cron/ingest/route.ts` to run official ingestion.
- Create: `tests/unit/official-web.test.ts`.
- Create: `tests/unit/official-runs.test.ts`.
- Modify: `README.md` with official ingestion notes.

## Tasks

### Task 1: Spec and Plan

- [x] Write `docs/superpowers/specs/2026-05-09-official-source-ingestion-design.md`.
- [x] Write `docs/superpowers/plans/2026-05-09-official-source-ingestion.md`.
- [ ] Commit and push with `docs: add official source ingestion plan`.

### Task 2: Official Web Parser

- [ ] Write failing tests in `tests/unit/official-web.test.ts` for extracting matching links, resolving relative URLs, dropping duplicates, and ignoring unrelated links.
- [ ] Run `npm run test -- tests/unit/official-web.test.ts` and verify import failure for missing module.
- [ ] Create `src/lib/ingestion/official-sources.ts` with FAO GLOBEFISH, EUMOFA, 农业农村部数据站, and 中国水产科学研究院.
- [ ] Create `src/lib/ingestion/official-web.ts` with `extractOfficialWebItems` and `collectOfficialWebItems`.
- [ ] Run targeted test and commit with `feat: add official web parser`.

### Task 3: Official Tracked Runs

- [ ] Write failing tests in `tests/unit/official-runs.test.ts` for successful per-source run logging and failed-source isolation.
- [ ] Run targeted test and verify `runOfficialWebIngestion` is missing.
- [ ] Add `runOfficialWebIngestion` to `src/lib/ingestion/runs.ts`.
- [ ] Create `scripts/ingest-official.ts`.
- [ ] Add `ingest:official` to `package.json`.
- [ ] Run tests and `npm run ingest:official`.
- [ ] Commit with `feat: add official source ingestion`.

### Task 4: Admin and Cron Integration

- [ ] Add `triggerOfficialIngestion` to `src/app/actions/admin.ts`.
- [ ] Add official ingestion button to `/admin/ingestion`.
- [ ] Show `crawlMethod` and `type` in Source Health.
- [ ] Change cron endpoint to run official ingestion.
- [ ] Update README.
- [ ] Run `npm run test`, `npm run build`, and `npm run test:e2e`.
- [ ] Commit and push with `feat: wire official ingestion into admin and cron`.

### Task 5: Final Verification

- [ ] Run `npm run db:seed`.
- [ ] Run `npm run test`.
- [ ] Run `npm run build`.
- [ ] Run `npm run test:e2e`.
- [ ] Confirm `git status --short` is clean.
- [ ] Push final state to GitHub.
