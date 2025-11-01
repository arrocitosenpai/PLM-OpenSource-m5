// app/platform/platform-page-client-wrapper.tsx
"use client"

import { PlatformPageClient } from "@/components/platform-page-client"

export function PlatformPageClientWrapper({
  opportunity,
}: {
  opportunity: any // change 'any' to your real type if you have one
}) {
  return <PlatformPageClient opportunity={opportunity} />
}
