"use client"

import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { EngineeringPageClient } from "@/components/engineering-page-client"
import { getOpportunities, getOpportunityById } from "@/lib/actions/opportunities"

async function EngineeringPageContent({ searchParams }: { searchParams: { id?: string } }) {
  console.log("[v0] EngineeringPage: Loading opportunity data")
  const id = searchParams.id

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
