-- CreateTable
CREATE TABLE "Source" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "crawlMethod" TEXT NOT NULL,
    "crawlFrequency" TEXT NOT NULL,
    "crawlLimit" INTEGER NOT NULL DEFAULT 20,
    "trustLevel" INTEGER NOT NULL DEFAULT 3,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "defaultReview" TEXT NOT NULL DEFAULT 'PENDING_REVIEW',
    "lastCrawledAt" DATETIME,
    "lastStatus" TEXT NOT NULL DEFAULT 'never_run',
    "lastError" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RawItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourceId" TEXT NOT NULL,
    "originalTitle" TEXT NOT NULL,
    "originalUrl" TEXT NOT NULL,
    "publishedAt" DATETIME,
    "fetchedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rawSummary" TEXT,
    "fingerprint" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    CONSTRAINT "RawItem_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "IntelItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rawItemId" TEXT,
    "sourceId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "aiSummary" TEXT NOT NULL,
    "editorSummary" TEXT,
    "category" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "species" TEXT,
    "equipment" TEXT,
    "region" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING_REVIEW',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "riskLevel" INTEGER NOT NULL DEFAULT 1,
    "sourceUrl" TEXT NOT NULL,
    "sourcePublishedAt" DATETIME,
    "publishedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "IntelItem_rawItemId_fkey" FOREIGN KEY ("rawItemId") REFERENCES "RawItem" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "IntelItem_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PriceObservation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourceId" TEXT NOT NULL,
    "species" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "market" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "unit" TEXT NOT NULL,
    "observedAt" DATETIME NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING_REVIEW',
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PriceObservation_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Topic" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "sponsored" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AdSlot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "page" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "sizeHint" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "label" TEXT NOT NULL DEFAULT '广告合作',
    "content" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "RawItem_fingerprint_key" ON "RawItem"("fingerprint");

-- CreateIndex
CREATE UNIQUE INDEX "IntelItem_rawItemId_key" ON "IntelItem"("rawItemId");

-- CreateIndex
CREATE UNIQUE INDEX "IntelItem_slug_key" ON "IntelItem"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Topic_slug_key" ON "Topic"("slug");

