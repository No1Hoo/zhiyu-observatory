import { IntelCard } from "@/components/public/IntelCard";
import { SiteHeader } from "@/components/public/SiteHeader";
import { getPublishedIntelByCategory } from "@/lib/queries/public";

const CATEGORIES = [
  { value: "AI_AQUACULTURE",  label: "AI 识别" },
  { value: "SMART_EQUIPMENT", label: "智能投喂" },
  { value: "FEED_SEEDLING",   label: "饲料苗种" },
  { value: "ANIMAL_HEALTH",   label: "动物保健" },
  { value: "PRICE_MARKET",    label: "价格行情" },
  { value: "ECOMMERCE",       label: "电商渠道" },
  { value: "OVERSEAS",        label: "海外市场" },
  { value: "POLICY",          label: "政策动向" },
];

export default async function TechPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const items = await getPublishedIntelByCategory(category);

  return (
    <main>
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-5 py-10">
        <h1 className="text-3xl font-bold text-ink">技术设备</h1>
        <p className="mt-3 text-slate-600">智能投喂、水质监测、AI 识别、尾水处理、饲料苗种与动保趋势。</p>

        {/* Category filter tabs */}
        <div className="mt-6 flex flex-wrap gap-2">
          <a
            href="/tech"
            className={`rounded-full px-4 py-1.5 text-sm transition ${
              !category
                ? "bg-lagoon text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            全部
          </a>
          {CATEGORIES.map((c) => (
            <a
              key={c.value}
              href={`/tech?category=${c.value}`}
              className={`rounded-full px-4 py-1.5 text-sm transition ${
                category === c.value
                  ? "bg-lagoon text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {c.label}
            </a>
          ))}
        </div>

        {items.length > 0 ? (
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {items.map((item) => (
              <IntelCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="mt-12 text-center text-slate-400">
            该分类暂无内容
          </div>
        )}
      </section>
    </main>
  );
}