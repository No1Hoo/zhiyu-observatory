import type { IntelItem, Source } from "@prisma/client";
import Link from "next/link";

type Props = {
  featured: Array<IntelItem & { source: Source }>;
};

export function HeroObservatory({ featured }: Props) {
  const primary = featured[0];

  return (
    <section className="relative overflow-hidden bg-obsidian text-foam">
      <div className="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_25%_20%,#4ddac5_0,transparent_28%),radial-gradient(circle_at_80%_0,#0e4f5c_0,transparent_30%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-8 px-5 py-12 lg:grid-cols-[1.25fr_0.75fr]">
        <div>
          <p className="text-sm font-semibold text-aqua">每日更新的水产产业情报站</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight md:text-6xl">智渔观察</h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-foam/78">
            追踪水产养殖技术、智能设备、AI 应用、饲料苗种、动保趋势与关键价格观察。每条信息标注来源，让行业变化更容易判断。
          </p>
          {primary ? (
            <Link href={`/intel/${primary.slug}`} className="mt-8 block rounded-lg border border-aqua/20 bg-white/8 p-5">
              <p className="text-xs text-aqua">今日核心情报</p>
              <h2 className="mt-2 text-2xl font-semibold">{primary.title}</h2>
              <p className="mt-3 text-sm leading-7 text-foam/75">{primary.aiSummary}</p>
            </Link>
          ) : null}
        </div>
        <div className="rounded-lg border border-aqua/20 bg-white/8 p-5">
          <p className="mb-4 text-sm font-semibold text-aqua">今日精选</p>
          <div className="space-y-3">
            {featured.slice(1, 5).map((item) => (
              <Link key={item.id} href={`/intel/${item.slug}`} className="block rounded-md bg-white/8 p-4 hover:bg-white/12">
                <p className="text-sm font-semibold leading-6">{item.title}</p>
                <p className="mt-2 text-xs text-foam/60">{item.source.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
