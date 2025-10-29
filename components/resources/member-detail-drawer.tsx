"use client"

import { X, Mail, Briefcase, Users, TrendingUp, AlertCircle, Download, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { TeamMember, Opportunity } from "@/lib/mock-data"
import { forecastCapacity, getCapacityColor } from "@/lib/capacity-forecast"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

interface MemberDetailDrawerProps {
  member: TeamMember
  projects: Opportunity[]
  onClose: () => void
}

export function MemberDetailDrawer({ member, projects, onClose }: MemberDetailDrawerProps) {
  const forecast = forecastCapacity(member)
  const capacityColor = getCapacityColor(member.capacity)

  const getStatusColor = (capacity: number) => {
    if (capacity > 110) return "text-destructive"
    if (capacity > 100) return "text-warning"
    if (capacity < 70) return "text-muted-foreground"
    return "text-success"
  }

  const getStatusLabel = (capacity: number) => {
    if (capacity > 110) return "Overallocated"
    if (capacity > 100) return "High"
    if (capacity < 70) return "Available"
    return "Optimal"
  }

  const getForecastBadgeVariant = (utilization: number) => {
    if (utilization > 110) return "destructive"
    if (utilization > 100) return "default"
    if (utilization < 70) return "secondary"
    return "outline"
  }

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl border-l border-border bg-background shadow-xl">
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">{member.name}</h2>
            <p className="text-sm text-muted-foreground">{member.role}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close drawer">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Profile Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{member.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{member.role}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <Badge variant="outline" className="capitalize">
                    {member.team} Team
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Current Capacity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Current Capacity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-2xl font-bold ${getStatusColor(member.capacity)}`}>{member.capacity}%</span>
                  <Badge variant={getForecastBadgeVariant(member.capacity)}>{getStatusLabel(member.capacity)}</Badge>
                </div>
                <Progress
                  value={Math.min(member.capacity, 100)}
                  className="h-3"
                  style={{ backgroundColor: capacityColor }}
                />
                {member.weeklyCapacityHours && (
                  <p className="text-xs text-muted-foreground">
                    {Math.round((member.capacity / 100) * member.weeklyCapacityHours * 10) / 10}h /{" "}
                    {member.weeklyCapacityHours}h per week
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Utilization History */}
            {member.history && member.history.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Utilization Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={member.history}>
                      <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "6px",
                        }}
                        labelStyle={{ color: "hsl(var(--popover-foreground))" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={{ fill: "hsl(var(--primary))" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Capacity Forecast */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Capacity Forecast
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Next week estimate:</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-semibold ${getStatusColor(forecast.nextWeekUtilization)}`}>
                      {forecast.nextWeekUtilization}%
                    </span>
                    <Badge variant={getForecastBadgeVariant(forecast.nextWeekUtilization)} className="text-xs">
                      {getStatusLabel(forecast.nextWeekUtilization)}
                    </Badge>
                  </div>
                </div>
                {forecast.estimatedHours && (
                  <p className="text-xs text-muted-foreground">Estimated: {forecast.estimatedHours}h</p>
                )}
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span>Confidence:</span>
                  <Badge variant="outline" className="text-xs">
                    {forecast.confidence}
                  </Badge>
                </div>
                {forecast.insights.length > 0 && (
                  <div className="space-y-2 pt-2">
                    {forecast.insights.map((insight, i) => (
                      <div key={i} className="flex items-start gap-2 rounded-md bg-muted p-2">
                        <AlertCircle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-muted-foreground">{insight}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Assignments */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Current Assignments</CardTitle>
              </CardHeader>
              <CardContent>
                {projects.length > 0 ? (
                  <div className="space-y-2">
                    {projects.map((project) => (
                      <div
                        key={project.id}
                        className="flex items-center justify-between rounded-md border border-border p-3"
                      >
                        <div>
                          <p className="text-sm font-medium text-foreground">{project.name}</p>
                          <p className="text-xs text-muted-foreground">{project.id}</p>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {project.currentStage}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No current assignments</p>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start bg-transparent" disabled>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Rebalance Workload
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" disabled>
                  <Download className="mr-2 h-4 w-4" />
                  Export Member Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
