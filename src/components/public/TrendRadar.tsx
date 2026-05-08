import { Cpu, Droplets, Fish, RadioTower } from "lucide-react";

const trends = [
  { label: "AI 识别", value: "热度上升", icon: Cpu },
  { label: "智能投喂", value: "设备关注", icon: RadioTower },
  { label: "水质监测", value: "应用扩散", icon: Droplets },
  { label: "价格观察", value: "样本追踪", icon: Fish }
];

export function TrendRadar() {
  return (
    <section id="radar" className="bg-obsidian px-5 pb-12 text-foam">
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">
        {trends.map((trend) => {
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
