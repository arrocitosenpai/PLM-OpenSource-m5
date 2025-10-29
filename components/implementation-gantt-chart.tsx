"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface GanttPhase {
  name: string
  startDate: string
  endDate: string
  status: "completed" | "in-progress" | "upcoming"
  duration: string
}

const ganttPhases: GanttPhase[] = [
  {
    name: "PDD Documentation",
    startDate: "2024-01-08",
    endDate: "2024-01-19",
    status: "completed",
    duration: "2 weeks",
  },
  {
    name: "SDD Documentation",
    startDate: "2024-01-22",
    endDate: "2024-02-02",
    status: "completed",
    duration: "2 weeks",
  },
  {
    name: "Development",
    startDate: "2024-02-05",
    endDate: "2024-02-16",
    status: "in-progress",
    duration: "2 weeks",
  },
  {
    name: "Unit Test",
    startDate: "2024-02-19",
    endDate: "2024-03-01",
    status: "upcoming",
    duration: "2 weeks",
  },
  {
    name: "UAT",
    startDate: "2024-03-04",
    endDate: "2024-03-15",
    status: "upcoming",
    duration: "2 weeks",
  },
  {
    name: "Pre Go Live",
    startDate: "2024-03-18",
    endDate: "2024-03-29",
    status: "upcoming",
    duration: "2 weeks",
  },
  {
    name: "Go Live",
    startDate: "2024-04-01",
    endDate: "2024-04-12",
    status: "upcoming",
    duration: "2 weeks",
  },
  {
    name: "Hypercare",
    startDate: "2024-04-15",
    endDate: "2024-04-26",
    status: "upcoming",
    duration: "2 weeks",
  },
]

export function ImplementationGanttChart() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const getStatusColor = (status: GanttPhase["status"]) => {
    switch (status) {
      case "completed":
        return "bg-success"
      case "in-progress":
        return "bg-primary"
      case "upcoming":
        return "bg-muted"
    }
  }

  const getStatusBadge = (status: GanttPhase["status"]) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="border-success/50 bg-success/10 text-success">
            Completed
          </Badge>
        )
      case "in-progress":
        return (
          <Badge variant="outline" className="border-primary/50 bg-primary/10 text-primary">
            In Progress
          </Badge>
        )
      case "upcoming":
        return (
          <Badge variant="outline" className="border-muted-foreground/50 bg-muted text-muted-foreground">
            Upcoming
          </Badge>
        )
    }
  }

  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader>
        <CardTitle>Implementation Gantt Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Header Row */}
          <div className="grid grid-cols-12 gap-4 border-b border-border pb-2 text-sm font-medium text-muted-foreground">
            <div className="col-span-3">Phase</div>
            <div className="col-span-2">Start Date</div>
            <div className="col-span-2">End Date</div>
            <div className="col-span-2">Duration</div>
            <div className="col-span-3">Timeline</div>
          </div>

          {/* Gantt Rows */}
          {ganttPhases.map((phase, index) => (
            <div
              key={phase.name}
              className="grid grid-cols-12 items-center gap-4 rounded-lg border border-border bg-card p-3 transition-all hover:border-primary/50 hover:shadow-sm"
            >
              {/* Phase Name */}
              <div className="col-span-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{phase.name}</span>
                  {getStatusBadge(phase.status)}
                </div>
              </div>

              {/* Start Date */}
              <div className="col-span-2">
                <div className="text-sm text-muted-foreground">{formatDate(phase.startDate)}</div>
              </div>

              {/* End Date */}
              <div className="col-span-2">
                <div className="text-sm text-muted-foreground">{formatDate(phase.endDate)}</div>
              </div>

              {/* Duration */}
              <div className="col-span-2">
                <div className="text-sm text-muted-foreground">{phase.duration}</div>
              </div>

              {/* Visual Timeline Bar */}
              <div className="col-span-3">
                <div className="relative h-8 rounded-full bg-muted">
                  <div
                    className={`h-8 rounded-full transition-all duration-500 ${getStatusColor(phase.status)}`}
                    style={{
                      width: phase.status === "completed" ? "100%" : phase.status === "in-progress" ? "60%" : "100%",
                      opacity: phase.status === "upcoming" ? 0.3 : 1,
                    }}
                  />
                  {phase.status === "in-progress" && (
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-primary-foreground">
                      60%
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center gap-6 border-t border-border pt-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-success" />
            <span className="text-xs text-muted-foreground">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground">In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-muted" />
            <span className="text-xs text-muted-foreground">Upcoming</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
