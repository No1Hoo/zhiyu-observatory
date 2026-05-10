import { describe, expect, it } from "vitest";
import { createSlug } from "@/lib/slug";

describe("createSlug", () => {
  it("creates readable slugs for English text", () => {
    expect(createSlug("AI Aquaculture Watch 2026")).toBe("ai-aquaculture-watch-2026");
  });

  it("creates readable pinyin slugs for Chinese text", () => {
    const slug = createSlug("智能投喂设备观察");
    expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    expect(slug.length).toBeLessThanOrEqual(80);
  });
});
