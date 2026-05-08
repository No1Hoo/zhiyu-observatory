# Ingestion Operations Design

## Goal

Build the second-stage operations loop for `智渔观察`: every ingestion run is traceable, admins can inspect and trigger collection from the dashboard, and production deployments have a protected cron endpoint that can be scheduled without exposing write access to the public.

## Scope

This stage covers two confirmed tracks:

- **A: Ingestion operations workbench** for source health, run history, manual sample ingestion, and review queue visibility.
- **C: Deployment and scheduled ingestion foundation** through a protected API endpoint, environment variables, GitHub Actions schedule template, and README instructions.

This stage does not implement broad crawling of third-party websites. Sample ingestion remains the safe initial collector, because the important system behavior is the quality-control loop: collect, deduplicate, classify, risk-mark, log, review, and publish manually.

## Data Model

Add an `IngestionRun` model:

- `id`
- `trigger`: `manual`, `cron`, or `cli`
- `status`: `running`, `success`, or `failed`
- `sourceId` and optional `Source` relation
- `startedAt`
- `finishedAt`
- `itemsSeen`
- `itemsCreated`
- `duplicates`
- `riskCount`
- `errorMessage`

The ingestion pipeline returns structured stats instead of only the created Intel rows. A duplicate is counted when a raw item already exists and has an associated Intel item. A risk item is counted when `riskLevel >= 3` or the risk assessor requires review.

`Source.lastCrawledAt`, `Source.lastStatus`, and `Source.lastError` are updated during each tracked run so source health can be viewed without reading every run record.

## Admin UX

Add `/admin/ingestion`.

The page shows:

- Top metrics: latest run status, runs today, created items today, risks today.
- Manual trigger form: starts sample ingestion with trigger `manual`.
- Recent runs table: time, trigger, source, status, seen, created, duplicate, risk, error.
- Source health table: enabled status, last crawled time, last status, last error.

Admin navigation adds a `采集` entry.

Manual ingestion does not publish content automatically. Items still enter the normal review flow according to risk/source policy.

## Cron API

Add `POST /api/cron/ingest`.

The endpoint requires:

- `Authorization: Bearer <CRON_SECRET>`
- `CRON_SECRET` must be configured in the environment.

On success it runs sample ingestion with trigger `cron` and returns JSON stats. On missing/incorrect secret it returns `401`. On collector failure it records a failed `IngestionRun` and returns `500`.

This endpoint is deliberately narrow. It is the stable seam for future collectors, RSS integrations, or paid data-provider APIs.

## Deployment Setup

Add:

- `.env.example` entry for `CRON_SECRET`
- `scripts/call-cron-ingest.ts` to call the deployed endpoint from local or CI
- GitHub Actions workflow `.github/workflows/ingest-cron.yml` that can run on schedule and call the deployed endpoint with repository secrets
- README instructions for required environment variables and schedule setup

The action requires:

- `ZHiyU_INGEST_URL` or `ZHIYU_INGEST_URL`
- `CRON_SECRET`

Use `ZHIYU_INGEST_URL` as the documented final secret name.

## Testing

Unit tests cover:

- ingestion stats for created, duplicate, and risk items
- run tracking success/failure behavior
- cron authorization behavior through the extracted auth helper

E2E tests cover:

- `/admin/ingestion` renders management entry points on desktop and mobile

Full verification:

```bash
npm run test
npm run build
npm run test:e2e
```

## Rollout

Commit and push after:

1. Spec and plan are written.
2. Data model and pipeline tracking pass tests.
3. Admin workbench and cron endpoint pass tests.
4. Full verification passes and docs are updated.
