import Link from "next/link";
import type { IntelItem, Source } from "@prisma/client";
import { ArrowUpRight } from "lucide-react";
import { formatRelativeDate, splitTags } from "@/lib/format";

type Props = {
  item: IntelItem & { source: Source };
};

export function IntelCard({ item }: Props) {
  return (
    <article className="group premium-card relative overflow-hidden rounded-[1.7rem] p-5 transition duration-300 hover:-translate-y-1 hover:border-aqua/35">
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-aqua/10 blur-3xl transition group-hover:bg-aqua/20" />
      <div className="relative mb-5 flex flex-wrap gap-2 text-xs">
        {splitTags(item.tags)
          .slice(0, 3)
          .map((tag) => (
            <span key={tag} className="rounded-full border border-aqua/20 bg-aqua/10 px-3 py-1 text-aqua">
              {tag}
            </span>
          ))}
      </div>
      <h3 className="relative text-xl font-black leading-7 tracking-[-0.035em] text-foam">
        <Link href={`/intel/${item.slug}`} className="transition hover:text-aqua">
          {item.title}
        </Link>
      </h3>
      <p className="relative mt-4 line-clamp-3 text-sm leading-7 text-foam/58">{item.aiSummary}</p>
      <div className="relative mt-6 flex items-end justify-between gap-4 border-t border-white/10 pt-4 text-xs text-foam/42">
        <div className="space-y-1">
          <p>{item.source.name}</p>
          <p>{formatRelativeDate(item.publishedAt || item.createdAt)}</p>
        </div>
        <Link href={`/intel/${item.slug}`} className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-aqua transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:border-aqua/35">
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
