import type { AdSlot } from "@prisma/client";
import { Handshake } from "lucide-react";

export function AdSlotBox({ slot }: { slot?: AdSlot }) {
  return (
    <aside className="relative overflow-hidden rounded-[1.7rem] border border-dashed border-aqua/30 bg-aqua/10 p-5 backdrop-blur-xl">
      <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-aqua/20 blur-3xl" />
      <div className="relative flex items-start gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-aqua/25 bg-aqua/10">
          <Handshake className="h-5 w-5 text-aqua" />
        </div>
        <div>
          <p className="signal-label">{slot?.label || "广告合作"}</p>
          <h3 className="mt-2 text-2xl font-black tracking-[-0.04em] text-foam">{slot?.name || "合作位预留"}</h3>
          <p className="mt-3 text-sm leading-7 text-foam/58">
            {slot?.content || "设备、饲料、苗种、动保企业可联系合作。"}
          </p>
        </div>
      </div>
    </aside>
  );
}
