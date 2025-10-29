"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle, Clock } from "lucide-react"

interface Phase {
  name: string
  status: "completed" | "in-progress" | "upcoming"
}

const implementationPhases: Phase[] = [
  { name: "PDD Documentation", status: "completed" },
  { name: "SDD Documentation", status: "completed" },
  { name: "Development", status: "in-progress" },
  { name: "Unit Test", status: "upcoming" },
  { name: "UAT", status: "upcoming" },
  { name: "Pre Go Live", status: "upcoming" },
  { name: "Go Live", status: "upcoming" },
  { name: "Hypercare", status: "upcoming" },
]

export function ImplementationPhasesTimeline() {
  const getPhaseIcon = (status: Phase["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-success" />
      case "in-progress":
        return <Clock className="h-5 w-5 text-primary" />
      case "upcoming":
        return <Circle className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getPhaseColor = (status: Phase["status"]) => {
    switch (status) {
      case "completed":
        return "bg-success"
      case "in-progress":
        return "bg-primary"
      case "upcoming":
        return "bg-muted"
    }
  }

  return (
    <Card className="transition-all hover:shadow-md">
      <CardContent className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Implementation Phases</h3>
          <Badge variant="outline" className="border-primary/50 bg-primary/10 text-primary">
            Phase 3 of 8
          </Badge>
        </div>

        <div className="relative">
          {/* Timeline container */}
          <div className="flex items-start justify-between gap-2">
            {implementationPhases.map((phase, index) => (
              <div key={phase.name} className="relative flex flex-1 flex-col items-center">
                {/* Connecting line */}
                {index < implementationPhases.length - 1 && (
                  <div
                    className={`absolute left-1/2 top-5 h-0.5 w-full ${
                      phase.status === "completed" ? "bg-success" : "bg-muted"
                    }`}
                    style={{ transform: "translateY(-50%)" }}
                  />
                )}

                {/* Phase indicator */}
                <div className="relative z-10 mb-3 flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-card shadow-sm">
                  {getPhaseIcon(phase.status)}
                </div>

                {/* Phase name */}
                <div className="text-center">
                  <p
                    className={`text-xs font-medium leading-tight ${
                      phase.status === "in-progress"
                        ? "text-primary"
                        : phase.status === "completed"
                          ? "text-foreground"
                          : "text-muted-foreground"
                    }`}
                  >
                    {phase.name}
                  </p>
                </div>

                {/* Status indicator bar */}
                <div className="mt-2 h-1 w-full rounded-full bg-muted">
                  <div
                    className={`h-1 rounded-full transition-all duration-500 ${getPhaseColor(phase.status)}`}
                    style={{
                      width: phase.status === "completed" ? "100%" : phase.status === "in-progress" ? "60%" : "0%",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
