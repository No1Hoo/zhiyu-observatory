import type { IntelItem, Source } from "@prisma/client";
import Link from "next/link";
import { ArrowUpRight, DatabaseZap, Radar, Waves } from "lucide-react";

type Props = {
  featured: Array<IntelItem & { source: Source }>;
};

export function HeroObservatory({ featured }: Props) {
  const primary = featured[0];

  return (
    <section className="relative overflow-hidden px-5 py-12 text-foam md:py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-10 h-[520px] w-[520px] -translate-x-1/2 rounded-full border border-aqua/10" />
        <div className="absolute left-1/2 top-24 h-[360px] w-[360px] -translate-x-1/2 rounded-full border border-aqua/10" />
        <div className="absolute right-10 top-10 h-48 w-48 rounded-full bg-aqua/10 blur-3xl" />
      </div>
      <div className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div>
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-aqua/20 bg-aqua/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-aqua">
            <Radar className="h-4 w-4" />
            Daily Aquaculture Signal
          </div>
          <h1 className="max-w-4xl text-6xl font-black leading-[0.88] tracking-[-0.08em] text-foam md:text-8xl lg:text-9xl">
            智渔观察
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-foam/72 md:text-xl">
            追踪水产养殖技术、智能设备、AI 应用、饲料苗种、动保趋势与关键价格观察。把分散的信息源变成可判断、可追踪、可复盘的产业情报。
          </p>
          <div className="mt-9 grid gap-3 sm:grid-cols-3">
            <div className="premium-card rounded-3xl p-4">
              <DatabaseZap className="h-5 w-5 text-aqua" />
              <p className="mt-3 text-2xl font-black">Source</p>
              <p className="text-xs uppercase tracking-[0.18em] text-foam/45">公开来源追踪</p>
            </div>
            <div className="premium-card rounded-3xl p-4">
              <Waves className="h-5 w-5 text-aqua" />
              <p className="mt-3 text-2xl font-black">Review</p>
              <p className="text-xs uppercase tracking-[0.18em] text-foam/45">审核后发布</p>
            </div>
            <div className="premium-card rounded-3xl p-4">
              <Radar className="h-5 w-5 text-aqua" />
              <p className="mt-3 text-2xl font-black">Signal</p>
              <p className="text-xs uppercase tracking-[0.18em] text-foam/45">趋势雷达</p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          {primary ? (
            <Link href={`/intel/${primary.slug}`} className="group block overflow-hidden rounded-[2rem] border border-aqua/20 bg-gradient-to-br from-aqua/16 to-white/[0.045] p-6 shadow-[0_30px_100px_rgba(0,0,0,.28)] backdrop-blur-2xl">
              <div className="mb-10 flex items-center justify-between">
                <p className="signal-label">今日核心情报</p>
                <ArrowUpRight className="h-5 w-5 text-aqua transition group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
              <h2 className="text-3xl font-black leading-tight tracking-[-0.04em] text-foam">{primary.title}</h2>
              <p className="mt-4 line-clamp-4 text-sm leading-7 text-foam/66">{primary.aiSummary}</p>
              <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-foam/45">
                <span>{primary.source.name}</span>
                <span>Trust {primary.source.trustLevel}/5</span>
              </div>
            </Link>
          ) : null}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {featured.slice(1, 4).map((item) => (
              <Link key={item.id} href={`/intel/${item.slug}`} className="group rounded-3xl border border-white/10 bg-white/[0.055] p-4 backdrop-blur-xl transition hover:border-aqua/35 hover:bg-aqua/10">
                <p className="text-sm font-bold leading-6 text-foam group-hover:text-aqua">{item.title}</p>
                <p className="mt-2 text-xs text-foam/42">{item.source.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
