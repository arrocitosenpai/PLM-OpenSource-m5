"use client"

import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { getOpportunityById } from "@/lib/mock-data"
import { EngineeringPageClient } from "@/components/engineering-page-client"
import { getOpportunities } from "@/lib/actions/opportunities"

async function EngineeringPageContent({ searchParams }: { searchParams: { id?: string } }) {
  const id = searchParams.id

  let opportunity
  if (id) {
    opportunity = await getOpportunityById(id)
  } else {
    const opportunities = await getOpportunities({ stage: "engineering" })
    opportunity = opportunities[0] || null
  }

  if (!opportunity) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">No opportunity found</p>
      </div>
    )
  }

  return <EngineeringPageClient opportunity={opportunity} />
}

export default function EngineeringPage({ searchParams }: { searchParams: { id?: string } }) {
  return (
    <Suspense fallback={<EngineeringPageSkeleton />}>
      <EngineeringPageContent searchParams={searchParams} />
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
