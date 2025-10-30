"use client"

import { Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { RolePageLayout } from "@/components/role-page-layout"
import { getOpportunityById, mockOpportunities, getFeedbackForTeam, type TeamType, getTeamLabel } from "@/lib/mock-data"
import { AlertTriangle, CheckCircle2 } from "lucide-react"
import { useAuth, getRoleStageFilter } from "@/lib/auth-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CommentsSection } from "@/components/comments-section"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AssignedUsersCard } from "@/components/assigned-users-card"

function PlatformPageContent() {
  const searchParams = useSearchParams()
  const id = searchParams.get("id")
  const { user } = useAuth()
  const roleStageFilter = getRoleStageFilter(user?.role || null)

  const opportunity = id
    ? getOpportunityById(id)
    : mockOpportunities.find((o) =>
        roleStageFilter ? o.currentStage === roleStageFilter : o.currentStage === "platform",
      )

  const [currentTab, setCurrentTab] = useState("details")

  if (!opportunity) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">No opportunity found</p>
      </div>
    )
  }

  const feedbackList = getFeedbackForTeam("platform" as TeamType, opportunity.id)

  const dependencies = [
    { name: "Cloud Infrastructure", status: "Ready", type: "success" },
    { name: "Database Migration", status: "In Progress", type: "warning" },
    { name: "API Gateway Setup", status: "Pending", type: "muted" },
  ]

  const risks = [
    { title: "Scalability Concerns", description: "Current architecture may not handle 10x load increase" },
    { title: "Security Compliance", description: "Additional security audit required for sensitive data" },
  ]

  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    return "Just now"
  }

  return (
    <RolePageLayout opportunity={opportunity} stage="platform" currentTab={currentTab}>
      <Tabs defaultValue="details" value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="feedback">Feedback Log</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="mb-2 text-sm font-medium text-muted-foreground">Problem Statement</h3>
                <p className="text-sm leading-relaxed">{opportunity.problemStatement}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="mb-2 text-sm font-medium text-muted-foreground">Business Sponsor</h3>
                  <p className="text-sm font-medium">{opportunity.businessSponsor}</p>
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-medium text-muted-foreground">Business Team</h3>
                  <p className="text-sm font-medium">{opportunity.businessTeam}</p>
                </div>
              </div>
              <div>
                <h3 className="mb-2 text-sm font-medium text-muted-foreground">Business Value</h3>
                <p className="text-sm leading-relaxed">{opportunity.businessValue}</p>
              </div>
            </CardContent>
          </Card>

          <AssignedUsersCard opportunityId={opportunity.id} />

          <Card>
            <CardHeader>
              <CardTitle>Platform Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="mb-2 text-sm font-medium text-muted-foreground">Infrastructure Needs</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-success" />
                    <span>Kubernetes cluster with auto-scaling capabilities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-success" />
                    <span>PostgreSQL database with read replicas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-success" />
                    <span>Redis cache for session management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-success" />
                    <span>CDN for static asset delivery</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="mb-2 text-sm font-medium text-muted-foreground">Estimated Resources</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-lg border border-border bg-muted/20 p-3">
                    <p className="text-xs text-muted-foreground">Compute</p>
                    <p className="text-lg font-semibold">8 vCPUs</p>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/20 p-3">
                    <p className="text-xs text-muted-foreground">Memory</p>
                    <p className="text-lg font-semibold">32 GB</p>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/20 p-3">
                    <p className="text-xs text-muted-foreground">Storage</p>
                    <p className="text-lg font-semibold">500 GB</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dependencies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dependencies.map((dep) => (
                  <div key={dep.name} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <span className="font-medium">{dep.name}</span>
                    <Badge
                      variant="outline"
                      className={
                        dep.type === "success"
                          ? "border-success text-success"
                          : dep.type === "warning"
                            ? "border-warning text-warning"
                            : "border-muted-foreground text-muted-foreground"
                      }
                    >
                      {dep.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Platform Risks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {risks.map((risk, index) => (
                  <div key={index} className="rounded-lg border border-border bg-muted/20 p-4">
                    <h4 className="mb-1 font-medium">{risk.title}</h4>
                    <p className="text-sm text-muted-foreground">{risk.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments">
          <CommentsSection opportunityId={opportunity.id} />
        </TabsContent>

        <TabsContent value="feedback">
          <Card>
            <CardHeader>
              <CardTitle>Feedback for {getTeamLabel("platform")} Team</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-[600px] pr-4">
                <div className="space-y-4">
                  {feedbackList.length === 0 ? (
                    <div className="py-8 text-center text-sm text-muted-foreground">No feedback received yet</div>
                  ) : (
                    feedbackList.map((feedback) => (
                      <Card key={feedback.id} className={!feedback.read ? "border-primary" : ""}>
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="capitalize">
                                From {getTeamLabel(feedback.from)}
                              </Badge>
                              {!feedback.read && (
                                <Badge variant="default" className="text-xs">
                                  New
                                </Badge>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">{formatDate(feedback.createdAt)}</span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm leading-relaxed">{feedback.message}</p>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </RolePageLayout>
  )
}

export default function PlatformPage() {
  return (
    <Suspense fallback={<PlatformPageSkeleton />}>
      <PlatformPageContent />
    </Suspense>
  )
}

function PlatformPageSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  )
}
