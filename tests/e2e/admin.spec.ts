import { expect, test } from "@playwright/test";

test("admin dashboard exposes management entry points", async ({ page }) => {
  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  await expect(page.getByText("今日抓取")).toBeVisible();
  await page.getByRole("link", { name: "Sources" }).click();
  await expect(page.getByRole("heading", { name: "Sources" })).toBeVisible();
  await page.getByRole("link", { name: "Review Queue" }).click();
  await expect(page.getByRole("heading", { name: "Review Queue" })).toBeVisible();
  await page.getByRole("link", { name: "Ingestion" }).click();
  await expect(page.getByRole("heading", { name: "Ingestion" })).toBeVisible();
  await expect(page.getByRole("button", { name: "手动触发样本采集" })).toBeVisible();
  await expect(page.getByText("Recent Runs")).toBeVisible();
  await expect(page.getByText("Source Health")).toBeVisible();
});
