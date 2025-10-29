"use client"

import type React from "react"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePathname, useRouter } from "next/navigation"
import { GlobalFilters } from "@/components/analytics/global-filters"
import type { DateRange } from "react-day-picker"
import { subWeeks } from "date-fns"

const teams = ["Platform", "Frontend", "Backend"]
const projects = ["Project Alpha", "Project Beta", "Project Gamma", "Project Delta"]

export default function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subWeeks(new Date(), 12),
    to: new Date(),
  })
  const [selectedTeams, setSelectedTeams] = useState<string[]>([])
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])

  const handleReset = () => {
    setDateRange({ from: subWeeks(new Date(), 12), to: new Date() })
    setSelectedTeams([])
    setSelectedProjects([])
  }

  const currentTab = pathname.split("/").pop() || "project"

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border bg-card px-6 py-4">
        <h1 className="mb-4 font-sans text-2xl font-semibold text-card-foreground">Analytics Dashboard</h1>
        <Tabs value={currentTab} onValueChange={(value) => router.push(`/analytics/${value}`)}>
          <TabsList>
            <TabsTrigger value="project">Project View</TabsTrigger>
            <TabsTrigger value="org">Org View</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <GlobalFilters
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        teams={teams}
        selectedTeams={selectedTeams}
        onTeamsChange={setSelectedTeams}
        projects={projects}
        selectedProjects={selectedProjects}
        onProjectsChange={setSelectedProjects}
        onReset={handleReset}
      />

      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  )
}
