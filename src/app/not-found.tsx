import Link from "next/link";
import { SiteHeader } from "@/components/public/SiteHeader";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[--page-bg]">
      <SiteHeader />
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-6 text-8xl font-bold text-lagoon opacity-30">404</div>
        <h1 className="mb-4 text-2xl font-bold text-ink">页面未找到</h1>
        <p className="mb-8 text-slate-500">
          您访问的页面不存在或已被移除
        </p>
        <Link
          href="/"
          className="rounded-lg bg-lagoon px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-opacity-90"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
}