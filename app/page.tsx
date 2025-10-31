import { getOpportunities } from "@/lib/actions/opportunities"
import { DashboardPageClient } from "@/components/dashboard-page-client"

export default async function Home() {
  console.log("[v0] Dashboard: Fetching opportunities from database")
  const opportunities = await getOpportunities()
  console.log("[v0] Dashboard: Loaded opportunities:", opportunities?.length || 0)

  return <DashboardPageClient initialOpportunities={opportunities || []} />
}
