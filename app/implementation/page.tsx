"use client"

import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { ImplementationPageClient } from "@/components/implementation-page-client"
import { getOpportunities, getOpportunityById } from "@/lib/actions/opportunities"

async function ImplementationPageContent({ searchParams }: { searchParams: { id?: string } }) {
  console.log("[v0] ImplementationPage: Loading opportunity data")
  const id = searchParams.id

  let opportunity
  if (id) {
    console.log("[v0] ImplementationPage: Fetching opportunity by ID:", id)
    opportunity = await getOpportunityById(id)
  } else {
    console.log("[v0] ImplementationPage: Fetching opportunities for implementation stage")
    const opportunities = await getOpportunities({ stage: "implementation" })
    opportunity = opportunities[0] || null
  }

  console.log("[v0] ImplementationPage: Loaded opportunity:", opportunity?.id || "none")

  if (!opportunity) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">No opportunity found</p>
      </div>
    )
  }

  return <ImplementationPageClient opportunity={opportunity} />
}

export default function ImplementationPage({ searchParams }: { searchParams: { id?: string } }) {
  return (
    <Suspense fallback={<ImplementationPageSkeleton />}>
      <ImplementationPageContent searchParams={searchParams} />
    </Suspense>
  )
}

function ImplementationPageSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  )
}
