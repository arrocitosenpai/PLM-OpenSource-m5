"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts"
import type { TeamMember } from "@/lib/mock-data"

interface CapacityChartsProps {
  members: TeamMember[]
  onFilterByBand?: (band: "under" | "balanced" | "high" | "over" | null) => void
  onFilterByTeam?: (team: string | null) => void
  activeCapacityBand?: "all" | "under" | "balanced" | "high" | "over"
  activeTeam?: string | null
}

export function CapacityCharts({
  members,
  onFilterByBand,
  onFilterByTeam,
  activeCapacityBand = "all",
  activeTeam = null,
}: CapacityChartsProps) {
  const COLORS = {
    under: "#94a3b8",
    balanced: "#10b981",
    high: "#f59e0b",
    over: "#ef4444",
  }

  // Capacity Distribution Data
  const capacityDistribution = [
    {
      name: "Under (<70%)",
      value: members.filter((m) => m.capacity < 70).length,
      fill: COLORS.under,
      band: "under" as const,
    },
    {
      name: "Balanced (70-100%)",
      value: members.filter((m) => m.capacity >= 70 && m.capacity <= 100).length,
      fill: COLORS.balanced,
      band: "balanced" as const,
    },
    {
      name: "High (100-110%)",
      value: members.filter((m) => m.capacity > 100 && m.capacity <= 110).length,
      fill: COLORS.high,
      band: "high" as const,
    },
    {
      name: "Over (>110%)",
      value: members.filter((m) => m.capacity > 110).length,
      fill: COLORS.over,
      band: "over" as const,
    },
  ]

  const totalMembers = members.length

  // Team Load Data
  const teams = ["product", "engineering", "platform"]
  const teamLoadData = teams.map((team) => {
    const teamMembers = members.filter((m) => m.team === team)
    return {
      team: team.charAt(0).toUpperCase() + team.slice(1),
      teamKey: team,
      available: teamMembers.filter((m) => m.capacity < 70).length,
      optimal: teamMembers.filter((m) => m.capacity >= 70 && m.capacity <= 100).length,
      high: teamMembers.filter((m) => m.capacity > 100 && m.capacity <= 110).length,
      overallocated: teamMembers.filter((m) => m.capacity > 110).length,
    }
  })

  // Utilization Trend Data (average across all members)
  const utilizationTrend = members[0]?.history
    ? members[0].history.map((h, i) => {
        const weekAvg =
          members.reduce((sum, m) => {
            const historyValue = m.history?.[i]?.value || m.capacity
            return sum + historyValue
          }, 0) / members.length
        return {
          week: h.week,
          avgUtilization: Math.round(weekAvg),
        }
      })
    : []

  const handlePieClick = (data: any) => {
    const clickedBand = data.band
    // If clicking the same band, clear the filter
    if (activeCapacityBand === clickedBand) {
      onFilterByBand?.(null)
    } else {
      onFilterByBand?.(clickedBand)
    }
  }

  const handleBarClick = (data: any) => {
    const clickedTeam = data.teamKey
    // If clicking the same team, clear the filter
    if (activeTeam === clickedTeam) {
      onFilterByTeam?.(null)
    } else {
      onFilterByTeam?.(clickedTeam)
    }
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const percentage = totalMembers > 0 ? Math.round((data.value / totalMembers) * 100) : 0
      return (
        <div className="rounded-lg border-2 border-border bg-popover p-4 shadow-xl">
          <p className="text-base font-semibold text-popover-foreground">{data.name}</p>
          <p className="text-sm font-medium text-muted-foreground">
            {data.value} members ({percentage}%)
          </p>
        </div>
      )
    }
    return null
  }

  // Custom tooltip for Team Load chart
  const TeamLoadTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const total = data.available + data.optimal + data.high + data.overallocated

      return (
        <div className="rounded-lg border-2 border-border bg-popover p-4 shadow-xl">
          <p className="mb-2 text-base font-semibold text-popover-foreground">{data.team}</p>
          <div className="space-y-1">
            {data.available > 0 && (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: COLORS.under }} />
                  <span className="text-sm text-muted-foreground">Available:</span>
                </div>
                <span className="text-sm font-medium text-popover-foreground">{data.available}</span>
              </div>
            )}
            {data.optimal > 0 && (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: COLORS.balanced }} />
                  <span className="text-sm text-muted-foreground">Optimal:</span>
                </div>
                <span className="text-sm font-medium text-popover-foreground">{data.optimal}</span>
              </div>
            )}
            {data.high > 0 && (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: COLORS.high }} />
                  <span className="text-sm text-muted-foreground">High:</span>
                </div>
                <span className="text-sm font-medium text-popover-foreground">{data.high}</span>
              </div>
            )}
            {data.overallocated > 0 && (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: COLORS.over }} />
                  <span className="text-sm text-muted-foreground">Overallocated:</span>
                </div>
                <span className="text-sm font-medium text-popover-foreground">{data.overallocated}</span>
              </div>
            )}
            <div className="mt-2 flex items-center justify-between gap-4 border-t border-border pt-2">
              <span className="text-sm font-medium text-muted-foreground">Total:</span>
              <span className="text-sm font-semibold text-popover-foreground">{total}</span>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Capacity Distribution Donut */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Capacity Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          {totalMembers > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={capacityDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  onClick={handlePieClick}
                  className="cursor-pointer"
                >
                  {capacityDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${entry.band}-${index}`}
                      fill={entry.fill}
                      stroke={activeCapacityBand === entry.band ? "#8b5cf6" : "#ffffff"}
                      strokeWidth={activeCapacityBand === entry.band ? 3 : 1}
                      opacity={activeCapacityBand === "all" || activeCapacityBand === entry.band ? 1 : 0.4}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value, entry: any) => {
                    const percentage = totalMembers > 0 ? Math.round((entry.payload.value / totalMembers) * 100) : 0
                    return (
                      <span className="text-xs font-medium" style={{ color: entry.payload.fill }}>
                        {value}: {entry.payload.value} ({percentage}%)
                      </span>
                    )
                  }}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">
              No data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Team Load Stacked Bar */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Team Load</CardTitle>
        </CardHeader>
        <CardContent>
          {teamLoadData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={teamLoadData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border opacity-30" />
                <XAxis dataKey="team" className="text-xs" tick={{ fill: "currentColor" }} stroke="currentColor" />
                <YAxis className="text-xs" tick={{ fill: "currentColor" }} stroke="currentColor" />
                <Tooltip content={<TeamLoadTooltip />} cursor={{ fill: "hsl(var(--muted) / 0.2)" }} />
                <Bar
                  dataKey="available"
                  stackId="a"
                  fill={COLORS.under}
                  onClick={handleBarClick}
                  className="cursor-pointer"
                  name="Available"
                  opacity={activeTeam === null || activeTeam === undefined ? 1 : 0.3}
                />
                <Bar
                  dataKey="optimal"
                  stackId="a"
                  fill={COLORS.balanced}
                  onClick={handleBarClick}
                  className="cursor-pointer"
                  name="Optimal"
                  opacity={activeTeam === null || activeTeam === undefined ? 1 : 0.3}
                />
                <Bar
                  dataKey="high"
                  stackId="a"
                  fill={COLORS.high}
                  onClick={handleBarClick}
                  className="cursor-pointer"
                  name="High"
                  opacity={activeTeam === null || activeTeam === undefined ? 1 : 0.3}
                />
                <Bar
                  dataKey="overallocated"
                  stackId="a"
                  fill={COLORS.over}
                  onClick={handleBarClick}
                  className="cursor-pointer"
                  name="Overallocated"
                  opacity={activeTeam === null || activeTeam === undefined ? 1 : 0.3}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">
              No data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Utilization Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Utilization Trend</CardTitle>
        </CardHeader>
        <CardContent>
          {utilizationTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={utilizationTrend}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border opacity-30" />
                <XAxis dataKey="week" className="text-xs" tick={{ fill: "currentColor" }} stroke="currentColor" />
                <YAxis className="text-xs" domain={[0, 120]} tick={{ fill: "currentColor" }} stroke="currentColor" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    padding: "12px",
                    color: "hsl(var(--popover-foreground))",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                  formatter={(value: number) => [`${value}%`, "Avg Utilization"]}
                />
                <Line
                  type="monotone"
                  dataKey="avgUtilization"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ fill: "#8b5cf6", r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[250px] flex-col items-center justify-center gap-2 text-center">
              <p className="text-sm text-muted-foreground">No historical data available</p>
              <p className="text-xs text-muted-foreground">Utilization trends will appear once data is collected</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
