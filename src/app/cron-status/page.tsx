import Link from "next/link";
import { Activity, Clock3, Database, RadioTower, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/public/SiteHeader";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const CRON_PATH = "/api/cron/ingest";
const STATUS_PATH = "/api/cron/status";
const CRON_SCHEDULE = "15 22 * * *";

function formatDate(value?: Date | null) {
  if (!value) return "暂无记录";
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(value);
}

export default async function CronStatusPage() {
  const [latestRun, sourceCount, publishedCount] = await Promise.all([
    prisma.ingestionRun.findFirst({
      orderBy: { startedAt: "desc" },
      select: {
        trigger: true,
        status: true,
        itemsSeen: true,
        itemsCreated: true,
        duplicates: true,
        riskCount: true,
        errorMessage: true,
        startedAt: true,
        finishedAt: true
      }
    }),
    prisma.source.count(),
    prisma.intelItem.count({ where: { status: "PUBLISHED" } })
  ]);

  const statusLabel = latestRun?.status ?? "waiting";

  return (
    <main className="min-h-screen text-foam">
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-5 py-14">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.09] to-white/[0.035] p-7 shadow-[0_30px_110px_rgba(0,0,0,.28)] backdrop-blur-2xl md:p-10">
          <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full bg-aqua/10 blur-3xl" />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="signal-label">Automation Control</p>
              <h1 className="mt-4 text-4xl font-black tracking-[-0.06em] text-foam md:text-6xl">每日抓取状态</h1>
              <p className="mt-4 max-w-3xl text-base leading-8 text-foam/58">
                这里是智渔观察的定时采集监控页。Vercel Cron 会每天自动调用采集接口，抓取公开来源并进入后台审核流程。
              </p>
            </div>
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-aqua/25 bg-aqua/10 px-4 py-2 text-sm font-bold text-aqua">
              <ShieldCheck className="h-4 w-4" /> Cron Enabled
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl">
            <Clock3 className="h-5 w-5 text-aqua" />
            <p className="mt-4 text-sm text-foam/45">每日时间</p>
            <p className="mt-1 text-2xl font-black text-foam">06:15</p>
            <p className="mt-2 text-xs text-foam/38">北京时间，UTC 22:15</p>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl">
            <RadioTower className="h-5 w-5 text-aqua" />
            <p className="mt-4 text-sm text-foam/45">Cron 表达式</p>
            <p className="mt-1 font-mono text-lg font-black text-foam">{CRON_SCHEDULE}</p>
            <p className="mt-2 text-xs text-foam/38">Vercel Cron</p>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl">
            <Database className="h-5 w-5 text-aqua" />
            <p className="mt-4 text-sm text-foam/45">数据来源</p>
            <p className="mt-1 text-2xl font-black text-foam">{sourceCount}</p>
            <p className="mt-2 text-xs text-foam/38">当前数据库统计</p>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl">
            <Activity className="h-5 w-5 text-aqua" />
            <p className="mt-4 text-sm text-foam/45">已发布情报</p>
            <p className="mt-1 text-2xl font-black text-foam">{publishedCount}</p>
            <p className="mt-2 text-xs text-foam/38">Published Intel</p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
          <section className="rounded-[1.7rem] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl">
            <p className="signal-label">Latest Run</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.05em] text-foam">最近一次采集</h2>
            <div className="mt-6 grid gap-3 text-sm text-foam/62">
              <div className="flex justify-between border-b border-white/10 pb-3"><span>状态</span><span className="font-bold text-aqua">{statusLabel}</span></div>
              <div className="flex justify-between border-b border-white/10 pb-3"><span>触发方式</span><span>{latestRun?.trigger ?? "暂无"}</span></div>
              <div className="flex justify-between border-b border-white/10 pb-3"><span>开始时间</span><span>{formatDate(latestRun?.startedAt)}</span></div>
              <div className="flex justify-between border-b border-white/10 pb-3"><span>完成时间</span><span>{formatDate(latestRun?.finishedAt)}</span></div>
              <div className="flex justify-between border-b border-white/10 pb-3"><span>发现条目</span><span>{latestRun?.itemsSeen ?? 0}</span></div>
              <div className="flex justify-between border-b border-white/10 pb-3"><span>新增条目</span><span>{latestRun?.itemsCreated ?? 0}</span></div>
              <div className="flex justify-between border-b border-white/10 pb-3"><span>重复条目</span><span>{latestRun?.duplicates ?? 0}</span></div>
              <div className="flex justify-between"><span>风险提示</span><span>{latestRun?.riskCount ?? 0}</span></div>
            </div>
            {latestRun?.errorMessage ? (
              <p className="mt-5 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm leading-7 text-red-100/80">{latestRun.errorMessage}</p>
            ) : null}
          </section>

          <section className="rounded-[1.7rem] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl">
            <p className="signal-label">Endpoints</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.05em] text-foam">接口说明</h2>
            <div className="mt-6 space-y-4 text-sm leading-7 text-foam/58">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="font-mono text-aqua">{STATUS_PATH}</p>
                <p className="mt-2">状态接口，可直接打开，返回 JSON。</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="font-mono text-aqua">{CRON_PATH}</p>
                <p className="mt-2">采集接口，由 Vercel Cron 每天自动调用，不建议当普通网页打开。</p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/" className="rounded-full border border-aqua/25 bg-aqua/10 px-4 py-2 text-sm font-bold text-aqua transition hover:bg-aqua/20">返回首页</Link>
              <Link href="/api/cron/status" className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-bold text-foam/70 transition hover:bg-white/[0.1]">查看 JSON</Link>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
