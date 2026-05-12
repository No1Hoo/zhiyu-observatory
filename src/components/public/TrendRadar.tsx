import { Cpu, Droplets, Fish, RadioTower, Leaf, ShoppingCart, Globe, TrendingUp } from "lucide-react";
import { getTopCategories } from "@/lib/queries/public";

const CATEGORY_META: Record<string, { label: string; icon: React.ComponentType<{ className?: string }>; fallback: string }> = {
  AI_AQUACULTURE:  { label: "AI 识别",    icon: Cpu,          fallback: "热度上升" },
  SMART_EQUIPMENT: { label: "智能投喂",   icon: RadioTower,   fallback: "设备关注" },
  FEED_SEEDLING:   { label: "饲料苗种",   icon: Leaf,         fallback: "行情波动" },
  ANIMAL_HEALTH:   { label: "动物保健",   icon: Droplets,     fallback: "健康监控" },
  PRICE_MARKET:    { label: "价格行情",   icon: Fish,         fallback: "样本追踪" },
  ECOMMERCE:       { label: "电商渠道",   icon: ShoppingCart, fallback: "渠道变化" },
  OVERSEAS:        { label: "海外市场",   icon: Globe,        fallback: "全球动态" },
  POLICY:          { label: "政策动向",   icon: TrendingUp,   fallback: "政策关注" },
};

const STATS_MAP: Record<string, string> = {
  AI_AQUACULTURE:  "热度上升",
  SMART_EQUIPMENT: "设备关注",
  FEED_SEEDLING:   "行情波动",
  ANIMAL_HEALTH:   "健康监控",
  PRICE_MARKET:    "样本追踪",
  ECOMMERCE:       "渠道变化",
  OVERSEAS:        "全球动态",
  POLICY:          "政策关注",
};

export async function TrendRadar() {
  const categories = await getTopCategories();
  const trends = categories.map((c) => ({
    category: c.category,
    label: CATEGORY_META[c.category]?.label ?? c.category,
    value: STATS_MAP[c.category] ?? "内容丰富",
  }));

  const items = trends.length > 0 ? trends : [
    { category: "AI_AQUACULTURE", label: "AI 识别", value: "热度上升" },
    { category: "SMART_EQUIPMENT", label: "智能投喂", value: "设备关注" },
    { category: "ANIMAL_HEALTH", label: "水质监测", value: "应用扩散" },
    { category: "PRICE_MARKET", label: "价格观察", value: "样本追踪" },
  ];

  return (
    <section id="radar" className="px-5 pb-12 text-foam">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="signal-label">Trend Radar</p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-foam md:text-5xl">产业信号雷达</h2>
          </div>
          <p className="hidden max-w-md text-right text-sm leading-6 text-foam/48 md:block">将公开来源中的技术、设备、价格和政策动态压缩成可浏览的信号层。</p>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {items.map((trend, index) => {
            const Icon = CATEGORY_META[trend.category]?.icon ?? Cpu;
            return (
              <div key={trend.category} className="group premium-card relative overflow-hidden rounded-[1.7rem] p-5 transition hover:-translate-y-1 hover:border-aqua/35">
                <div className="absolute right-4 top-3 text-5xl font-black tracking-[-0.08em] text-white/[0.035]">0{index + 1}</div>
                <div className="grid h-11 w-11 place-items-center rounded-2xl border border-aqua/25 bg-aqua/10">
                  <Icon className="h-5 w-5 text-aqua" />
                </div>
                <h3 className="mt-8 text-xl font-black tracking-[-0.03em] text-foam group-hover:text-aqua">{trend.label}</h3>
                <p className="mt-2 text-sm text-foam/55">{trend.value}</p>
                <div className="mt-6 h-1 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-aqua/70" style={{ width: `${55 + index * 9}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}