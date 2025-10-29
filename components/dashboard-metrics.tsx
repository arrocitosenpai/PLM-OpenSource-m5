"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Clock, AlertTriangle, CheckCircle2, TrendingDown } from "lucide-react"
import type { Opportunity } from "@/lib/mock-data"

interface DashboardMetricsProps {
  opportunities: Opportunity[]
}

export function DashboardMetrics({ opportunities }: DashboardMetricsProps) {
  const totalOpportunities = opportunities.length
  const inProgress = opportunities.filter((o) => o.status === "in-progress").length
  const completed = opportunities.filter((o) => o.status === "completed").length
  const atRisk = opportunities.filter((o) => o.status === "need-clarification" || o.priority === "high").length

  // Calculate average time in stage (convert time strings to hours)
  const avgTimeInStage = opportunities.reduce((acc, opp) => {
    const match = opp.timeInStage.match(/(\d+)d\s*(\d+)h/)
    if (match) {
      const days = Number.parseInt(match[1])
      const hours = Number.parseInt(match[2])
      return acc + days * 24 + hours
    }
    return acc
  }, 0)
  const avgHours = Math.round(avgTimeInStage / totalOpportunities)
  const avgDays = Math.floor(avgHours / 24)
  const remainingHours = avgHours % 24

  const totalTrend = 12 // +12% from last period
  const progressTrend = 8 // +8% from last period
  const timeTrend = -5 // -5% (improvement)
  const riskTrend = 15 // +15% (needs attention)

  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
      <Card className="kpi-card-glow border-border/50 bg-gradient-to-br from-card to-card/80 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--kpi-total)]/5 to-transparent" />
        <CardContent className="relative p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-muted-foreground">Total Opportunities</p>
              <p className="mt-1 text-3xl font-bold text-foreground">{totalOpportunities}</p>
              <div className="mt-1.5 flex items-center gap-1 text-sm">
                <TrendingUp className="h-3 w-3 text-[var(--kpi-total)] flex-shrink-0" />
                <span className="font-medium text-[var(--kpi-total)]">+{totalTrend}%</span>
                <span className="text-muted-foreground truncate">vs last period</span>
              </div>
            </div>
            <div className="rounded-full bg-[var(--kpi-total-bg)] p-2.5 ring-1 ring-[var(--kpi-total)]/20 flex-shrink-0">
              <TrendingUp className="h-5 w-5 text-[var(--kpi-total)]" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="kpi-card-glow border-border/50 bg-gradient-to-br from-card to-card/80 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--kpi-progress)]/5 to-transparent" />
        <CardContent className="relative p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-muted-foreground">In Progress / Completed</p>
              <p className="mt-1 text-3xl font-bold text-foreground">
                {inProgress} / {completed}
              </p>
              <div className="mt-1.5 flex items-center gap-1 text-sm">
                <TrendingUp className="h-3 w-3 text-[var(--kpi-progress)] flex-shrink-0" />
                <span className="font-medium text-[var(--kpi-progress)]">+{progressTrend}%</span>
                <span className="text-muted-foreground truncate">completion rate</span>
              </div>
            </div>
            <div className="rounded-full bg-[var(--kpi-progress-bg)] p-2.5 ring-1 ring-[var(--kpi-progress)]/20 flex-shrink-0">
              <CheckCircle2 className="h-5 w-5 text-[var(--kpi-progress)]" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="kpi-card-glow border-border/50 bg-gradient-to-br from-card to-card/80 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--kpi-time)]/5 to-transparent" />
        <CardContent className="relative p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-muted-foreground">Avg Time in Stage</p>
              <p className="mt-1 text-3xl font-bold text-foreground">
                {avgDays}d {remainingHours}h
              </p>
              <div className="mt-1.5 flex items-center gap-1 text-sm">
                <TrendingDown className="h-3 w-3 text-[var(--kpi-time)] flex-shrink-0" />
                <span className="font-medium text-[var(--kpi-time)]">{timeTrend}%</span>
                <span className="text-muted-foreground truncate">faster than before</span>
              </div>
            </div>
            <div className="rounded-full bg-[var(--kpi-time-bg)] p-2.5 ring-1 ring-[var(--kpi-time)]/20 flex-shrink-0">
              <Clock className="h-5 w-5 text-[var(--kpi-time)]" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="kpi-card-glow border-border/50 bg-gradient-to-br from-card to-card/80 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--kpi-risk)]/5 to-transparent" />
        <CardContent className="relative p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-muted-foreground">At Risk / Needs Attention</p>
              <p className="mt-1 text-3xl font-bold text-foreground">{atRisk}</p>
              <div className="mt-1.5 flex items-center gap-1 text-sm">
                <TrendingUp className="h-3 w-3 text-[var(--kpi-risk)] flex-shrink-0" />
                <span className="font-medium text-[var(--kpi-risk)]">+{riskTrend}%</span>
                <span className="text-muted-foreground truncate">requires review</span>
              </div>
            </div>
            <div className="rounded-full bg-[var(--kpi-risk-bg)] p-2.5 ring-1 ring-[var(--kpi-risk)]/20 flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-[var(--kpi-risk)]" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
