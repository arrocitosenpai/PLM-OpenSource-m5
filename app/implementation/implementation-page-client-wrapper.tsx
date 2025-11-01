// app/implementation/implementation-page-client-wrapper.tsx
"use client"

import { ImplementationPageClient } from "@/components/implementation-page-client"

export function ImplementationPageClientWrapper({
  opportunity,
}: {
  opportunity: any // replace 'any' with your real type if you have one
}) {
  return <ImplementationPageClient opportunity={opportunity} />
}
