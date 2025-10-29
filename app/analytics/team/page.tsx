"use client"

import { useState, useMemo } from "react"
import { KpiTile } from "@/components/analytics/kpi-tile"
import { Clock, TrendingUp, AlertCircle, RefreshCw } from "lucide-react"
import {
  generateWorkItems,
  generateThroughputData,
  generateCommitmentReliabilityData,
  generateReopenTrendData,
  generateInactiveItemsData,
  calculateCycleTime,
  calculateWIP,
  calculateReopenRate,
  calculateKPIWithDelta,
  type WorkItem,
} from "@/lib/analytics-dummy-data"
import { RightDrawer } from "@/components/analytics/right-drawer"
import { TimeSeriesChart } from "@/components/analytics/time-series-chart"
import { StackedBarChart } from "@/components/analytics/stacked-bar-chart"
import { DataTable } from "@/components/analytics/data-table"

export default function TeamViewPage() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerTitle, setDrawerTitle] = useState("")
  const [drawerItems, setDrawerItems] = useState<WorkItem[]>([])

  const workItems = useMemo(() => generateWorkItems(26), [])

  const throughputKPI = useMemo(
    () =>
      calculateKPIWithDelta(workItems, (items) => {
        const completed = items.filter((item) => item.completedAt)
        return completed.length
      }),
    [workItems],
  )

  const cycleTimeKPI = useMemo(() => calculateKPIWithDelta(workItems, calculateCycleTime, true), [workItems])
  const wipKPI = useMemo(() => calculateKPIWithDelta(workItems, calculateWIP), [workItems])
  const reopenRateKPI = useMemo(() => calculateKPIWithDelta(workItems, calculateReopenRate, true), [workItems])

  const throughputData = useMemo(() => generateThroughputData(workItems), [workItems])
  const commitmentData = useMemo(() => generateCommitmentReliabilityData(workItems), [workItems])
  const reopenTrendData = useMemo(() => generateReopenTrendData(workItems), [workItems])
  const inactiveItems = useMemo(() => generateInactiveItemsData(workItems), [workItems])

  const workloadData = useMemo(() => {
    const assigneeMap = new Map<string, { assignee: string; storyPoints: number; count: number }>()

    workItems
      .filter((item) => item.startedAt && !item.completedAt)
      .forEach((item) => {
        if (!assigneeMap.has(item.assignee)) {
          assigneeMap.set(item.assignee, { assignee: item.assignee, storyPoints: 0, count: 0 })
        }
        const data = assigneeMap.get(item.assignee)!
        data.storyPoints += item.storyPoints
        data.count++
      })

    return Array.from(assigneeMap.values()).sort((a, b) => b.storyPoints - a.storyPoints)
  }, [workItems])

  const handleChartClick = (title: string, items: WorkItem[]) => {
    setDrawerTitle(title)
    setDrawerItems(items)
    setDrawerOpen(true)
  }

  return (
    <div className="p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Hero KPI Tiles */}
        <div className="grid grid-cols-4 gap-4">
          <KpiTile
            title="Throughput"
            value={throughputKPI.value}
            delta={throughputKPI.delta}
            trend={throughputKPI.trend}
            caption="Higher is better"
            icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          />
          <KpiTile
            title="Avg Cycle Time"
            value={`${cycleTimeKPI.value}d`}
            delta={cycleTimeKPI.delta}
            trend={cycleTimeKPI.trend === "up" ? "down" : cycleTimeKPI.trend === "down" ? "up" : "neutral"}
            caption="Lower is better"
            icon={<Clock className="h-4 w-4 text-muted-foreground" />}
          />
          <KpiTile
            title="WIP"
            value={wipKPI.value}
            delta={wipKPI.delta}
            trend={wipKPI.trend}
            caption="At/Under limit is better"
            icon={<RefreshCw className="h-4 w-4 text-muted-foreground" />}
          />
          <KpiTile
            title="Reopen Rate"
            value={`${reopenRateKPI.value}%`}
            delta={reopenRateKPI.delta}
            trend={reopenRateKPI.trend === "up" ? "down" : reopenRateKPI.trend === "down" ? "up" : "neutral"}
            caption="Lower is better"
            icon={<AlertCircle className="h-4 w-4 text-muted-foreground" />}
          />
        </div>

        {/* Section A - Productivity */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">Productivity</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <TimeSeriesChart
              title="Throughput Trend"
              description="Items completed per week by type"
              data={throughputData}
              lines={[
                { dataKey: "value", name: "Total", color: "hsl(var(--chart-1))" },
                { dataKey: "Story", name: "Story", color: "hsl(var(--chart-2))" },
                { dataKey: "Bug", name: "Bug", color: "hsl(var(--chart-3))" },
                { dataKey: "Task", name: "Task", color: "hsl(var(--chart-4))" },
              ]}
              yAxisLabel="Items Completed"
            />

            <StackedBarChart
              title="Commitment Reliability"
              description="Planned vs completed items per sprint"
              data={commitmentData}
              bars={[
                { dataKey: "completed", name: "Completed", color: "hsl(var(--chart-2))" },
                { dataKey: "planned", name: "Planned", color: "hsl(var(--chart-1))" },
              ]}
              stacked={false}
              xAxisKey="name"
              yAxisLabel="Items"
            />
          </div>
        </div>

        {/* Section B - Workload */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">Workload</h2>
          <StackedBarChart
            title="Workload Distribution"
            description="Current work in progress by assignee"
            data={workloadData}
            bars={[{ dataKey: "storyPoints", name: "Story Points", color: "hsl(var(--chart-1))" }]}
            stacked={false}
            xAxisKey="assignee"
            yAxisLabel="Story Points"
          />
        </div>

        {/* Section C - Health */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">Health</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <TimeSeriesChart
              title="Reopen & Defect Trend"
              description="Reopen rate and defect count over time"
              data={reopenTrendData}
              lines={[
                { dataKey: "reopenRate", name: "Reopen Rate (%)", color: "hsl(var(--chart-3))" },
                { dataKey: "defects", name: "Defects", color: "hsl(var(--chart-1))" },
              ]}
              yAxisLabel="Rate / Count"
            />

            <DataTable
              title="Inactive Items"
              description="Items not updated in over 7 days"
              data={inactiveItems}
              columns={[
                { key: "id", label: "ID", sortable: true },
                { key: "assignee", label: "Assignee", sortable: true },
                { key: "daysSinceUpdate", label: "Days Inactive", sortable: true },
                { key: "status", label: "Status" },
              ]}
              onRowClick={(row) => handleChartClick("Inactive Item Details", [workItems.find((i) => i.id === row.id)!])}
            />
          </div>
        </div>
      </div>

      <RightDrawer open={drawerOpen} onOpenChange={setDrawerOpen} title={drawerTitle} items={drawerItems} />
    </div>
  )
}
