// app/support/page.tsx
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { getOpportunities, getOpportunityById } from "@/lib/actions/opportunities"
import { SupportPageClientWrapper } from "./support-page-client-wrapper"

// NOTE: no "use client" here.
// This is now a Server Component. Server Components in /app can be async.
export default async function SupportPage({
  searchParams,
}: {
  searchParams: { id?: string }
}) {
  console.log("[v0] SupportPage: Loading opportunity data")

  const id = searchParams?.id

  let opportunity
  if (id) {
    console.log("[v0] SupportPage: Fetching opportunity by ID:", id)
    opportunity = await getOpportunityById(id)
  } else {
    console.log("[v0] SupportPage: Fetching opportunities for support stage")
    const opportunities = await getOpportunities({ stage: "support" })
    opportunity = opportunities[0] || null
  }

  console.log("[v0] SupportPage: Loaded opportunity:", opportunity?.id || "none")

  if (!opportunity) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">No opportunity found</p>
      </div>
    )
  }

  // We pass plain data to a client component for rendering/layout
  return (
    <Suspense fallback={<SupportPageSkeleton />}>
      <SupportPageClientWrapper opportunity={opportunity} />
    </Suspense>
  )
}

function SupportPageSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  )
}
