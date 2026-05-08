import Link from "next/link";

const adminNav = [
  { label: "Dashboard", href: "/admin" },
  { label: "Sources", href: "/admin/sources" },
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
      <main className="md:pl-64">
        <div className="mx-auto max-w-6xl px-5 py-8">{children}</div>
      </main>
    </div>
  );
}
