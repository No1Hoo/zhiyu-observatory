export type IntelCategory =
  | "AI_AQUACULTURE"
  | "SMART_EQUIPMENT"
  | "FEED_SEEDLING"
  | "ANIMAL_HEALTH"
  | "PRICE_MARKET"
  | "ECOMMERCE"
  | "OVERSEAS"
  | "POLICY";

export type ReviewStatus = "DRAFT" | "PENDING_REVIEW" | "PUBLISHED" | "REJECTED" | "ARCHIVED";

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
