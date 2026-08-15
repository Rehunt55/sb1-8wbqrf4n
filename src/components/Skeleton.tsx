export function MarketCardSkeleton() {
  return (
    <div className="glass flex animate-pulse items-center justify-between rounded-2xl p-3.5">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-slate-700/50" />
        <div className="space-y-1.5">
          <div className="h-3 w-20 rounded bg-slate-700/50" />
          <div className="h-2.5 w-14 rounded bg-slate-700/40" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="h-8 w-16 rounded bg-slate-700/40" />
        <div className="space-y-1.5 text-right">
          <div className="h-3 w-16 rounded bg-slate-700/50" />
          <div className="h-2.5 w-10 rounded bg-slate-700/40" />
        </div>
      </div>
    </div>
  );
}

export function SectionSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-2.5">
      <div className="h-4 w-28 animate-pulse rounded bg-slate-700/50 px-1" />
      {Array.from({ length: count }).map((_, i) => (
        <MarketCardSkeleton key={i} />
      ))}
    </div>
  );
}
