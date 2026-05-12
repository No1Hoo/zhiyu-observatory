import Link from "next/link";
import { Activity, ArrowUpRight, Database, FileCheck2, Inbox, Layers3, RadioTower, Settings2, Sparkles } from "lucide-react";

const adminNav = [
  { label: "Dashboard", href: "/admin", icon: Activity },
  { label: "Sources", href: "/admin/sources", icon: Database },
  { label: "Ingestion", href: "/admin/ingestion", icon: RadioTower },
  { label: "Review Queue", href: "/admin/review", icon: FileCheck2 },
  { label: "Content", href: "/admin/content", icon: Layers3 },
  { label: "Topics/Ads", href: "/admin/topics-ads", icon: Settings2 },
  { label: "Inquiries", href: "/admin/inquiries", icon: Inbox },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#020711] text-foam">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-white/10 bg-[#020711]/85 p-5 backdrop-blur-2xl md:block">
        <Link href="/" className="group flex items-center gap-3 rounded-3xl border border-aqua/20 bg-aqua/10 p-4">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-aqua/15">
            <Sparkles className="h-5 w-5 text-aqua" />
          </span>
          <span>
            <span className="block text-lg font-black tracking-tight">智渔观察</span>
            <span className="block text-[10px] uppercase tracking-[0.24em] text-foam/45">Admin Console</span>
          </span>
        </Link>
        <nav className="mt-8 space-y-2">
          {adminNav.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-foam/62 transition hover:bg-white/[0.07] hover:text-aqua">
                <Icon className="h-4 w-4 text-foam/35 transition group-hover:text-aqua" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-5 left-5 right-5 rounded-3xl border border-white/10 bg-white/[0.045] p-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-aqua">System Status</p>
          <p className="mt-2 text-sm leading-6 text-foam/55">Source tracking, review queue and content operations are centralized here.</p>
          <Link href="/" className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-aqua">
            Public site <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </aside>
      <div className="border-b border-white/10 bg-[#020711]/85 p-4 backdrop-blur-2xl md:hidden">
        <h1 className="text-lg font-black text-foam">智渔观察后台</h1>
        <nav className="mt-3 flex gap-3 overflow-x-auto text-sm">
          {adminNav.map((item) => (
            <Link key={item.href} href={item.href} className="shrink-0 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-foam/70">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <main className="md:pl-72">
        <div className="border-b border-white/10 bg-white/[0.025] px-5 py-5 backdrop-blur-xl md:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-aqua">Control Room</p>
              <h2 className="mt-1 text-2xl font-black tracking-[-0.04em] text-foam">产业情报后台中枢</h2>
            </div>
            <div className="hidden rounded-full border border-aqua/20 bg-aqua/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-aqua md:block">
              Live Operations
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-5 py-8 md:px-8">{children}</div>
      </main>
    </div>
  );
}
