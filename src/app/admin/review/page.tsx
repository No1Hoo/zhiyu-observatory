import { ReviewQueue } from "@/components/admin/ReviewQueue";
import { getReviewQueue } from "@/lib/queries/admin";

export default async function AdminReviewPage() {
  const items = await getReviewQueue();
  return (
    <div>
      <h1 className="text-3xl font-bold text-ink">Review Queue</h1>
      <p className="mt-2 text-slate-600">审核价格、病害、技术建议、首页推荐和高风险内容。</p>
      <div className="mt-6">
        <ReviewQueue items={items} />
      </div>
    </div>
  );
}
