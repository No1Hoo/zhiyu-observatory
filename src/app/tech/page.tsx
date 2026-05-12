import { IntelCard } from "@/components/public/IntelCard";
import { SiteHeader } from "@/components/public/SiteHeader";
import { getPublishedIntelByCategory } from "@/lib/queries/public";

export const dynamic = "force-dynamic";

const CATEGORIES = [
  { value: "AI_AQUACULTURE", label: "AI 识别" }, { value: "SMART_EQUIPMENT", label: "智能投喂" }, { value: "FEED_SEEDLING", label: "饲料苗种" }, { value: "ANIMAL_HEALTH", label: "动物保健" }, { value: "PRICE_MARKET", label: "价格行情" }, { value: "ECOMMERCE", label: "电商渠道" }, { value: "OVERSEAS", label: "海外市场" }, { value: "POLICY", label: "政策动向" },
];

export default async function TechPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const items = await getPublishedIntelByCategory(category);

  return (
    <main className="min-h-screen text-foam">
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-5 py-12">
        <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="signal-label">Technology Signals</p>
            <h1 className="mt-2 text-5xl font-black tracking-[-0.065em] text-foam md:text-7xl">技术设备</h1>
          </div>
          <p className="max-w-md text-sm leading-6 text-foam/45 md:text-right">智能投喂、水质监测、AI 识别、尾水处理、饲料苗种与动保趋势。</p>
        </div>
        <div className="flex flex-wrap gap-2 rounded-[1.6rem] border border-white/10 bg-white/[0.045] p-3 backdrop-blur-xl">
          <a href="/tech" className={`rounded-full px-4 py-2 text-sm font-bold transition ${!category ? "bg-aqua/20 text-aqua" : "bg-white/[0.05] text-foam/55 hover:text-aqua"}`}>全部</a>
          {CATEGORIES.map((c) => <a key={c.value} href={`/tech?category=${c.value}`} className={`rounded-full px-4 py-2 text-sm font-bold transition ${category === c.value ? "bg-aqua/20 text-aqua" : "bg-white/[0.05] text-foam/55 hover:text-aqua"}`}>{c.label}</a>)}
        </div>
        {items.length > 0 ? <div className="mt-8 grid gap-4 md:grid-cols-2">{items.map((item) => <IntelCard key={item.id} item={item} />)}</div> : <div className="mt-12 rounded-[1.6rem] border border-white/10 bg-white/[0.045] p-10 text-center text-foam/35">该分类暂无内容</div>}
      </section>
    </main>
  );
}
