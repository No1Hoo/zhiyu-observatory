# Official Source Ingestion Design

## Goal

Move `智渔观察` from sample-only ingestion to a small, controlled set of real official-source collectors. The first version should collect public page links from trusted sources, deduplicate them, mark risk, log runs, and keep all imported content in the existing review workflow.

## Source Strategy

Start with 3-5 stable sources that are useful to aquaculture operators and advertisers:

- FAO GLOBEFISH for global seafood market, trade, and price context.
- EUMOFA for EU seafood market and data updates.
- 农业农村部数据站 for domestic agriculture data and price indicators.
- 中国水产科学研究院 for aquaculture research and technical progress.

These sources are intentionally conservative. The collector fetches only public pages and extracts page links/titles. It does not scrape private APIs, bypass access controls, crawl deeply, or republish full articles.

## Collector Model

Add an official web-list collector:

- Source config declares `sourceName`, `url`, `country`, `type`, `categoryHint`, `trustLevel`, `limit`, and `includeKeywords`.
- Fetch the configured page.
- Parse anchor tags.
- Resolve relative URLs.
- Keep links with meaningful titles and matching aquaculture/business keywords.
- Convert links into `IncomingRawItem`.
- Use existing `ingestItems` for fingerprinting, classification, risk, and review status.

The parser is pure and unit-testable. Network fetching lives in a small adapter function so real network behavior can be replaced later with RSS, APIs, or source-specific collectors.

## Run Tracking

Add `runOfficialWebIngestion({ trigger })`.

The runner:

- Upserts configured sources into the `Source` table.
- Runs each enabled `official-web` source.
- Creates one `IngestionRun` per source.
- Updates `Source.lastCrawledAt`, `Source.lastStatus`, and `Source.lastError`.
- Continues to the next source if one source fails.
- Returns aggregate stats for the whole run.

All imported Intel items remain reviewable. Official ingestion does not automatically publish content.

## Admin UX

Enhance `/admin/ingestion`:

- Add a second manual button: `手动触发官方来源采集`.
- Show source crawl method/type in Source Health.
- Recent runs already display trigger and source; official runs appear there naturally.

## Cron Behavior

Change `POST /api/cron/ingest` to run official ingestion by default.

Sample ingestion remains available locally as `npm run ingest:sample`, while production cron should prefer official sources.

Add:

- `npm run ingest:official`
- `scripts/ingest-official.ts`

## Testing

Unit tests:

- Official HTML parser extracts and filters source links.
- Official runner records per-source success/failure without stopping all sources.
- Cron endpoint continues using the protected auth helper.

Verification:

```bash
npm run test
npm run build
npm run test:e2e
```

## Rollout

Commit and push after:

1. Spec and plan are written.
2. Parser and source config tests pass.
3. Official runner and CLI pass tests.
4. Admin and cron integration pass full verification.
