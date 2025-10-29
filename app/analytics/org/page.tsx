"use client"

import { useState, useMemo } from "react"
import { KpiTile } from "@/components/analytics/kpi-tile"
import { Target, CheckCircle, TrendingUp, PieChart } from "lucide-react"
import {
  generateWorkItems,
  generateOKRTree,
  generateEffortImpactData,
  generateInvestmentMixData,
  type WorkItem,
  type OKRNode,
} from "@/lib/analytics-dummy-data"
import { RightDrawer } from "@/components/analytics/right-drawer"
import { QuadrantPlot } from "@/components/analytics/quadrant-plot"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Cell, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Legend, Tooltip } from "recharts"

export default function OrgViewPage() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerTitle, setDrawerTitle] = useState("")
  const [drawerItems, setDrawerItems] = useState<WorkItem[]>([])

  const workItems = useMemo(() => generateWorkItems(26), [])

  const okrTree = useMemo(() => generateOKRTree(), [])
  const effortImpactData = useMemo(() => generateEffortImpactData(workItems), [workItems])
  const investmentMixData = useMemo(() => generateInvestmentMixData(workItems), [workItems])

  const investmentMix = useMemo(() => {
    const total = workItems.length
    const stories = workItems.filter((item) => item.type === "Story").length
    const bugs = workItems.filter((item) => item.type === "Bug").length
    const tasks = workItems.filter((item) => item.type === "Task").length

    return {
      feature: Math.round((stories / total) * 100),
      bug: Math.round((bugs / total) * 100),
      task: Math.round((tasks / total) * 100),
    }
  }, [workItems])

  const avgOKRProgress = useMemo(() => {
    const allProgress = okrTree.map((okr) => okr.progress)
    return Math.round(allProgress.reduce((sum, p) => sum + p, 0) / allProgress.length)
  }, [okrTree])

  const onTrackInitiatives = useMemo(() => {
    let total = 0
    let onTrack = 0
    okrTree.forEach((okr) => {
      okr.children?.forEach((kr) => {
        kr.children?.forEach((initiative) => {
          total++
          if (initiative.progress >= 70) onTrack++
        })
      })
    })
    return { onTrack, total }
  }, [okrTree])

  const renderOKRNode = (node: OKRNode, level = 0) => {
    const bgColor =
      node.type === "objective"
        ? "bg-blue-50 dark:bg-blue-950"
        : node.type === "keyResult"
          ? "bg-purple-50 dark:bg-purple-950"
          : "bg-gray-50 dark:bg-gray-900"
    const borderColor =
      node.progress >= 70 ? "border-green-500" : node.progress >= 40 ? "border-yellow-500" : "border-red-500"

    return (
      <div key={node.id} className={`ml-${level * 6} mb-3`}>
        <div className={`rounded-lg border-l-4 ${borderColor} ${bgColor} p-4`}>
          <div className="mb-2 flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {node.type === "objective" ? "O" : node.type === "keyResult" ? "KR" : "I"}
                </Badge>
                <span className="font-medium">{node.title}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{node.owner}</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">{node.progress}%</div>
            </div>
          </div>
          <Progress value={node.progress} className="h-2" />
        </div>
        {node.children && <div className="mt-2">{node.children.map((child) => renderOKRNode(child, level + 1))}</div>}
      </div>
    )
  }

  const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"]

  return (
    <div className="p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Hero KPI Tiles */}
        <div className="grid grid-cols-4 gap-4">
          <KpiTile
            title="OKR Progress"
            value={`${avgOKRProgress}%`}
            delta={5}
            trend="up"
            caption="Weighted by KR weights"
            icon={<Target className="h-4 w-4 text-muted-foreground" />}
          />
          <KpiTile
            title="On-Track Initiatives"
            value={`${onTrackInitiatives.onTrack} / ${onTrackInitiatives.total}`}
            delta={0}
            trend="neutral"
            caption={`${Math.round((onTrackInitiatives.onTrack / onTrackInitiatives.total) * 100)}% on track`}
            icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />}
          />
          <KpiTile
            title="Value Delivered"
            value="142"
            delta={12}
            trend="up"
            caption="Impact score this period"
            icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          />
          <KpiTile
            title="Investment Mix"
            value={`${investmentMix.feature}% Feature`}
            caption={`${investmentMix.bug}% Bug, ${investmentMix.task}% Task`}
            icon={<PieChart className="h-4 w-4 text-muted-foreground" />}
          />
        </div>

        {/* Section A - Objectives & Key Results */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">Objectives & Key Results</h2>
          <Card>
            <CardHeader>
              <CardTitle>Objective Tree</CardTitle>
              <CardDescription>Hierarchical view of OKRs and initiatives</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">{okrTree.map((okr) => renderOKRNode(okr))}</div>
            </CardContent>
          </Card>
        </div>

        {/* Section B - Outcomes & Adoption */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">Outcomes & Adoption</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Investment Mix</CardTitle>
                <CardDescription>Distribution of work by type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={investmentMixData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {investmentMixData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <QuadrantPlot
              title="Effort vs Impact Matrix"
              description="Projects plotted by effort and business impact"
              data={effortImpactData}
              xKey="effort"
              yKey="impact"
              nameKey="name"
              xLabel="Effort (Story Points)"
              yLabel="Impact Score"
              quadrantLabels={{
                topLeft: "Quick Wins",
                topRight: "Major Projects",
                bottomLeft: "Fill-ins",
                bottomRight: "Time Sinks",
              }}
            />
          </div>
        </div>

        {/* Section C - Alignment & Portfolio */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">Alignment & Portfolio</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Roadmap Alignment</CardTitle>
                <CardDescription>Work items mapped to strategic themes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                  Roadmap alignment visualization coming soon
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dependency Map</CardTitle>
                <CardDescription>Cross-team dependencies and blockers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                  Dependency graph coming soon
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <RightDrawer open={drawerOpen} onOpenChange={setDrawerOpen} title={drawerTitle} items={drawerItems} />
    </div>
  )
}
