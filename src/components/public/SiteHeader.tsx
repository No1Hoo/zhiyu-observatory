import Link from "next/link";
import { Activity } from "lucide-react";
import { NAV_ITEMS, SITE_NAME } from "@/lib/constants";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-obsidian/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-2 text-foam">
          <Activity className="h-6 w-6 text-aqua" />
          <span className="text-lg font-semibold">{SITE_NAME}</span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-foam/80 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-aqua">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <nav className="flex gap-4 overflow-x-auto px-5 pb-3 text-sm text-foam/80 md:hidden">
        {NAV_ITEMS.map((item) => (
          <Link key={item.href} href={item.href} className="shrink-0 hover:text-aqua">
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
