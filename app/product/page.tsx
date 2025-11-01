// app/product/page.tsx
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { getOpportunities, getOpportunityById } from "@/lib/actions/opportunities"
import { ProductPageClientWrapper } from "./product-page-client-wrapper"

// NOTE: no "use client" here. This is now a Server Component.
// Server Components in the /app router CAN be async.
export default async function ProductPage({
  searchParams,
}: {
  searchParams: { id?: string }
}) {
  // Read the id from the query string (e.g. /product?id=123)
  const id = searchParams?.id

  // Fetch data on the server (safe for Supabase / DB)
  let opportunity
  if (id) {
    opportunity = await getOpportunityById(id)
  } else {
    const opportunities = await getOpportunities({ stage: "product" })
    opportunity = opportunities[0] || null
  }

  // No data found case
  if (!opportunity) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">No opportunity found</p>
      </div>
    )
  }

  // Pass the resolved data down into a client component to render UI
  return (
    <Suspense fallback={<ProductPageSkeleton />}>
      <ProductPageClientWrapper opportunity={opportunity} />
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
