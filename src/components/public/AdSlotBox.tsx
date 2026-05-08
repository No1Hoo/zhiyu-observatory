import type { AdSlot } from "@prisma/client";

export function AdSlotBox({ slot }: { slot?: AdSlot }) {
  return (
    <aside className="rounded-lg border border-dashed border-cyan-300 bg-cyan-50/70 p-5">
      <p className="text-xs font-semibold text-lagoon">{slot?.label || "广告合作"}</p>
      <h3 className="mt-2 text-lg font-semibold text-ink">{slot?.name || "合作位预留"}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        {slot?.content || "设备、饲料、苗种、动保企业可联系合作。"}
      </p>
    </aside>
  );
}
