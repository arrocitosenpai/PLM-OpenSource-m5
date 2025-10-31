"use client"

import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { ProductPageClient } from "@/components/product-page-client"
import { getOpportunities, getOpportunityById } from "@/lib/actions/opportunities"

async function ProductPageContent({ searchParams }: { searchParams: { id?: string } }) {
  const id = searchParams.id

  let opportunity
  if (id) {
    opportunity = await getOpportunityById(id)
  } else {
    const opportunities = await getOpportunities({ stage: "product" })
    opportunity = opportunities[0] || null
  }

  if (!opportunity) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">No opportunity found</p>
      </div>
    )
  }

  return <ProductPageClient opportunity={opportunity} />
}

export default function ProductPage({ searchParams }: { searchParams: { id?: string } }) {
  return (
    <Suspense fallback={<ProductPageSkeleton />}>
      <ProductPageContent searchParams={searchParams} />
    </Suspense>
  )
}

function ProductPageSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  )
}
