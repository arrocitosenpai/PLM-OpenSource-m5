// app/product/product-page-client-wrapper.tsx
"use client"

import { ProductPageClient } from "@/components/product-page-client"

export function ProductPageClientWrapper({
  opportunity,
}: {
  opportunity: any // You can replace 'any' with the real type if you have one
}) {
  return <ProductPageClient opportunity={opportunity} />
}
