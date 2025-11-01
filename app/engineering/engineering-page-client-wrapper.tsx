// app/engineering/engineering-page-client-wrapper.tsx
"use client"

import { EngineeringPageClient } from "@/components/engineering-page-client"

export function EngineeringPageClientWrapper({
  opportunity,
}: {
  opportunity: any // you can replace 'any' with your actual type later
}) {
  return <EngineeringPageClient opportunity={opportunity} />
}
