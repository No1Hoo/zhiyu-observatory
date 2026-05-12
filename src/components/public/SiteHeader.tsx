import Link from "next/link";
import { Activity, ShieldCheck } from "lucide-react";
import { NAV_ITEMS, SITE_NAME } from "@/lib/constants";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#020711]/75 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link href="/" className="group flex items-center gap-3 text-foam">
          <span className="grid h-10 w-10 place-items-center rounded-2xl border border-aqua/30 bg-aqua/10 shadow-[0_0_40px_rgba(77,218,197,.18)]">
            <Activity className="h-5 w-5 text-aqua transition group-hover:scale-110" />
          </span>
          <span>
            <span className="block text-base font-black tracking-tight">{SITE_NAME}</span>
            <span className="block text-[10px] uppercase tracking-[0.24em] text-foam/45">Aquaculture Intelligence</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1 text-sm text-foam/72 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-aqua">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-xs font-semibold text-emerald-100 md:flex">
          <ShieldCheck className="h-4 w-4 text-aqua" />
          Source Tracked
        </div>
      </div>
      <nav className="flex gap-3 overflow-x-auto px-5 pb-3 text-sm text-foam/72 md:hidden">
        {NAV_ITEMS.map((item) => (
          <Link key={item.href} href={item.href} className="shrink-0 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 hover:text-aqua">
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
