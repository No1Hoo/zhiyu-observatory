# Zhiyu Observatory MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first working MVP of `智渔观察`: a public aquaculture intelligence website with seeded content, source transparency, lightweight admin review workflow, and a conservative ingestion foundation.

**Architecture:** Use a Next.js App Router application with Prisma-managed relational data. Public pages read published `IntelItem`, `PriceObservation`, `Topic`, `Source`, and `AdSlot` data; internal admin pages manage sources, review queues, content, and ad/topic placeholders. Ingestion is implemented as a service layer plus CLI script first, so scheduled jobs can be added in a separate deployment task without coupling crawl logic to UI code.

**Tech Stack:** Next.js, TypeScript, React, Prisma, SQLite for local MVP, Zod, Vitest, Playwright, Tailwind CSS, lucide-react.

---

## GitHub Sync Rule

After each key task is complete and verified, commit the changes and push to the private GitHub repository immediately:

```bash
git status --short
git add <changed-files>
git commit -m "<task-specific message>"
git push
```

Do not wait until the whole MVP is complete. The private repo `No1Hoo/zhiyu-observatory` is the source of record for progress.

## File Structure

Create this structure inside the repository root:

```text
package.json
next.config.ts
tsconfig.json
postcss.config.mjs
tailwind.config.ts
vitest.config.ts
playwright.config.ts
prisma/schema.prisma
prisma/seed.ts
src/app/layout.tsx
src/app/page.tsx
src/app/today/page.tsx
src/app/tech/page.tsx
src/app/prices/page.tsx
src/app/sources/page.tsx
src/app/advertise/page.tsx
src/app/intel/[slug]/page.tsx
src/app/admin/layout.tsx
src/app/admin/page.tsx
src/app/admin/sources/page.tsx
src/app/admin/review/page.tsx
src/app/admin/content/page.tsx
src/app/admin/topics-ads/page.tsx
src/app/actions/admin.ts
src/components/public/SiteHeader.tsx
src/components/public/HeroObservatory.tsx
src/components/public/TrendRadar.tsx
src/components/public/IntelCard.tsx
src/components/public/PriceTicker.tsx
src/components/public/AdSlotBox.tsx
src/components/admin/AdminShell.tsx
src/components/admin/SourceTable.tsx
src/components/admin/ReviewQueue.tsx
src/components/admin/MetricCard.tsx
src/lib/db.ts
src/lib/queries/public.ts
src/lib/queries/admin.ts
src/lib/ingestion/types.ts
src/lib/ingestion/dedupe.ts
src/lib/ingestion/classify.ts
src/lib/ingestion/risk.ts
src/lib/ingestion/pipeline.ts
src/lib/format.ts
src/lib/slug.ts
src/lib/constants.ts
src/styles/globals.css
scripts/ingest-sample.ts
tests/unit/slug.test.ts
tests/unit/ingestion.test.ts
tests/unit/risk.test.ts
tests/e2e/home.spec.ts
tests/e2e/admin.spec.ts
```

Responsibility boundaries:

- `src/app/*`: Next.js pages and route-level composition only.
- `src/components/public/*`: public UI components.
- `src/components/admin/*`: admin UI components.
- `src/lib/queries/*`: database reads grouped by public/admin use.
- `src/lib/ingestion/*`: pure ingestion logic that can be tested without Next.js.
- `src/app/actions/admin.ts`: server actions for admin mutations.
- `prisma/seed.ts`: deterministic seed data for local demos and tests.
- `scripts/ingest-sample.ts`: local ingestion runner using fixture-like sample items.

## Task 1: Scaffold Next.js Project

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `postcss.config.mjs`
- Create: `tailwind.config.ts`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `src/styles/globals.css`
- Create: `src/app/layout.tsx`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "zhiyu-observatory",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:seed": "tsx prisma/seed.ts",
    "ingest:sample": "tsx scripts/ingest-sample.ts"
  },
  "dependencies": {
    "@prisma/client": "^5.22.0",
    "clsx": "^2.1.1",
    "lucide-react": "^0.468.0",
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@playwright/test": "^1.49.0",
    "@testing-library/react": "^16.1.0",
    "@types/node": "^22.10.2",
    "@types/react": "^19.0.1",
    "@types/react-dom": "^19.0.1",
    "autoprefixer": "^10.4.20",
    "jsdom": "^25.0.1",
    "postcss": "^8.4.49",
    "prisma": "^5.22.0",
    "tailwindcss": "^3.4.17",
    "tsx": "^4.19.2",
    "typescript": "^5.7.2",
    "vitest": "^2.1.8"
  }
}
```

- [ ] **Step 2: Create config files**

`next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    typedRoutes: true
  }
};

export default nextConfig;
```

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "es2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

`postcss.config.mjs`:

```js
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
};

export default config;
```

`tailwind.config.ts`:

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        obsidian: "#071b21",
        lagoon: "#0e4f5c",
        aqua: "#4ddac5",
        foam: "#dff8f2",
        ink: "#102025"
      }
    }
  },
  plugins: []
};

export default config;
```

`vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    include: ["tests/unit/**/*.test.ts"]
  },
  resolve: {
    alias: {
      "@": "/src"
    }
  }
});
```

`playwright.config.ts`:

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  webServer: {
    command: "npm run dev",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120000
  },
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry"
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } }
  ]
});
```

- [ ] **Step 3: Create global styles and root layout**

`src/styles/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: light;
  --page-bg: #f5faf9;
  --text: #102025;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background: var(--page-bg);
  color: var(--text);
  font-family: Arial, "Microsoft YaHei", sans-serif;
}

a {
  color: inherit;
  text-decoration: none;
}
```

`src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "智渔观察",
  description: "每日更新的水产产业技术、设备、AI 与价格情报站"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 4: Install dependencies**

Run:

```bash
npm install
```

Expected: `package-lock.json` is created and install exits with code 0.

- [ ] **Step 5: Run baseline checks**

Run:

```bash
npm run test
npm run build
```

Expected: dependency installation is valid. If `npm run build` reports that `src/app/page.tsx` is missing, create this temporary page before committing:

```tsx
export default function HomePage() {
  return <main>智渔观察 MVP</main>;
}
```

Then rerun `npm run build`; expected result is PASS.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json next.config.ts tsconfig.json postcss.config.mjs tailwind.config.ts vitest.config.ts playwright.config.ts src
git commit -m "chore: scaffold Next.js MVP"
```

## Task 2: Add Prisma Schema and Seed Data

**Files:**
- Create: `prisma/schema.prisma`
- Create: `prisma/seed.ts`
- Create: `src/lib/db.ts`
- Create: `src/lib/constants.ts`

- [ ] **Step 1: Create Prisma schema**

`prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

enum SourceType {
  OFFICIAL
  MEDIA
  COMMERCE
  RESEARCH
  EXHIBITION
  COMPANY
}

enum CrawlMethod {
  RSS
  API
  WEB_LIST
  MANUAL
}

enum CrawlFrequency {
  DAILY
  WEEKLY
  MANUAL
}

enum ReviewStatus {
  DRAFT
  PENDING_REVIEW
  PUBLISHED
  REJECTED
  ARCHIVED
}

enum IntelCategory {
  AI_AQUACULTURE
  SMART_EQUIPMENT
  FEED_SEEDLING
  ANIMAL_HEALTH
  PRICE_MARKET
  ECOMMERCE
  OVERSEAS
  POLICY
}

model Source {
  id                 String         @id @default(cuid())
  name               String
  url                String
  type               SourceType
  country            String
  crawlMethod        CrawlMethod
  crawlFrequency     CrawlFrequency
  crawlLimit         Int            @default(20)
  trustLevel         Int            @default(3)
  enabled            Boolean        @default(true)
  defaultReview      ReviewStatus   @default(PENDING_REVIEW)
  lastCrawledAt      DateTime?
  lastStatus         String         @default("never_run")
  lastError          String?
  createdAt          DateTime       @default(now())
  updatedAt          DateTime       @updatedAt
  rawItems           RawItem[]
  intelItems         IntelItem[]
  priceObservations  PriceObservation[]
}

model RawItem {
  id            String       @id @default(cuid())
  sourceId      String
  source        Source       @relation(fields: [sourceId], references: [id])
  originalTitle String
  originalUrl   String
  publishedAt   DateTime?
  fetchedAt     DateTime     @default(now())
  rawSummary    String?
  fingerprint   String       @unique
  status        ReviewStatus @default(DRAFT)
  intelItem     IntelItem?
}

model IntelItem {
  id              String        @id @default(cuid())
  rawItemId       String?       @unique
  rawItem         RawItem?      @relation(fields: [rawItemId], references: [id])
  sourceId        String
  source          Source        @relation(fields: [sourceId], references: [id])
  title           String
  slug            String        @unique
  aiSummary       String
  editorSummary   String?
  category        IntelCategory
  tags            String
  species         String?
  equipment       String?
  region          String?
  status          ReviewStatus  @default(PENDING_REVIEW)
  isFeatured      Boolean       @default(false)
  riskLevel       Int           @default(1)
  sourceUrl       String
  sourcePublishedAt DateTime?
  publishedAt     DateTime?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
}

model PriceObservation {
  id          String       @id @default(cuid())
  sourceId    String
  source      Source       @relation(fields: [sourceId], references: [id])
  species     String
  region      String
  market      String
  price       Float
  unit        String
  observedAt  DateTime
  sourceUrl   String
  status      ReviewStatus @default(PENDING_REVIEW)
  note        String?
  createdAt   DateTime     @default(now())
}

model Topic {
  id          String       @id @default(cuid())
  name        String
  slug        String       @unique
  description String
  tags        String
  sponsored   Boolean      @default(false)
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}

model AdSlot {
  id          String   @id @default(cuid())
  name        String
  page        String
  position    String
  sizeHint    String
  enabled     Boolean  @default(true)
  label       String   @default("广告合作")
  content     String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

- [ ] **Step 2: Create database helper**

`src/lib/db.ts`:

```ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"]
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

`src/lib/constants.ts`:

```ts
export const SITE_NAME = "智渔观察";

export const AI_DISCLOSURE = "AI 生成摘要，仅供参考，以原文来源为准。";

export const NAV_ITEMS = [
  { label: "今日情报", href: "/today" },
  { label: "趋势雷达", href: "/#radar" },
  { label: "技术设备", href: "/tech" },
  { label: "价格观察", href: "/prices" },
  { label: "数据来源", href: "/sources" },
  { label: "广告合作", href: "/advertise" }
];
```

- [ ] **Step 3: Create `.env`**

Create `.env`:

```bash
DATABASE_URL="file:./dev.db"
```

- [ ] **Step 4: Create seed data**

`prisma/seed.ts`:

```ts
import { PrismaClient, IntelCategory, ReviewStatus, SourceType, CrawlMethod, CrawlFrequency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.adSlot.deleteMany();
  await prisma.topic.deleteMany();
  await prisma.priceObservation.deleteMany();
  await prisma.intelItem.deleteMany();
  await prisma.rawItem.deleteMany();
  await prisma.source.deleteMany();

  const sources = await Promise.all([
    prisma.source.create({
      data: {
        name: "FAO GLOBEFISH",
        url: "https://www.fao.org/in-action/globefish/en",
        type: SourceType.OFFICIAL,
        country: "Global",
        crawlMethod: CrawlMethod.WEB_LIST,
        crawlFrequency: CrawlFrequency.WEEKLY,
        crawlLimit: 10,
        trustLevel: 5,
        defaultReview: ReviewStatus.PENDING_REVIEW
      }
    }),
    prisma.source.create({
      data: {
        name: "EUMOFA Data",
        url: "https://eumofa.eu/data",
        type: SourceType.OFFICIAL,
        country: "EU",
        crawlMethod: CrawlMethod.WEB_LIST,
        crawlFrequency: CrawlFrequency.WEEKLY,
        crawlLimit: 10,
        trustLevel: 5,
        defaultReview: ReviewStatus.PENDING_REVIEW
      }
    }),
    prisma.source.create({
      data: {
        name: "农业农村部数据",
        url: "https://data.moa.gov.cn/nyb/pc/index.jsp",
        type: SourceType.OFFICIAL,
        country: "中国",
        crawlMethod: CrawlMethod.WEB_LIST,
        crawlFrequency: CrawlFrequency.DAILY,
        crawlLimit: 20,
        trustLevel: 5,
        defaultReview: ReviewStatus.PENDING_REVIEW
      }
    })
  ]);

  await prisma.intelItem.createMany({
    data: [
      {
        sourceId: sources[0].id,
        title: "GLOBEFISH 持续跟踪国际水产品市场与价格趋势",
        slug: "globefish-market-price-trends",
        aiSummary: "国际水产品贸易依赖稳定、及时、独立的市场信息。该来源适合跟踪海外价格、贸易流和重点品种市场变化。",
        category: IntelCategory.OVERSEAS,
        tags: "国际市场,价格报告,贸易",
        region: "Global",
        status: ReviewStatus.PUBLISHED,
        isFeatured: true,
        riskLevel: 1,
        sourceUrl: "https://www.fao.org/in-action/globefish/en",
        publishedAt: new Date()
      },
      {
        sourceId: sources[1].id,
        title: "EUMOFA 提供欧盟水产养殖、进出口与消费数据入口",
        slug: "eumofa-aquaculture-import-export-data",
        aiSummary: "EUMOFA 数据覆盖 first sale、aquaculture、import-export、retail-consumption 等环节，可作为欧洲市场观察的数据来源。",
        category: IntelCategory.PRICE_MARKET,
        tags: "欧盟,数据,价格观察",
        region: "EU",
        status: ReviewStatus.PUBLISHED,
        isFeatured: true,
        riskLevel: 2,
        sourceUrl: "https://eumofa.eu/data",
        publishedAt: new Date()
      },
      {
        sourceId: sources[2].id,
        title: "农业农村部数据入口可作为国内批发市场与重点品种观察来源",
        slug: "moa-data-wholesale-key-species",
        aiSummary: "农业农村部数据站提供批发市场、重点品种等入口，适合作为国内价格观察的高可信来源。",
        category: IntelCategory.PRICE_MARKET,
        tags: "国内价格,批发市场,重点品种",
        region: "中国",
        status: ReviewStatus.PUBLISHED,
        isFeatured: true,
        riskLevel: 2,
        sourceUrl: "https://data.moa.gov.cn/nyb/pc/index.jsp",
        publishedAt: new Date()
      }
    ]
  });

  await prisma.priceObservation.create({
    data: {
      sourceId: sources[2].id,
      species: "南美白对虾",
      region: "华南",
      market: "样本行情",
      price: 38,
      unit: "元/斤",
      observedAt: new Date(),
      sourceUrl: "https://data.moa.gov.cn/nyb/pc/index.jsp",
      status: ReviewStatus.PENDING_REVIEW,
      note: "示例数据，用于展示价格观察页面结构。"
    }
  });

  await prisma.topic.createMany({
    data: [
      {
        name: "智能投喂设备观察",
        slug: "smart-feeding-equipment",
        description: "跟踪智能投喂、水质联动、养殖自动化设备动态。",
        tags: "智能投喂,设备,AI",
        sponsored: false
      },
      {
        name: "水产养殖 AI 应用观察",
        slug: "ai-aquaculture-watch",
        description: "跟踪 AI 识别、病害预警、养殖决策辅助和数据化管理。",
        tags: "AI,识别,预警",
        sponsored: false
      }
    ]
  });

  await prisma.adSlot.createMany({
    data: [
      {
        name: "首页右侧合作位",
        page: "home",
        position: "hero-side",
        sizeHint: "320x260",
        content: "智能设备、饲料苗种、动保企业可联系合作。"
      },
      {
        name: "文章详情页相关供应商",
        page: "intel-detail",
        position: "after-content",
        sizeHint: "responsive",
        content: "这里将展示相关供应商推荐。"
      }
    ]
  });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
```

- [ ] **Step 5: Generate and seed database**

Run:

```bash
npm run db:generate
npx prisma migrate dev --name init
npm run db:seed
```

Expected: Prisma client generated, migration created, seed completes without errors.

- [ ] **Step 6: Commit**

```bash
git add .env prisma src/lib/db.ts src/lib/constants.ts
git commit -m "feat: add data model and seed content"
```

## Task 3: Add Core Utilities and Ingestion Logic

**Files:**
- Create: `src/lib/slug.ts`
- Create: `src/lib/format.ts`
- Create: `src/lib/ingestion/types.ts`
- Create: `src/lib/ingestion/dedupe.ts`
- Create: `src/lib/ingestion/classify.ts`
- Create: `src/lib/ingestion/risk.ts`
- Create: `src/lib/ingestion/pipeline.ts`
- Create: `tests/unit/slug.test.ts`
- Create: `tests/unit/ingestion.test.ts`
- Create: `tests/unit/risk.test.ts`

- [ ] **Step 1: Write slug tests**

`tests/unit/slug.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { createSlug } from "@/lib/slug";

describe("createSlug", () => {
  it("creates readable slugs for English text", () => {
    expect(createSlug("AI Aquaculture Watch 2026")).toBe("ai-aquaculture-watch-2026");
  });

  it("falls back to a stable hash for Chinese text", () => {
    expect(createSlug("智能投喂设备观察")).toMatch(/^item-[a-f0-9]{8}$/);
  });
});
```

- [ ] **Step 2: Implement slug helper**

`src/lib/slug.ts`:

```ts
import { createHash } from "node:crypto";

export function createSlug(input: string): string {
  const ascii = input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  if (ascii.length > 0) return ascii.slice(0, 80);

  const digest = createHash("sha1").update(input).digest("hex").slice(0, 8);
  return `item-${digest}`;
}
```

- [ ] **Step 3: Write ingestion tests**

`tests/unit/ingestion.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { classifyItem } from "@/lib/ingestion/classify";
import { fingerprintRawItem } from "@/lib/ingestion/dedupe";

describe("ingestion helpers", () => {
  it("classifies smart equipment content", () => {
    const result = classifyItem("智能投喂设备在对虾养殖中应用", "水质监测与投喂联动");
    expect(result.category).toBe("SMART_EQUIPMENT");
    expect(result.tags).toContain("智能投喂");
  });

  it("classifies price content", () => {
    const result = classifyItem("南美白对虾价格上涨", "华南市场价格异动");
    expect(result.category).toBe("PRICE_MARKET");
    expect(result.tags).toContain("价格");
  });

  it("creates same fingerprint for equivalent source/title/url", () => {
    const one = fingerprintRawItem("source-a", "Title", "https://example.com/a");
    const two = fingerprintRawItem("source-a", "Title", "https://example.com/a");
    expect(one).toBe(two);
  });
});
```

`tests/unit/risk.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { assessRisk } from "@/lib/ingestion/risk";

describe("assessRisk", () => {
  it("requires review for price content", () => {
    const risk = assessRisk({ category: "PRICE_MARKET", title: "草鱼价格上涨", summary: "样本行情" });
    expect(risk.requiresReview).toBe(true);
    expect(risk.riskLevel).toBeGreaterThanOrEqual(2);
  });

  it("requires review for disease and drug advice", () => {
    const risk = assessRisk({ category: "ANIMAL_HEALTH", title: "病害防控用药建议", summary: "药品方案" });
    expect(risk.requiresReview).toBe(true);
    expect(risk.reasons).toContain("病害或动保建议");
  });

  it("allows low-risk exhibition news", () => {
    const risk = assessRisk({ category: "OVERSEAS", title: "国际水产展会开幕", summary: "展会资讯" });
    expect(risk.requiresReview).toBe(false);
  });
});
```

- [ ] **Step 4: Implement ingestion types and helpers**

`src/lib/ingestion/types.ts`:

```ts
import type { IntelCategory } from "@prisma/client";

export type IncomingRawItem = {
  sourceId: string;
  sourceName: string;
  title: string;
  url: string;
  summary?: string;
  publishedAt?: Date;
};

export type ClassificationResult = {
  category: IntelCategory;
  tags: string[];
  species?: string;
  equipment?: string;
  region?: string;
};

export type RiskResult = {
  riskLevel: number;
  requiresReview: boolean;
  reasons: string[];
};
```

`src/lib/ingestion/dedupe.ts`:

```ts
import { createHash } from "node:crypto";

export function fingerprintRawItem(sourceId: string, title: string, url: string): string {
  return createHash("sha256")
    .update(`${sourceId}|${title.trim().toLowerCase()}|${url.trim().toLowerCase()}`)
    .digest("hex");
}
```

`src/lib/ingestion/classify.ts`:

```ts
import { IntelCategory } from "@prisma/client";
import type { ClassificationResult } from "./types";

const keywordMap: Array<{ category: IntelCategory; tags: string[]; keywords: string[] }> = [
  { category: IntelCategory.SMART_EQUIPMENT, tags: ["智能设备"], keywords: ["智能投喂", "水质监测", "增氧", "设备", "传感器"] },
  { category: IntelCategory.AI_AQUACULTURE, tags: ["AI"], keywords: ["AI", "人工智能", "识别", "模型", "算法"] },
  { category: IntelCategory.FEED_SEEDLING, tags: ["饲料苗种"], keywords: ["饲料", "苗种", "虾苗", "鱼苗"] },
  { category: IntelCategory.ANIMAL_HEALTH, tags: ["动保"], keywords: ["病害", "动保", "药", "防控"] },
  { category: IntelCategory.PRICE_MARKET, tags: ["价格"], keywords: ["价格", "行情", "涨", "跌", "批发"] },
  { category: IntelCategory.ECOMMERCE, tags: ["电商"], keywords: ["电商", "热销", "平台", "采购"] },
  { category: IntelCategory.POLICY, tags: ["政策"], keywords: ["政策", "通知", "标准", "监管"] }
];

export function classifyItem(title: string, summary = ""): ClassificationResult {
  const text = `${title} ${summary}`;
  const found = keywordMap.find((entry) => entry.keywords.some((keyword) => text.includes(keyword)));

  if (!found) {
    return { category: IntelCategory.OVERSEAS, tags: ["行业动态"] };
  }

  const species = ["南美白对虾", "草鱼", "鲈鱼", "鳜鱼", "小龙虾"].find((item) => text.includes(item));
  const equipment = ["智能投喂", "水质监测", "增氧"].find((item) => text.includes(item));
  const region = ["华南", "华东", "华北", "中国", "欧盟"].find((item) => text.includes(item));

  return {
    category: found.category,
    tags: [...found.tags, ...found.keywords.filter((keyword) => text.includes(keyword)).slice(0, 3)],
    species,
    equipment,
    region
  };
}
```

`src/lib/ingestion/risk.ts`:

```ts
import { IntelCategory } from "@prisma/client";

type RiskInput = {
  category: keyof typeof IntelCategory;
  title: string;
  summary: string;
};

export function assessRisk(input: RiskInput) {
  const reasons: string[] = [];
  let riskLevel = 1;

  if (input.category === "PRICE_MARKET") {
    riskLevel = Math.max(riskLevel, 2);
    reasons.push("价格行情");
  }

  if (input.category === "ANIMAL_HEALTH" || /病害|动保|药|用药|防控/.test(`${input.title} ${input.summary}`)) {
    riskLevel = Math.max(riskLevel, 3);
    reasons.push("病害或动保建议");
  }

  if (/推荐|采购|代理|招商|独家/.test(`${input.title} ${input.summary}`)) {
    riskLevel = Math.max(riskLevel, 2);
    reasons.push("商业倾向");
  }

  return {
    riskLevel,
    requiresReview: riskLevel >= 2,
    reasons
  };
}
```

`src/lib/ingestion/pipeline.ts`:

```ts
import { ReviewStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { createSlug } from "@/lib/slug";
import { AI_DISCLOSURE } from "@/lib/constants";
import { classifyItem } from "./classify";
import { fingerprintRawItem } from "./dedupe";
import { assessRisk } from "./risk";
import type { IncomingRawItem } from "./types";

export async function ingestItems(items: IncomingRawItem[]) {
  const results = [];

  for (const item of items) {
    const fingerprint = fingerprintRawItem(item.sourceId, item.title, item.url);
    const raw = await prisma.rawItem.upsert({
      where: { fingerprint },
      update: {},
      create: {
        sourceId: item.sourceId,
        originalTitle: item.title,
        originalUrl: item.url,
        publishedAt: item.publishedAt,
        rawSummary: item.summary,
        fingerprint
      }
    });

    const existing = await prisma.intelItem.findUnique({ where: { rawItemId: raw.id } });
    if (existing) {
      results.push(existing);
      continue;
    }

    const classification = classifyItem(item.title, item.summary);
    const aiSummary = `${item.summary || item.title}\n\n${AI_DISCLOSURE}`;
    const risk = assessRisk({
      category: classification.category,
      title: item.title,
      summary: item.summary || ""
    });

    const created = await prisma.intelItem.create({
      data: {
        rawItemId: raw.id,
        sourceId: item.sourceId,
        title: item.title,
        slug: `${createSlug(item.title)}-${raw.id.slice(-6)}`,
        aiSummary,
        category: classification.category,
        tags: classification.tags.join(","),
        species: classification.species,
        equipment: classification.equipment,
        region: classification.region,
        status: risk.requiresReview ? ReviewStatus.PENDING_REVIEW : ReviewStatus.PUBLISHED,
        riskLevel: risk.riskLevel,
        sourceUrl: item.url,
        sourcePublishedAt: item.publishedAt,
        publishedAt: risk.requiresReview ? null : new Date()
      }
    });

    results.push(created);
  }

  return results;
}
```

`src/lib/format.ts`:

```ts
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "未标注日期";
  return new Intl.DateTimeFormat("zh-CN", { dateStyle: "medium" }).format(new Date(date));
}

export function splitTags(tags: string): string[] {
  return tags.split(",").map((tag) => tag.trim()).filter(Boolean);
}
```

- [ ] **Step 5: Run unit tests**

Run:

```bash
npm run test
```

Expected: slug, ingestion, and risk tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/lib tests/unit
git commit -m "feat: add ingestion utilities"
```

## Task 4: Build Public Query Layer and Components

**Files:**
- Create: `src/lib/queries/public.ts`
- Create: `src/components/public/SiteHeader.tsx`
- Create: `src/components/public/HeroObservatory.tsx`
- Create: `src/components/public/TrendRadar.tsx`
- Create: `src/components/public/IntelCard.tsx`
- Create: `src/components/public/PriceTicker.tsx`
- Create: `src/components/public/AdSlotBox.tsx`

- [ ] **Step 1: Create public queries**

`src/lib/queries/public.ts`:

```ts
import { ReviewStatus } from "@prisma/client";
import { prisma } from "@/lib/db";

export async function getHomeData() {
  const [featured, latest, prices, adSlots, topics] = await Promise.all([
    prisma.intelItem.findMany({
      where: { status: ReviewStatus.PUBLISHED, isFeatured: true },
      include: { source: true },
      orderBy: { publishedAt: "desc" },
      take: 5
    }),
    prisma.intelItem.findMany({
      where: { status: ReviewStatus.PUBLISHED },
      include: { source: true },
      orderBy: { publishedAt: "desc" },
      take: 12
    }),
    prisma.priceObservation.findMany({
      include: { source: true },
      orderBy: { observedAt: "desc" },
      take: 6
    }),
    prisma.adSlot.findMany({ where: { enabled: true, page: "home" } }),
    prisma.topic.findMany({ orderBy: { createdAt: "desc" }, take: 4 })
  ]);

  return { featured, latest, prices, adSlots, topics };
}

export async function getIntelBySlug(slug: string) {
  return prisma.intelItem.findUnique({
    where: { slug },
    include: { source: true }
  });
}

export async function getPublishedIntelByCategory(category?: string) {
  return prisma.intelItem.findMany({
    where: {
      status: ReviewStatus.PUBLISHED,
      ...(category ? { category: category as never } : {})
    },
    include: { source: true },
    orderBy: { publishedAt: "desc" },
    take: 50
  });
}

export async function getSources() {
  return prisma.source.findMany({ orderBy: [{ trustLevel: "desc" }, { name: "asc" }] });
}

export async function getPriceObservations() {
  return prisma.priceObservation.findMany({
    include: { source: true },
    orderBy: { observedAt: "desc" },
    take: 50
  });
}
```

- [ ] **Step 2: Create public components**

`src/components/public/SiteHeader.tsx`:

```tsx
import Link from "next/link";
import { Activity } from "lucide-react";
import { NAV_ITEMS, SITE_NAME } from "@/lib/constants";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-obsidian/92 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-2 text-foam">
          <Activity className="h-6 w-6 text-aqua" />
          <span className="text-lg font-semibold">{SITE_NAME}</span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-foam/80 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-aqua">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
```

`src/components/public/IntelCard.tsx`:

```tsx
import Link from "next/link";
import type { IntelItem, Source } from "@prisma/client";
import { formatDate, splitTags } from "@/lib/format";

type Props = {
  item: IntelItem & { source: Source };
};

export function IntelCard({ item }: Props) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex flex-wrap gap-2 text-xs">
        {splitTags(item.tags).slice(0, 3).map((tag) => (
          <span key={tag} className="rounded-full bg-cyan-50 px-2 py-1 text-lagoon">
            {tag}
          </span>
        ))}
      </div>
      <h3 className="text-lg font-semibold text-ink">
        <Link href={`/intel/${item.slug}`}>{item.title}</Link>
      </h3>
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{item.aiSummary}</p>
      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
        <span>{item.source.name}</span>
        <span>{formatDate(item.publishedAt || item.createdAt)}</span>
        <span>可信等级 {item.source.trustLevel}/5</span>
      </div>
    </article>
  );
}
```

`src/components/public/HeroObservatory.tsx`:

```tsx
import type { IntelItem, Source } from "@prisma/client";
import { IntelCard } from "./IntelCard";

type Props = {
  featured: Array<IntelItem & { source: Source }>;
};

export function HeroObservatory({ featured }: Props) {
  const primary = featured[0];

  return (
    <section className="bg-obsidian text-foam">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 lg:grid-cols-[1.25fr_0.75fr]">
        <div>
          <p className="text-sm font-semibold text-aqua">每日更新的水产产业情报站</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
            智渔观察
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-foam/78">
            追踪水产养殖技术、智能设备、AI 应用、饲料苗种、动保趋势与关键价格观察。每条信息标注来源，让行业变化更容易判断。
          </p>
          {primary ? (
            <div className="mt-8 rounded-lg border border-aqua/20 bg-white/8 p-5">
              <p className="text-xs text-aqua">今日核心情报</p>
              <h2 className="mt-2 text-2xl font-semibold">{primary.title}</h2>
              <p className="mt-3 text-sm leading-7 text-foam/75">{primary.aiSummary}</p>
            </div>
          ) : null}
        </div>
        <div className="rounded-lg border border-aqua/20 bg-white/8 p-4">
          <p className="mb-4 text-sm font-semibold text-aqua">今日精选</p>
          <div className="space-y-3">
            {featured.slice(1, 4).map((item) => (
              <IntelCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

`src/components/public/TrendRadar.tsx`:

```tsx
import { Cpu, Droplets, Fish, RadioTower } from "lucide-react";

const trends = [
  { label: "AI 识别", value: "热度上升", icon: Cpu },
  { label: "智能投喂", value: "设备关注", icon: RadioTower },
  { label: "水质监测", value: "应用扩散", icon: Droplets },
  { label: "价格观察", value: "样本追踪", icon: Fish }
];

export function TrendRadar() {
  return (
    <section id="radar" className="bg-obsidian px-5 pb-12 text-foam">
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">
        {trends.map((trend) => {
          const Icon = trend.icon;
          return (
            <div key={trend.label} className="rounded-lg border border-aqua/15 bg-white/7 p-5">
              <Icon className="h-6 w-6 text-aqua" />
              <h3 className="mt-4 text-lg font-semibold">{trend.label}</h3>
              <p className="mt-2 text-sm text-foam/70">{trend.value}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
```

`src/components/public/PriceTicker.tsx`:

```tsx
import type { PriceObservation, Source } from "@prisma/client";
import { formatDate } from "@/lib/format";

export function PriceTicker({ prices }: { prices: Array<PriceObservation & { source: Source }> }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <h2 className="text-xl font-semibold text-ink">价格观察</h2>
      <p className="mt-2 text-sm text-slate-500">样本型公开来源观察，不代表全市场实时价格。</p>
      <div className="mt-4 space-y-3">
        {prices.map((price) => (
          <div key={price.id} className="flex items-center justify-between border-t border-slate-100 pt-3 text-sm">
            <div>
              <p className="font-medium text-ink">{price.species} · {price.region}</p>
              <p className="text-slate-500">{price.market} · {price.source.name}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-lagoon">{price.price}{price.unit}</p>
              <p className="text-xs text-slate-500">{formatDate(price.observedAt)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

`src/components/public/AdSlotBox.tsx`:

```tsx
import type { AdSlot } from "@prisma/client";

export function AdSlotBox({ slot }: { slot?: AdSlot }) {
  return (
    <aside className="rounded-lg border border-dashed border-cyan-300 bg-cyan-50/70 p-5">
      <p className="text-xs font-semibold text-lagoon">{slot?.label || "广告合作"}</p>
      <h3 className="mt-2 text-lg font-semibold text-ink">{slot?.name || "合作位预留"}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        {slot?.content || "设备、饲料、苗种、动保企业可联系合作。"}
      </p>
    </aside>
  );
}
```

- [ ] **Step 3: Run type check via build after pages exist**

Skip build until Task 5 creates pages.

- [ ] **Step 4: Commit**

```bash
git add src/lib/queries src/components/public
git commit -m "feat: add public data components"
```

## Task 5: Build Public Pages

**Files:**
- Create: `src/app/page.tsx`
- Create: `src/app/today/page.tsx`
- Create: `src/app/tech/page.tsx`
- Create: `src/app/prices/page.tsx`
- Create: `src/app/sources/page.tsx`
- Create: `src/app/advertise/page.tsx`
- Create: `src/app/intel/[slug]/page.tsx`

- [ ] **Step 1: Create home page**

`src/app/page.tsx`:

```tsx
import { SiteHeader } from "@/components/public/SiteHeader";
import { HeroObservatory } from "@/components/public/HeroObservatory";
import { TrendRadar } from "@/components/public/TrendRadar";
import { IntelCard } from "@/components/public/IntelCard";
import { PriceTicker } from "@/components/public/PriceTicker";
import { AdSlotBox } from "@/components/public/AdSlotBox";
import { getHomeData } from "@/lib/queries/public";

export default async function HomePage() {
  const data = await getHomeData();

  return (
    <main>
      <SiteHeader />
      <HeroObservatory featured={data.featured} />
      <TrendRadar />
      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-10 lg:grid-cols-[1fr_340px]">
        <div>
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold text-lagoon">最新入库</p>
              <h2 className="text-2xl font-bold text-ink">每日产业情报</h2>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {data.latest.map((item) => (
              <IntelCard key={item.id} item={item} />
            ))}
          </div>
        </div>
        <div className="space-y-5">
          <PriceTicker prices={data.prices} />
          <AdSlotBox slot={data.adSlots[0]} />
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 2: Create list pages**

`src/app/today/page.tsx`:

```tsx
import { SiteHeader } from "@/components/public/SiteHeader";
import { IntelCard } from "@/components/public/IntelCard";
import { getPublishedIntelByCategory } from "@/lib/queries/public";

export default async function TodayPage() {
  const items = await getPublishedIntelByCategory();

  return (
    <main>
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-5 py-10">
        <h1 className="text-3xl font-bold text-ink">今日情报</h1>
        <p className="mt-3 text-slate-600">每天精选技术设备、AI 水产、饲料苗种、价格与海外动态。</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {items.map((item) => <IntelCard key={item.id} item={item} />)}
        </div>
      </section>
    </main>
  );
}
```

`src/app/tech/page.tsx`:

```tsx
import { IntelCategory } from "@prisma/client";
import { SiteHeader } from "@/components/public/SiteHeader";
import { IntelCard } from "@/components/public/IntelCard";
import { getPublishedIntelByCategory } from "@/lib/queries/public";

export default async function TechPage() {
  const items = await getPublishedIntelByCategory(IntelCategory.SMART_EQUIPMENT);

  return (
    <main>
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-5 py-10">
        <h1 className="text-3xl font-bold text-ink">技术设备</h1>
        <p className="mt-3 text-slate-600">智能投喂、水质监测、AI 识别、尾水处理、饲料苗种与动保趋势。</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {items.map((item) => <IntelCard key={item.id} item={item} />)}
        </div>
      </section>
    </main>
  );
}
```

`src/app/prices/page.tsx`:

```tsx
import { SiteHeader } from "@/components/public/SiteHeader";
import { PriceTicker } from "@/components/public/PriceTicker";
import { getPriceObservations } from "@/lib/queries/public";

export default async function PricesPage() {
  const prices = await getPriceObservations();

  return (
    <main>
      <SiteHeader />
      <section className="mx-auto max-w-4xl px-5 py-10">
        <h1 className="text-3xl font-bold text-ink">价格观察</h1>
        <p className="mt-3 text-slate-600">只展示公开来源样本数据，标注来源、地区和日期，不代表全市场实时价格。</p>
        <div className="mt-8">
          <PriceTicker prices={prices} />
        </div>
      </section>
    </main>
  );
}
```

`src/app/sources/page.tsx`:

```tsx
import { SiteHeader } from "@/components/public/SiteHeader";
import { getSources } from "@/lib/queries/public";

export default async function SourcesPage() {
  const sources = await getSources();

  return (
    <main>
      <SiteHeader />
      <section className="mx-auto max-w-5xl px-5 py-10">
        <h1 className="text-3xl font-bold text-ink">数据来源</h1>
        <p className="mt-3 text-slate-600">智渔观察保留每条信息的来源链接、发布时间和 AI 摘要说明。</p>
        <div className="mt-8 overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="p-4">来源</th>
                <th className="p-4">类型</th>
                <th className="p-4">地区</th>
                <th className="p-4">可信等级</th>
              </tr>
            </thead>
            <tbody>
              {sources.map((source) => (
                <tr key={source.id} className="border-t border-slate-100">
                  <td className="p-4 font-medium text-ink">
                    <a href={source.url} target="_blank" rel="noreferrer">{source.name}</a>
                  </td>
                  <td className="p-4">{source.type}</td>
                  <td className="p-4">{source.country}</td>
                  <td className="p-4">{source.trustLevel}/5</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
```

`src/app/advertise/page.tsx`:

```tsx
import { SiteHeader } from "@/components/public/SiteHeader";

export default function AdvertisePage() {
  return (
    <main>
      <SiteHeader />
      <section className="mx-auto max-w-4xl px-5 py-10">
        <p className="text-sm font-semibold text-lagoon">广告合作</p>
        <h1 className="mt-2 text-3xl font-bold text-ink">面向水产设备、饲料、苗种、动保企业的行业曝光</h1>
        <p className="mt-4 leading-7 text-slate-600">
          智渔观察第一阶段以公益信息和行业情报为主，预留专题赞助、供应商推荐卡、品牌广告位和采购咨询线索入口。
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {["专题赞助", "供应商推荐", "采购/咨询线索", "品牌广告位"].map((item) => (
            <div key={item} className="rounded-lg border border-slate-200 bg-white p-5">
              <h2 className="text-lg font-semibold text-ink">{item}</h2>
              <p className="mt-2 text-sm text-slate-600">当前为预留合作形式，后续根据流量数据开放。</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 3: Create detail page**

`src/app/intel/[slug]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/public/SiteHeader";
import { AdSlotBox } from "@/components/public/AdSlotBox";
import { AI_DISCLOSURE } from "@/lib/constants";
import { formatDate, splitTags } from "@/lib/format";
import { getIntelBySlug } from "@/lib/queries/public";

export default async function IntelDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getIntelBySlug(slug);
  if (!item) notFound();

  return (
    <main>
      <SiteHeader />
      <article className="mx-auto grid max-w-6xl gap-8 px-5 py-10 lg:grid-cols-[1fr_320px]">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex flex-wrap gap-2 text-xs">
            {splitTags(item.tags).map((tag) => (
              <span key={tag} className="rounded-full bg-cyan-50 px-2 py-1 text-lagoon">{tag}</span>
            ))}
          </div>
          <h1 className="mt-5 text-3xl font-bold leading-tight text-ink">{item.title}</h1>
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-500">
            <span>{item.source.name}</span>
            <span>{formatDate(item.sourcePublishedAt || item.publishedAt)}</span>
            <a href={item.sourceUrl} target="_blank" rel="noreferrer" className="text-lagoon">查看原文</a>
          </div>
          <div className="mt-8 whitespace-pre-line text-base leading-8 text-slate-700">{item.editorSummary || item.aiSummary}</div>
          <p className="mt-8 rounded-lg bg-slate-50 p-4 text-sm text-slate-500">{AI_DISCLOSURE}</p>
        </div>
        <AdSlotBox />
      </article>
    </main>
  );
}
```

- [ ] **Step 4: Run build**

Run:

```bash
npm run build
```

Expected: Next.js build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/app
git commit -m "feat: build public MVP pages"
```

## Task 6: Build Admin Query Layer and Actions

**Files:**
- Create: `src/lib/queries/admin.ts`
- Create: `src/app/actions/admin.ts`

- [ ] **Step 1: Create admin queries**

`src/lib/queries/admin.ts`:

```ts
import { ReviewStatus } from "@prisma/client";
import { prisma } from "@/lib/db";

export async function getAdminDashboard() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [rawToday, pending, published, failedSources, sources] = await Promise.all([
    prisma.rawItem.count({ where: { fetchedAt: { gte: today } } }),
    prisma.intelItem.count({ where: { status: ReviewStatus.PENDING_REVIEW } }),
    prisma.intelItem.count({ where: { status: ReviewStatus.PUBLISHED } }),
    prisma.source.count({ where: { lastStatus: "failed" } }),
    prisma.source.findMany({ orderBy: { updatedAt: "desc" }, take: 6 })
  ]);

  return { rawToday, pending, published, failedSources, sources };
}

export async function getAdminSources() {
  return prisma.source.findMany({ orderBy: [{ enabled: "desc" }, { name: "asc" }] });
}

export async function getReviewQueue() {
  return prisma.intelItem.findMany({
    where: { status: ReviewStatus.PENDING_REVIEW },
    include: { source: true },
    orderBy: [{ riskLevel: "desc" }, { createdAt: "desc" }],
    take: 100
  });
}

export async function getAdminContent() {
  return prisma.intelItem.findMany({
    include: { source: true },
    orderBy: { createdAt: "desc" },
    take: 100
  });
}

export async function getTopicsAndAds() {
  const [topics, adSlots] = await Promise.all([
    prisma.topic.findMany({ orderBy: { updatedAt: "desc" } }),
    prisma.adSlot.findMany({ orderBy: { updatedAt: "desc" } })
  ]);
  return { topics, adSlots };
}
```

- [ ] **Step 2: Create admin actions**

`src/app/actions/admin.ts`:

```ts
"use server";

import { revalidatePath } from "next/cache";
import { ReviewStatus } from "@prisma/client";
import { prisma } from "@/lib/db";

export async function publishIntelItem(id: string) {
  await prisma.intelItem.update({
    where: { id },
    data: {
      status: ReviewStatus.PUBLISHED,
      publishedAt: new Date()
    }
  });
  revalidatePath("/");
  revalidatePath("/admin/review");
}

export async function rejectIntelItem(id: string) {
  await prisma.intelItem.update({
    where: { id },
    data: { status: ReviewStatus.REJECTED }
  });
  revalidatePath("/admin/review");
}

export async function featureIntelItem(id: string) {
  await prisma.intelItem.update({
    where: { id },
    data: { isFeatured: true }
  });
  revalidatePath("/");
  revalidatePath("/admin/review");
}

export async function toggleSource(id: string, enabled: boolean) {
  await prisma.source.update({
    where: { id },
    data: { enabled }
  });
  revalidatePath("/admin/sources");
}
```

- [ ] **Step 3: Run build**

Run:

```bash
npm run build
```

Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/lib/queries/admin.ts src/app/actions/admin.ts
git commit -m "feat: add admin data actions"
```

## Task 7: Build Admin UI

**Files:**
- Create: `src/components/admin/AdminShell.tsx`
- Create: `src/components/admin/MetricCard.tsx`
- Create: `src/components/admin/SourceTable.tsx`
- Create: `src/components/admin/ReviewQueue.tsx`
- Create: `src/app/admin/layout.tsx`
- Create: `src/app/admin/page.tsx`
- Create: `src/app/admin/sources/page.tsx`
- Create: `src/app/admin/review/page.tsx`
- Create: `src/app/admin/content/page.tsx`
- Create: `src/app/admin/topics-ads/page.tsx`

- [ ] **Step 1: Create admin shell components**

`src/components/admin/AdminShell.tsx`:

```tsx
import Link from "next/link";

const adminNav = [
  { label: "Dashboard", href: "/admin" },
  { label: "Sources", href: "/admin/sources" },
  { label: "Review Queue", href: "/admin/review" },
  { label: "Content", href: "/admin/content" },
  { label: "Topics/Ads", href: "/admin/topics-ads" }
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white p-5 md:block">
        <h1 className="text-xl font-bold text-ink">智渔观察后台</h1>
        <nav className="mt-8 space-y-2">
          {adminNav.map((item) => (
            <Link key={item.href} href={item.href} className="block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-cyan-50">
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="md:pl-64">
        <div className="mx-auto max-w-6xl px-5 py-8">{children}</div>
      </main>
    </div>
  );
}
```

`src/components/admin/MetricCard.tsx`:

```tsx
export function MetricCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-ink">{value}</p>
    </div>
  );
}
```

- [ ] **Step 2: Create admin tables**

`src/components/admin/SourceTable.tsx`:

```tsx
import type { Source } from "@prisma/client";
import { toggleSource } from "@/app/actions/admin";

export function SourceTable({ sources }: { sources: Source[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="p-4">来源</th>
            <th className="p-4">类型</th>
            <th className="p-4">频率</th>
            <th className="p-4">状态</th>
            <th className="p-4">操作</th>
          </tr>
        </thead>
        <tbody>
          {sources.map((source) => (
            <tr key={source.id} className="border-t border-slate-100">
              <td className="p-4">
                <p className="font-medium text-ink">{source.name}</p>
                <p className="text-xs text-slate-500">{source.url}</p>
              </td>
              <td className="p-4">{source.type}</td>
              <td className="p-4">{source.crawlFrequency}</td>
              <td className="p-4">{source.enabled ? "启用" : "暂停"} · {source.lastStatus}</td>
              <td className="p-4">
                <form action={async () => {
                  "use server";
                  await toggleSource(source.id, !source.enabled);
                }}>
                  <button className="rounded-md bg-ink px-3 py-2 text-xs text-white">
                    {source.enabled ? "暂停" : "启用"}
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

`src/components/admin/ReviewQueue.tsx`:

```tsx
import type { IntelItem, Source } from "@prisma/client";
import { featureIntelItem, publishIntelItem, rejectIntelItem } from "@/app/actions/admin";

type Item = IntelItem & { source: Source };

export function ReviewQueue({ items }: { items: Item[] }) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <article key={item.id} className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span>{item.source.name}</span>
            <span>风险 {item.riskLevel}</span>
            <span>{item.category}</span>
          </div>
          <h2 className="mt-3 text-xl font-semibold text-ink">{item.title}</h2>
          <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">{item.aiSummary}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <form action={async () => {
              "use server";
              await publishIntelItem(item.id);
            }}>
              <button className="rounded-md bg-lagoon px-3 py-2 text-sm text-white">发布</button>
            </form>
            <form action={async () => {
              "use server";
              await featureIntelItem(item.id);
            }}>
              <button className="rounded-md bg-obsidian px-3 py-2 text-sm text-white">设为首页推荐</button>
            </form>
            <form action={async () => {
              "use server";
              await rejectIntelItem(item.id);
            }}>
              <button className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700">忽略</button>
            </form>
          </div>
        </article>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Create admin pages**

`src/app/admin/layout.tsx`:

```tsx
import { AdminShell } from "@/components/admin/AdminShell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
```

`src/app/admin/page.tsx`:

```tsx
import { MetricCard } from "@/components/admin/MetricCard";
import { getAdminDashboard } from "@/lib/queries/admin";

export default async function AdminPage() {
  const data = await getAdminDashboard();

  return (
    <div>
      <h1 className="text-3xl font-bold text-ink">Dashboard</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <MetricCard label="今日抓取" value={data.rawToday} />
        <MetricCard label="待审核" value={data.pending} />
        <MetricCard label="已发布" value={data.published} />
        <MetricCard label="失败来源" value={data.failedSources} />
      </div>
    </div>
  );
}
```

`src/app/admin/sources/page.tsx`:

```tsx
import { SourceTable } from "@/components/admin/SourceTable";
import { getAdminSources } from "@/lib/queries/admin";

export default async function AdminSourcesPage() {
  const sources = await getAdminSources();
  return (
    <div>
      <h1 className="text-3xl font-bold text-ink">Sources</h1>
      <p className="mt-2 text-slate-600">单独启用、停用和观察每个来源。</p>
      <div className="mt-6"><SourceTable sources={sources} /></div>
    </div>
  );
}
```

`src/app/admin/review/page.tsx`:

```tsx
import { ReviewQueue } from "@/components/admin/ReviewQueue";
import { getReviewQueue } from "@/lib/queries/admin";

export default async function AdminReviewPage() {
  const items = await getReviewQueue();
  return (
    <div>
      <h1 className="text-3xl font-bold text-ink">Review Queue</h1>
      <p className="mt-2 text-slate-600">审核价格、病害、技术建议、首页推荐和高风险内容。</p>
      <div className="mt-6"><ReviewQueue items={items} /></div>
    </div>
  );
}
```

`src/app/admin/content/page.tsx`:

```tsx
import { getAdminContent } from "@/lib/queries/admin";

export default async function AdminContentPage() {
  const items = await getAdminContent();
  return (
    <div>
      <h1 className="text-3xl font-bold text-ink">Content</h1>
      <div className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white">
        {items.map((item) => (
          <div key={item.id} className="border-t border-slate-100 p-4 first:border-t-0">
            <p className="font-medium text-ink">{item.title}</p>
            <p className="text-sm text-slate-500">{item.status} · {item.source.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

`src/app/admin/topics-ads/page.tsx`:

```tsx
import { getTopicsAndAds } from "@/lib/queries/admin";

export default async function TopicsAdsPage() {
  const { topics, adSlots } = await getTopicsAndAds();
  return (
    <div>
      <h1 className="text-3xl font-bold text-ink">Topics/Ads</h1>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <section className="rounded-lg bg-white p-5">
          <h2 className="text-xl font-semibold">专题</h2>
          {topics.map((topic) => <p key={topic.id} className="mt-3 text-sm text-slate-600">{topic.name}</p>)}
        </section>
        <section className="rounded-lg bg-white p-5">
          <h2 className="text-xl font-semibold">广告位</h2>
          {adSlots.map((slot) => <p key={slot.id} className="mt-3 text-sm text-slate-600">{slot.name} · {slot.position}</p>)}
        </section>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run build**

Run:

```bash
npm run build
```

Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/components/admin src/app/admin
git commit -m "feat: add admin management UI"
```

## Task 8: Add Sample Ingestion Script

**Files:**
- Create: `scripts/ingest-sample.ts`

- [ ] **Step 1: Create sample ingestion runner**

`scripts/ingest-sample.ts`:

```ts
import { prisma } from "@/lib/db";
import { ingestItems } from "@/lib/ingestion/pipeline";

async function main() {
  const source = await prisma.source.findFirst({ where: { enabled: true } });
  if (!source) {
    throw new Error("No enabled source found. Run npm run db:seed first.");
  }

  const items = await ingestItems([
    {
      sourceId: source.id,
      sourceName: source.name,
      title: "智能投喂设备在工厂化养殖中提升饲料利用率",
      url: `${source.url}#sample-smart-feeding`,
      summary: "样本内容：智能投喂设备与水质监测联动，帮助减少浪费并提升管理效率。",
      publishedAt: new Date()
    },
    {
      sourceId: source.id,
      sourceName: source.name,
      title: "南美白对虾价格样本出现区域分化",
      url: `${source.url}#sample-shrimp-price`,
      summary: "样本内容：不同地区样本价格表现不一致，需要结合来源和日期谨慎判断。",
      publishedAt: new Date()
    }
  ]);

  console.log(`Ingested ${items.length} items`);
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
```

- [ ] **Step 2: Run sample ingestion**

Run:

```bash
npm run ingest:sample
```

Expected: prints `Ingested 2 items`.

- [ ] **Step 3: Verify review queue changed**

Run:

```bash
npx prisma studio
```

Expected: `IntelItem` includes one smart equipment item and one price item; price item should be `PENDING_REVIEW`.

- [ ] **Step 4: Commit**

```bash
git add scripts/ingest-sample.ts
git commit -m "feat: add sample ingestion script"
```

## Task 9: Add E2E Tests

**Files:**
- Create: `tests/e2e/home.spec.ts`
- Create: `tests/e2e/admin.spec.ts`

- [ ] **Step 1: Create home E2E test**

`tests/e2e/home.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("home page shows Zhiyu Observatory public sections", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "智渔观察" })).toBeVisible();
  await expect(page.getByText("每日产业情报")).toBeVisible();
  await expect(page.getByText("价格观察")).toBeVisible();
  await expect(page.getByText("广告合作")).toBeVisible();
});
```

`tests/e2e/admin.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("admin dashboard exposes management entry points", async ({ page }) => {
  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  await expect(page.getByText("今日抓取")).toBeVisible();
  await page.getByRole("link", { name: "Sources" }).click();
  await expect(page.getByRole("heading", { name: "Sources" })).toBeVisible();
  await page.getByRole("link", { name: "Review Queue" }).click();
  await expect(page.getByRole("heading", { name: "Review Queue" })).toBeVisible();
});
```

- [ ] **Step 2: Run E2E tests**

Run:

```bash
npm run test:e2e
```

Expected: Chromium and mobile projects pass.

- [ ] **Step 3: Commit**

```bash
git add tests/e2e
git commit -m "test: add public and admin e2e coverage"
```

## Task 10: Final Verification and README Update

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Update README**

Replace `README.md` with:

```md
# 智渔观察

`智渔观察` 是一个免费的水产产业情报网站 MVP，重点追踪水产养殖技术、智能设备、AI 应用、饲料苗种、动保趋势，并用少量价格行情、电商动态和海外资讯作为流量入口。

## 功能

- 科技观察台风格首页
- 今日情报、技术设备、价格观察、数据来源、广告合作页面
- 信息详情页，保留来源和 AI 摘要说明
- 管理后台 Dashboard
- 来源管理
- 审核工作台
- 内容、专题、广告位管理
- 样本 ingestion 管线

## 本地运行

```bash
npm install
cp .env.example .env
npm run db:generate
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

打开：

- Public site: http://localhost:3000
- Admin: http://localhost:3000/admin

## 测试

```bash
npm run test
npm run build
npm run test:e2e
```

## 设计文档

- `docs/superpowers/specs/2026-05-08-zhiyu-observatory-design.md`
```

- [ ] **Step 2: Add `.env.example`**

Create `.env.example`:

```bash
DATABASE_URL="file:./dev.db"
```

- [ ] **Step 3: Run full verification**

Run:

```bash
npm run test
npm run build
npm run test:e2e
```

Expected: all commands pass.

- [ ] **Step 4: Commit and push**

```bash
git add README.md .env.example
git commit -m "docs: add MVP run instructions"
git push
```

## Self-Review

Spec coverage:

- Product positioning and visual direction are implemented by public pages and components in Tasks 4-5.
- Source transparency is implemented by `Source`, source list page, and detail source links in Tasks 2 and 5.
- Automatic ingestion foundation is implemented by Tasks 3 and 8.
- Source management and review queue are implemented by Tasks 6-7.
- Price observation is implemented by schema, seed data, and public price page in Tasks 2 and 5.
- Commercial placeholders are implemented by `AdSlot`, public ad components, advertise page, and admin topics/ads page.
- Conservative scope exclusions are respected: no user login, comments, online payment, enterprise self-service, trading system, or full real-time price database.

Placeholder scan:

- The plan intentionally avoids `TBD` and describes exact file paths, commands, and expected results.

Type consistency:

- Prisma enum names match usage in TypeScript examples.
- `ReviewStatus`, `IntelCategory`, `Source`, `IntelItem`, `PriceObservation`, and `AdSlot` names are used consistently.
