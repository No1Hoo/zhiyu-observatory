import { describe, expect, it } from "vitest";
import { resolveSqliteDatabasePath } from "../../scripts/sqlite-path";

describe("sqlite database path resolver", () => {
  it("matches Prisma's schema-relative path for local file urls", () => {
    expect(resolveSqliteDatabasePath("file:./dev.db")).toMatch(/prisma\/dev\.db$/);
  });

  it("supports absolute persistent disk paths for production", () => {
    expect(resolveSqliteDatabasePath("file:/data/zhiyu.db")).toBe("/data/zhiyu.db");
  });

  it("rejects non-sqlite urls", () => {
    expect(() => resolveSqliteDatabasePath("postgresql://example")).toThrow("Only SQLite file:");
  });
});
