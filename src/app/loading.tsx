export default function LoadingPage() {
  return (
    <div className="min-h-screen bg-[--page-bg]">
      {/* Header skeleton */}
      <div className="h-14 border-b border-slate-200 bg-white" />

      {/* Hero skeleton */}
      <div className="mx-auto max-w-7xl px-5 py-10">
        <div className="mb-8 h-64 rounded-2xl bg-slate-200 animate-pulse" />
      </div>

      {/* Content skeleton */}
      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          <div className="h-8 w-48 rounded bg-slate-200 animate-pulse" />
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-xl border border-slate-100 bg-white p-4">
                <div className="mb-3 h-4 w-20 rounded bg-slate-200 animate-pulse" />
                <div className="mb-2 h-5 w-3/4 rounded bg-slate-200 animate-pulse" />
                <div className="mb-3 h-4 w-full rounded bg-slate-100 animate-pulse" />
                <div className="flex gap-2">
                  <div className="h-5 w-16 rounded-full bg-slate-100 animate-pulse" />
                  <div className="h-5 w-16 rounded-full bg-slate-100 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-100 bg-white p-4">
            <div className="mb-3 h-6 w-24 rounded bg-slate-200 animate-pulse" />
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 w-20 rounded bg-slate-100 animate-pulse" />
                  <div className="h-4 w-16 rounded bg-slate-100 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}