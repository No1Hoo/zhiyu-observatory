export function MetricCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-gradient-to-br from-white/[0.09] to-white/[0.035] p-5 shadow-[0_24px_80px_rgba(0,0,0,.22)] backdrop-blur-xl">
      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-aqua/10 blur-2xl" />
      <p className="relative text-xs font-bold uppercase tracking-[0.18em] text-foam/45">{label}</p>
      <p className="relative mt-4 text-4xl font-black tracking-[-0.06em] text-foam">{value}</p>
      <div className="relative mt-5 h-1 overflow-hidden rounded-full bg-white/10">
        <div className="h-full w-2/3 rounded-full bg-aqua/80" />
      </div>
    </div>
  );
}
