import { IntelCard } from "@/components/public/IntelCard";
import { SiteHeader } from "@/components/public/SiteHeader";
import { getPublishedIntelByCategory } from "@/lib/queries/public";

export default async function TechPage() {
  const items = await getPublishedIntelByCategory("SMART_EQUIPMENT");

  return (
    <main>
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-5 py-10">
        <h1 className="text-3xl font-bold text-ink">技术设备</h1>
        <p className="mt-3 text-slate-600">智能投喂、水质监测、AI 识别、尾水处理、饲料苗种与动保趋势。</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <IntelCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </main>
  );
}
