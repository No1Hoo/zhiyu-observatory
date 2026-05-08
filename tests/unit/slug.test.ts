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
