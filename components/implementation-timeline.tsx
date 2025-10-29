"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format, parseISO, differenceInDays } from "date-fns"

interface TimelineIssue {
  key: string
  summary: string
  status: string
  statusCategory: string
  issueType: string
  created: string
  updated: string
  dueDate?: string
  resolutionDate?: string
  assignee: {
    name: string
    email: string
  } | null
}

interface ImplementationTimelineProps {
  issues: TimelineIssue[]
  sprintStartDate?: string
  sprintEndDate?: string
}

export function ImplementationTimeline({ issues, sprintStartDate, sprintEndDate }: ImplementationTimelineProps) {
  // Sort issues by created date
  const sortedIssues = [...issues].sort((a, b) => {
    return new Date(a.created).getTime() - new Date(b.created).getTime()
  })

  // Calculate timeline bounds
  const getTimelineBounds = () => {
    if (issues.length === 0) {
      return { start: new Date(), end: new Date() }
    }

    const dates = issues.flatMap(
      (issue) =>
        [
          new Date(issue.created),
          issue.dueDate ? new Date(issue.dueDate) : null,
          issue.resolutionDate ? new Date(issue.resolutionDate) : null,
        ].filter(Boolean) as Date[],
    )

    if (sprintStartDate) dates.push(new Date(sprintStartDate))
    if (sprintEndDate) dates.push(new Date(sprintEndDate))

    const start = new Date(Math.min(...dates.map((d) => d.getTime())))
    const end = new Date(Math.max(...dates.map((d) => d.getTime())))

    return { start, end }
  }

  const { start: timelineStart, end: timelineEnd } = getTimelineBounds()
  const totalDays = differenceInDays(timelineEnd, timelineStart) || 1

  const getPositionAndWidth = (startDate: string, endDate?: string) => {
    const start = new Date(startDate)
    const end = endDate ? new Date(endDate) : new Date()

    const startOffset = differenceInDays(start, timelineStart)
    const duration = differenceInDays(end, start) || 1

    const left = (startOffset / totalDays) * 100
    const width = (duration / totalDays) * 100

    return { left: `${Math.max(0, left)}%`, width: `${Math.min(100 - left, width)}%` }
  }

  const getStatusColor = (statusCategory: string) => {
    switch (statusCategory) {
      case "done":
        return "bg-success/80 border-success"
      case "indeterminate":
        return "bg-primary/80 border-primary"
      default:
        return "bg-muted-foreground/60 border-muted-foreground"
    }
  }

  const getIssueTypeIcon = (issueType: string) => {
    const type = issueType.toLowerCase()
    if (type.includes("story")) return "📖"
    if (type.includes("bug")) return "🐛"
    if (type.includes("task")) return "✓"
    if (type.includes("epic")) return "⚡"
    return "📋"
  }

  if (issues.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 items-center justify-center text-muted-foreground">
            No issues available to display timeline
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Implementation Timeline</CardTitle>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>
            {format(timelineStart, "MMM d, yyyy")} - {format(timelineEnd, "MMM d, yyyy")}
          </span>
          <span>•</span>
          <span>{totalDays} days</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Timeline header with date markers */}
          <div className="relative h-8 border-b border-border">
            <div className="absolute left-0 top-0 text-xs text-muted-foreground">{format(timelineStart, "MMM d")}</div>
            <div className="absolute left-1/2 top-0 -translate-x-1/2 text-xs text-muted-foreground">
              {format(new Date((timelineStart.getTime() + timelineEnd.getTime()) / 2), "MMM d")}
            </div>
            <div className="absolute right-0 top-0 text-xs text-muted-foreground">{format(timelineEnd, "MMM d")}</div>
          </div>

          {/* Sprint indicator if available */}
          {sprintStartDate && sprintEndDate && (
            <div className="relative h-8">
              <div
                className="absolute top-0 h-full rounded border-2 border-dashed border-primary/50 bg-primary/10"
                style={getPositionAndWidth(sprintStartDate, sprintEndDate)}
              >
                <span className="absolute left-2 top-1 text-xs font-medium text-primary">Sprint</span>
              </div>
            </div>
          )}

          {/* Issue timeline bars */}
          <div className="space-y-3">
            {sortedIssues.map((issue) => {
              const endDate = issue.resolutionDate || issue.dueDate || issue.updated
              const position = getPositionAndWidth(issue.created, endDate)

              return (
                <div key={issue.key} className="group relative">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-xs">{getIssueTypeIcon(issue.issueType)}</span>
                    <span className="font-mono text-xs text-muted-foreground">{issue.key}</span>
                    <span className="flex-1 truncate text-sm">{issue.summary}</span>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        issue.statusCategory === "done"
                          ? "border-success/50 bg-success/10 text-success"
                          : issue.statusCategory === "indeterminate"
                            ? "border-primary/50 bg-primary/10 text-primary"
                            : "border-muted-foreground/50 bg-muted text-muted-foreground"
                      }`}
                    >
                      {issue.status}
                    </Badge>
                  </div>
                  <div className="relative h-8 rounded bg-muted/30">
                    <div
                      className={`absolute top-1 h-6 rounded border-2 transition-all group-hover:shadow-lg ${getStatusColor(issue.statusCategory)}`}
                      style={position}
                    >
                      <div className="flex h-full items-center justify-between px-2">
                        <span className="text-xs font-medium text-white">
                          {format(parseISO(issue.created), "MMM d")}
                        </span>
                        {(issue.resolutionDate || issue.dueDate) && (
                          <span className="text-xs font-medium text-white">{format(parseISO(endDate), "MMM d")}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {issue.assignee && (
                    <div className="mt-1 text-xs text-muted-foreground">Assigned to: {issue.assignee.name}</div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 border-t border-border pt-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="h-3 w-8 rounded border-2 border-success bg-success/80" />
              <span className="text-muted-foreground">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-8 rounded border-2 border-primary bg-primary/80" />
              <span className="text-muted-foreground">In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-8 rounded border-2 border-muted-foreground bg-muted-foreground/60" />
              <span className="text-muted-foreground">To Do</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
