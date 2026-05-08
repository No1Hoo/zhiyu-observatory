import Link from "next/link";

const adminNav = [
  { label: "Dashboard", href: "/admin" },
  { label: "Sources", href: "/admin/sources" },
  { label: "Ingestion", href: "/admin/ingestion" },
  { label: "Review Queue", href: "/admin/review" },
  { label: "Content", href: "/admin/content" },
  { label: "Topics/Ads", href: "/admin/topics-ads" }
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white p-5 md:block">
        <h1 className="text-xl font-bold text-ink">智渔观察后台</h1>
        <nav className="mt-8 space-y-2">
          {adminNav.map((item) => (
            <Link key={item.href} href={item.href} className="block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-cyan-50">
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="border-b border-slate-200 bg-white p-4 md:hidden">
        <h1 className="text-lg font-bold text-ink">智渔观察后台</h1>
        <nav className="mt-3 flex gap-3 overflow-x-auto text-sm">
          {adminNav.map((item) => (
            <Link key={item.href} href={item.href} className="shrink-0 rounded-md bg-slate-100 px-3 py-2 text-slate-700">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <main className="md:pl-64">
        <div className="mx-auto max-w-6xl px-5 py-8">{children}</div>
      </main>
    </div>
  );
}
