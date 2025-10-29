export default function Loading() {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="mt-2 h-4 w-64 animate-pulse rounded bg-muted" />
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* KPI Cards Skeleton */}
          <div className="grid gap-4 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-lg border border-border bg-card p-6">
                <div className="h-4 w-24 animate-pulse rounded bg-muted mb-4" />
                <div className="h-8 w-16 animate-pulse rounded bg-muted mb-2" />
                <div className="h-3 w-32 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>

          {/* Charts Skeleton */}
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg border border-border bg-card p-6">
                <div className="h-4 w-32 animate-pulse rounded bg-muted mb-4" />
                <div className="h-[250px] animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>

          {/* Discoverability Bar Skeleton */}
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="h-10 w-full animate-pulse rounded bg-muted" />
          </div>

          {/* Table Skeleton */}
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="h-6 w-32 animate-pulse rounded bg-muted mb-4" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 w-full animate-pulse rounded bg-muted" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
