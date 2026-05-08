import { describe, expect, it } from "vitest";
import { isAuthorizedCronRequest } from "@/lib/cron/auth";

describe("cron auth", () => {
  it("accepts a matching bearer token", () => {
    const request = new Request("https://example.com/api/cron/ingest", {
      method: "POST",
      headers: { authorization: "Bearer test-secret" }
    });

    expect(isAuthorizedCronRequest(request, "test-secret")).toBe(true);
  });

  it("rejects missing, malformed, or mismatched tokens", () => {
    expect(isAuthorizedCronRequest(new Request("https://example.com/api/cron/ingest"), "test-secret")).toBe(false);

    expect(
      isAuthorizedCronRequest(
        new Request("https://example.com/api/cron/ingest", {
          headers: { authorization: "Basic test-secret" }
        }),
        "test-secret"
      )
    ).toBe(false);

    expect(
      isAuthorizedCronRequest(
        new Request("https://example.com/api/cron/ingest", {
          headers: { authorization: "Bearer wrong-secret" }
        }),
        "test-secret"
      )
    ).toBe(false);
  });

  it("rejects requests when the server secret is not configured", () => {
    const request = new Request("https://example.com/api/cron/ingest", {
      method: "POST",
      headers: { authorization: "Bearer test-secret" }
    });

    expect(isAuthorizedCronRequest(request, undefined)).toBe(false);
  });
});
