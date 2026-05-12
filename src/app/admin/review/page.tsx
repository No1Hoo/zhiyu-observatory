import { ReviewQueue } from "@/components/admin/ReviewQueue";
import { getReviewQueue } from "@/lib/queries/admin";

export const dynamic = "force-dynamic";

export default async function AdminReviewPage() {
  const items = await getReviewQueue();
  return (
    <div>
      <div className="mb-7 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-aqua">Review Queue</p>
          <h1 className="mt-2 text-4xl font-black tracking-[-0.055em] text-foam md:text-6xl">审核队列</h1>
        </div>
        <p className="max-w-md text-sm leading-6 text-foam/45 md:text-right">审核价格、病害、技术建议、首页推荐和高风险内容，决定是否进入公共情报流。</p>
      </div>
      <ReviewQueue items={items} />
    </div>
  );
}
