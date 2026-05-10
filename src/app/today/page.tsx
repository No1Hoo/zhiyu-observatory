import { IntelCard } from "@/components/public/IntelCard";
import { SiteHeader } from "@/components/public/SiteHeader";
import { getPublishedIntelByCategory } from "@/lib/queries/public";

export const dynamic = "force-dynamic";

const CATEGORY_LABELS: Record<string, string> = {
  AI_AQUACULTURE:  "AI 识别",
  SMART_EQUIPMENT: "智能投喂",
  FEED_SEEDLING:   "饲料苗种",
  ANIMAL_HEALTH:   "动物保健",
  PRICE_MARKET:    "价格行情",
  ECOMMERCE:       "电商渠道",
  OVERSEAS:        "海外市场",
  POLICY:          "政策动向",
};

export default async function TodayPage() {
  const items = await getPublishedIntelByCategory();

  // Group by category
  const grouped = items.reduce<Record<string, typeof items>>((acc, item) => {
    (acc[item.category] ??= []).push(item);
    return acc;
  }, {});

  return (
    <main>
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-5 py-10">
        <h1 className="text-3xl font-bold text-ink">今日情报</h1>
        <p className="mt-3 text-slate-600">每天精选技术设备、AI 水产、饲料苗种、价格与海外动态。</p>

        {items.length === 0 ? (
          <div className="mt-12 text-center text-slate-400">暂无内容</div>
        ) : (
          <div className="mt-8 space-y-8">
            {Object.entries(grouped).map(([category, catItems]) => (
              <section key={category}>
                <h2 className="mb-4 border-b border-slate-100 pb-2 text-lg font-semibold text-ink">
                  {CATEGORY_LABELS[category] ?? category}
                  <span className="ml-2 text-sm font-normal text-slate-400">({catItems.length})</span>
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {catItems.map((item) => (
                    <IntelCard key={item.id} item={item} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
