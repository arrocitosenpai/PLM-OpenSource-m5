"use client"

import { useState, useMemo } from "react"
import { KpiTile } from "@/components/analytics/kpi-tile"
import { Clock, Activity, Zap, AlertTriangle } from "lucide-react"
import {
  generateWorkItems,
  generateCumulativeFlowData,
  generateBottleneckHeatmapData,
  generateBlockerReasonsData,
  generateCycleTimeScatterData,
  generateAverageTimePerStageData,
  generateStageBottlenecksData,
  calculateCycleTime,
  calculateLeadTime,
  calculateKPIWithDelta,
  type WorkItem,
} from "@/lib/analytics-dummy-data"
import { RightDrawer } from "@/components/analytics/right-drawer"
import { TimeSeriesChart } from "@/components/analytics/time-series-chart"
import { Heatmap } from "@/components/analytics/heatmap"
import { ParetoBar } from "@/components/analytics/pareto-bar"
import { ScatterPlot } from "@/components/analytics/scatter-plot"
import { SimpleBarChart } from "@/components/analytics/simple-bar-chart"
import { StageBottlenecksList } from "@/components/analytics/stage-bottlenecks-list"

export default function ProjectViewPage() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerTitle, setDrawerTitle] = useState("")
  const [drawerItems, setDrawerItems] = useState<WorkItem[]>([])

  const workItems = useMemo(() => generateWorkItems(26), [])

  const leadTimeKPI = useMemo(() => calculateKPIWithDelta(workItems, calculateLeadTime, true), [workItems])
  const cycleTimeKPI = useMemo(() => calculateKPIWithDelta(workItems, calculateCycleTime, true), [workItems])

  const flowEfficiencyKPI = useMemo(
    () =>
      calculateKPIWithDelta(
        workItems,
        (items) => {
          const completed = items.filter((item) => item.completedAt && item.startedAt)
          if (completed.length === 0) return 0

          const total = completed.reduce((sum, item) => {
            const totalTime = (item.completedAt!.getTime() - item.startedAt!.getTime()) / (1000 * 60 * 60 * 24)
            const activeTime = totalTime - item.blockedHours / 24
            return sum + (activeTime / totalTime) * 100
          }, 0)

          return Math.round(total / completed.length)
        },
        false,
      ),
    [workItems],
  )

  const blockedTimeKPI = useMemo(
    () =>
      calculateKPIWithDelta(
        workItems,
        (items) => {
          const blocked = items.filter((item) => item.blockedHours > 0)
          if (blocked.length === 0) return 0

          const total = blocked.reduce((sum, item) => sum + item.blockedHours, 0)
          return Math.round(total / blocked.length)
        },
        true,
      ),
    [workItems],
  )

  const cumulativeFlowData = useMemo(() => generateCumulativeFlowData(workItems), [workItems])
  const bottleneckData = useMemo(() => generateBottleneckHeatmapData(workItems), [workItems])
  const blockerReasonsData = useMemo(() => generateBlockerReasonsData(workItems), [workItems])
  const cycleTimeScatterData = useMemo(() => generateCycleTimeScatterData(workItems), [workItems])

  const avgTimePerStageData = useMemo(() => generateAverageTimePerStageData(workItems), [workItems])
  const stageBottlenecksData = useMemo(() => generateStageBottlenecksData(workItems), [workItems])

  const agingWIPData = useMemo(() => {
    const now = new Date()
    return workItems
      .filter((item) => item.startedAt && !item.completedAt)
      .map((item) => {
        const age = Math.floor((now.getTime() - item.startedAt!.getTime()) / (1000 * 60 * 60 * 24))
        return {
          id: item.id,
          age,
          storyPoints: item.storyPoints,
          assignee: item.assignee,
        }
      })
  }, [workItems])

  const handleHeatmapCellClick = (cellData: any) => {
    setDrawerTitle(`${cellData.y} - ${cellData.x}`)
    setDrawerItems(cellData.items || [])
    setDrawerOpen(true)
  }

  const handleBlockerBarClick = (data: any) => {
    setDrawerTitle(`Blocked by: ${data.name}`)
    setDrawerItems(data.items || [])
    setDrawerOpen(true)
  }

  return (
    <div className="p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Hero KPI Tiles */}
        <div className="grid grid-cols-4 gap-4">
          <KpiTile
            title="Lead Time"
            value={`${leadTimeKPI.value}d`}
            delta={leadTimeKPI.delta}
            trend={leadTimeKPI.trend === "up" ? "down" : leadTimeKPI.trend === "down" ? "up" : "neutral"}
            caption="Created → Done"
            icon={<Clock className="h-4 w-4 text-muted-foreground" />}
          />
          <KpiTile
            title="Cycle Time"
            value={`${cycleTimeKPI.value}d`}
            delta={cycleTimeKPI.delta}
            trend={cycleTimeKPI.trend === "up" ? "down" : cycleTimeKPI.trend === "down" ? "up" : "neutral"}
            caption="Started → Done"
            icon={<Activity className="h-4 w-4 text-muted-foreground" />}
          />
          <KpiTile
            title="Flow Efficiency"
            value={`${flowEfficiencyKPI.value}%`}
            delta={flowEfficiencyKPI.delta}
            trend={flowEfficiencyKPI.trend}
            caption="Active time / Total elapsed"
            icon={<Zap className="h-4 w-4 text-muted-foreground" />}
          />
          <KpiTile
            title="Blocked Time"
            value={`${blockedTimeKPI.value}h`}
            delta={blockedTimeKPI.delta}
            trend={blockedTimeKPI.trend === "up" ? "down" : blockedTimeKPI.trend === "down" ? "up" : "neutral"}
            caption="Avg hours blocked per item"
            icon={<AlertTriangle className="h-4 w-4 text-muted-foreground" />}
          />
        </div>

        {/* Section A - Flow */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">Flow</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <TimeSeriesChart
              title="Cumulative Flow Diagram"
              description="Work items by status over time"
              data={cumulativeFlowData}
              lines={[
                { dataKey: "done", name: "Done", color: "hsl(var(--chart-2))" },
                { dataKey: "review", name: "Review", color: "hsl(var(--chart-4))" },
                { dataKey: "inprogress", name: "In Progress", color: "hsl(var(--chart-1))" },
                { dataKey: "todo", name: "To Do", color: "hsl(var(--chart-3))" },
              ]}
              yAxisLabel="Cumulative Items"
            />

            <ScatterPlot
              title="Aging Work-in-Progress"
              description="Age vs size of active work items"
              data={agingWIPData}
              xKey="age"
              yKey="storyPoints"
              zKey="storyPoints"
              xLabel="Age (days)"
              yLabel="Story Points"
            />
          </div>
        </div>

        {/* Section B - Bottlenecks */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">Bottlenecks</h2>
          <div className="space-y-6">
            <Heatmap
              title="Bottleneck Heatmap"
              helpText="Shows how long work items wait in each stage on average each week. Longer times indicate a queue or resource constraint. Use it to spot stages that routinely cause delays."
              data={bottleneckData.data}
              xLabels={bottleneckData.xLabels}
              yLabels={bottleneckData.yLabels}
              xAxisLabel="Week Starting"
              yAxisLabel="Workflow Stage"
              valueLabel="Avg hours in stage"
              slaThreshold={72}
              onCellClick={handleHeatmapCellClick}
            />

            <ParetoBar
              title="Top Blocker Reasons (Pareto)"
              helpText="Every time an item is marked blocked, a reason is captured (e.g., Waiting for review, Dependency). This chart ranks reasons by total blocked hours in the selected period. The line shows the cumulative share (Pareto) so you can focus on the few reasons that cause most delay."
              data={blockerReasonsData}
              onBarClick={handleBlockerBarClick}
            />
          </div>
        </div>

        {/* Section C - Stage Analytics */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">Stage Analytics</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <SimpleBarChart
              title="Average Time per Stage"
              description="Average days spent in each workflow stage"
              data={avgTimePerStageData}
              yAxisLabel="Days"
              valueUnit=" days"
            />

            <StageBottlenecksList
              title="Stage Bottlenecks"
              description="Stages ranked by average time and affected projects"
              data={stageBottlenecksData}
            />
          </div>
        </div>
      </div>

      <RightDrawer open={drawerOpen} onOpenChange={setDrawerOpen} title={drawerTitle} items={drawerItems} />
    </div>
  )
}
