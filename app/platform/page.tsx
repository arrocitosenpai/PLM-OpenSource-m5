// app/platform/page.tsx
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { getOpportunities, getOpportunityById } from "@/lib/actions/opportunities"
import { PlatformPageClientWrapper } from "./platform-page-client-wrapper"

// NOTE: no "use client" here. This file is a Server Component now.
// Server Components in the /app router can be async.
export default async function PlatformPage({
  searchParams,
}: {
  searchParams: { id?: string }
}) {
  console.log("[v0] PlatformPage: Loading opportunity data")

  const id = searchParams?.id

  let opportunity
  if (id) {
    console.log("[v0] PlatformPage: Fetching opportunity by ID:", id)
    opportunity = await getOpportunityById(id)
  } else {
    console.log("[v0] PlatformPage: Fetching opportunities for platform stage")
    const opportunities = await getOpportunities({ stage: "platform" })
    opportunity = opportunities[0] || null
  }

  console.log("[v0] PlatformPage: Loaded opportunity:", opportunity?.id || "none")

  if (!opportunity) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">No opportunity found</p>
      </div>
    )
  }

  return (
    <Suspense fallback={<PlatformPageSkeleton />}>
      <PlatformPageClientWrapper opportunity={opportunity} />
    </Suspense>
  )
}

function PlatformPageSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  )
}
