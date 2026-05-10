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

  // Fallback if DB is empty
  if (trends.length === 0) {
    const staticFallback = [
      { label: "AI 识别",    value: "热度上升", icon: Cpu },
      { label: "智能投喂",   value: "设备关注", icon: RadioTower },
      { label: "水质监测",   value: "应用扩散", icon: Droplets },
      { label: "价格观察",   value: "样本追踪", icon: Fish },
    ];
    return (
      <section id="radar" className="bg-obsidian px-5 pb-12 text-foam">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">
          {staticFallback.map((trend) => {
            const Icon = trend.icon;
            return (
              <div key={trend.label} className="rounded-lg border border-aqua/15 bg-white/7 p-5">
                <Icon className="h-6 w-6 text-aqua" />
                <h3 className="mt-4 text-lg font-semibold">{trend.label}</h3>
                <p className="mt-2 text-sm text-foam/70">{trend.value}</p>
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  return (
    <section id="radar" className="bg-obsidian px-5 pb-12 text-foam">
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">
        {trends.map((trend) => {
          const Icon = CATEGORY_META[trend.category]?.icon ?? Cpu;
          return (
            <div key={trend.category} className="rounded-lg border border-aqua/15 bg-white/7 p-5">
              <Icon className="h-6 w-6 text-aqua" />
              <h3 className="mt-4 text-lg font-semibold">{trend.label}</h3>
              <p className="mt-2 text-sm text-foam/70">{trend.value}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}