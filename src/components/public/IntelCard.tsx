import Link from "next/link";
import type { IntelItem, Source } from "@prisma/client";
import { formatRelativeDate, splitTags } from "@/lib/format";

type Props = {
  item: IntelItem & { source: Source };
};

export function IntelCard({ item }: Props) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-3 flex flex-wrap gap-2 text-xs">
        {splitTags(item.tags)
          .slice(0, 3)
          .map((tag) => (
            <span key={tag} className="rounded-full bg-cyan-50 px-2 py-1 text-lagoon">
              {tag}
            </span>
          ))}
      </div>
      <h3 className="text-lg font-semibold leading-7 text-ink">
        <Link href={`/intel/${item.slug}`} className="hover:text-lagoon">{item.title}</Link>
      </h3>
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{item.aiSummary}</p>
      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
        <span>{item.source.name}</span>
        <span>{formatRelativeDate(item.publishedAt || item.createdAt)}</span>
        <span>可信等级 {item.source.trustLevel}/5</span>
      </div>
    </article>
  );
}
