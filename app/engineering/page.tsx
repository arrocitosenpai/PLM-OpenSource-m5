// app/engineering/page.tsx
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { getOpportunities, getOpportunityById } from "@/lib/actions/opportunities"
import { EngineeringPageClientWrapper } from "./engineering-page-client-wrapper"

// NOTE: no "use client" here. This is a Server Component now.
// Server Components in the /app router can be async, so we do work here.
export default async function EngineeringPage({
  searchParams,
}: {
  searchParams: { id?: string }
}) {
  console.log("[v0] EngineeringPage: Loading opportunity data")

  const id = searchParams?.id

  let opportunity
  if (id) {
    console.log("[v0] EngineeringPage: Fetching opportunity by ID:", id)
    opportunity = await getOpportunityById(id)
  } else {
    console.log("[v0] EngineeringPage: Fetching opportunities for engineering stage")
    const opportunities = await getOpportunities({ stage: "engineering" })
    opportunity = opportunities[0] || null
  }

  console.log("[v0] EngineeringPage: Loaded opportunity:", opportunity?.id || "none")

  if (!opportunity) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">No opportunity found</p>
      </div>
    )
  }

  return (
    <Suspense fallback={<EngineeringPageSkeleton />}>
      <EngineeringPageClientWrapper opportunity={opportunity} />
    </Suspense>
  )
}

function EngineeringPageSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  )
}
