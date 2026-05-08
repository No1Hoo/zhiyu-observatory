import { expect, test } from "@playwright/test";

test("home page shows Zhiyu Observatory public sections", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "智渔观察" })).toBeVisible();
  await expect(page.getByText("每日产业情报")).toBeVisible();
  await expect(page.getByText("样本型公开来源观察，不代表全市场实时价格。")).toBeVisible();
  await expect(page.getByText("合作位预留").or(page.getByText("首页右侧合作位"))).toBeVisible();
});
