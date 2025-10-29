"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { ArrowRight, CheckCircle2, Clock, Users, Wrench, Rocket } from "lucide-react"

const stages = [
  {
    id: "intake",
    name: "Intake",
    icon: CheckCircle2,
    color: "from-purple-500 to-purple-600",
    description: "Initial assessment and requirements gathering",
    activities: ["Opportunity submission", "Initial review", "Feasibility check"],
  },
  {
    id: "product",
    name: "Product",
    icon: Users,
    color: "from-blue-500 to-blue-600",
    description: "Product design and specification",
    activities: ["Requirements analysis", "User stories", "Design mockups"],
  },
  {
    id: "engineering",
    name: "Engineering",
    icon: Wrench,
    color: "from-green-500 to-green-600",
    description: "Technical implementation and development",
    activities: ["Architecture design", "Development", "Code review"],
  },
  {
    id: "platform",
    name: "Platform",
    icon: Clock,
    color: "from-amber-500 to-amber-600",
    description: "Infrastructure and deployment preparation",
    activities: ["Infrastructure setup", "Testing", "Security review"],
  },
  {
    id: "implementation",
    name: "Implementation",
    icon: Rocket,
    color: "from-red-500 to-red-600",
    description: "Final deployment and launch",
    activities: ["Deployment", "Monitoring", "Documentation"],
  },
]

export function PresentationFlow() {
  const [activeStage, setActiveStage] = useState(0)
  const [flowProgress, setFlowProgress] = useState(0)

  useEffect(() => {
    const stageInterval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % stages.length)
      setFlowProgress(0)
    }, 4000)

    const progressInterval = setInterval(() => {
      setFlowProgress((prev) => (prev >= 100 ? 0 : prev + 2))
    }, 80)

    return () => {
      clearInterval(stageInterval)
      clearInterval(progressInterval)
    }
  }, [])

  return (
    <div className="space-y-8">
      {/* Title Section */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">NUVIO Project Lifecycle</h2>
        <p className="text-lg text-muted-foreground">
          Ship the right product, faster - A seamless journey from idea to implementation
        </p>
      </div>

      {/* Main Flow Visualization */}
      <Card className="p-8 bg-gradient-to-br from-card to-card/80">
        <div className="relative">
          {/* Stage Cards */}
          <div className="flex items-center justify-between gap-4">
            {stages.map((stage, index) => {
              const Icon = stage.icon
              const isActive = index === activeStage
              const isPast = index < activeStage
              const isCurrent = index === activeStage

              return (
                <div key={stage.id} className="flex items-center flex-1">
                  {/* Stage Card */}
                  <div
                    className={`
                      relative flex-1 transition-all duration-500 ease-in-out
                      ${isActive ? "scale-110 z-10" : "scale-100"}
                    `}
                  >
                    <div
                      className={`
                        rounded-xl border-2 p-6 transition-all duration-500
                        ${
                          isActive
                            ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                            : isPast
                              ? "border-green-500/50 bg-green-500/5"
                              : "border-border bg-card/50"
                        }
                      `}
                    >
                      {/* Icon */}
                      <div
                        className={`
                          mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full
                          bg-gradient-to-br ${stage.color} transition-all duration-500
                          ${isActive ? "animate-pulse" : ""}
                        `}
                      >
                        <Icon className="h-8 w-8 text-white" />
                      </div>

                      {/* Stage Name */}
                      <h3
                        className={`
                          text-center text-xl font-bold mb-2 transition-colors duration-500
                          ${isActive ? "text-foreground" : "text-muted-foreground"}
                        `}
                      >
                        {stage.name}
                      </h3>

                      {/* Description */}
                      <p
                        className={`
                          text-center text-sm mb-4 transition-all duration-500
                          ${isActive ? "text-foreground/80 opacity-100" : "text-muted-foreground/60 opacity-70"}
                        `}
                      >
                        {stage.description}
                      </p>

                      {/* Activities - Only show for active stage */}
                      <div
                        className={`
                          space-y-1 transition-all duration-500 overflow-hidden
                          ${isActive ? "max-h-32 opacity-100" : "max-h-0 opacity-0"}
                        `}
                      >
                        {stage.activities.map((activity, actIndex) => (
                          <div
                            key={actIndex}
                            className="flex items-center gap-2 text-xs text-muted-foreground"
                            style={{
                              animation: isActive ? `slideIn 0.3s ease-out ${actIndex * 0.1}s both` : "none",
                            }}
                          >
                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                            <span>{activity}</span>
                          </div>
                        ))}
                      </div>

                      {/* Completion Checkmark */}
                      {isPast && (
                        <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-green-500 shadow-lg">
                          <CheckCircle2 className="h-5 w-5 text-white" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Animated Arrow */}
                  {index < stages.length - 1 && (
                    <div className="relative flex items-center justify-center w-16 mx-2">
                      {/* Arrow */}
                      <ArrowRight
                        className={`
                          h-8 w-8 transition-all duration-500
                          ${
                            isCurrent
                              ? "text-primary animate-pulse"
                              : isPast
                                ? "text-green-500"
                                : "text-muted-foreground/30"
                          }
                        `}
                      />

                      {/* Flowing Particles */}
                      {isCurrent && (
                        <>
                          <div
                            className="absolute h-2 w-2 rounded-full bg-primary"
                            style={{
                              left: `${flowProgress}%`,
                              animation: "float 0.5s ease-in-out infinite",
                            }}
                          />
                          <div
                            className="absolute h-1.5 w-1.5 rounded-full bg-primary/60"
                            style={{
                              left: `${(flowProgress - 30 + 100) % 100}%`,
                              animation: "float 0.5s ease-in-out infinite 0.2s",
                            }}
                          />
                        </>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Progress Bar */}
          <div className="mt-8 space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Overall Progress</span>
              <span>{Math.round((activeStage / (stages.length - 1)) * 100)}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 via-blue-500 via-green-500 via-amber-500 to-red-500 transition-all duration-500"
                style={{ width: `${(activeStage / (stages.length - 1)) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Key Benefits */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
          <h3 className="text-lg font-semibold text-foreground mb-2">Structured Process</h3>
          <p className="text-sm text-muted-foreground">
            Clear stages ensure every project follows a proven methodology from concept to completion.
          </p>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
          <h3 className="text-lg font-semibold text-foreground mb-2">Visibility & Tracking</h3>
          <p className="text-sm text-muted-foreground">
            Real-time monitoring of project status across all stages with comprehensive analytics.
          </p>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
          <h3 className="text-lg font-semibold text-foreground mb-2">Team Collaboration</h3>
          <p className="text-sm text-muted-foreground">
            Seamless handoffs between teams with clear responsibilities and feedback loops.
          </p>
        </Card>
      </div>

      {/* Stage Details Table */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-foreground mb-4">Stage Details</h3>
        <div className="space-y-4">
          {stages.map((stage, index) => {
            const Icon = stage.icon
            return (
              <div
                key={stage.id}
                className={`
                  flex items-start gap-4 p-4 rounded-lg border transition-all duration-300
                  ${index === activeStage ? "border-primary bg-primary/5" : "border-border bg-card/50 hover:bg-card/80"}
                `}
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${stage.color}`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">{stage.name}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{stage.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {stage.activities.map((activity, actIndex) => (
                      <span
                        key={actIndex}
                        className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground"
                      >
                        {activity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }
      `}</style>
    </div>
  )
}
