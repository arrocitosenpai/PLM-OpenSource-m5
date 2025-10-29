"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { RolePageLayout } from "@/components/role-page-layout"
import { getOpportunityById, mockOpportunities, getFeedbackForTeam, type TeamType, getTeamLabel } from "@/lib/mock-data"
import { AlertTriangle } from "lucide-react"
import { useAuth, getRoleStageFilter } from "@/lib/auth-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CommentsSection } from "@/components/comments-section"
import { ScrollArea } from "@/components/ui/scroll-area"

function EngineeringPageContent() {
  const searchParams = useSearchParams()
  const id = searchParams.get("id")
  const { user } = useAuth()
  const roleStageFilter = getRoleStageFilter(user?.role || null)

  const opportunity = id
    ? getOpportunityById(id)
    : mockOpportunities.find((o) =>
        roleStageFilter ? o.currentStage === roleStageFilter : o.currentStage === "engineering",
      )

  const [hasSimilarProjects, setHasSimilarProjects] = useState(true)
  const [hasReusableComponents, setHasReusableComponents] = useState(true)
  const [hasGxpData, setHasGxpData] = useState(false)

  if (!opportunity) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">No opportunity found</p>
      </div>
    )
  }

  const similarProjects = [
    { id: "PRJ-001", name: "Warehouse Management System", similarity: "85%" },
    { id: "PRJ-015", name: "Supply Chain Dashboard", similarity: "72%" },
  ]

  const reusableComponents = [
    { name: "Data Grid Component", type: "UI", status: "Available" },
    { name: "Authentication Module", type: "Backend", status: "Available" },
    { name: "Report Generator", type: "Service", status: "In Use" },
  ]

  const techRisks = [
    { risk: "Legacy system integration", severity: "High", mitigation: "API wrapper layer planned" },
    { risk: "Data migration complexity", severity: "Medium", mitigation: "Phased rollout approach" },
    { risk: "Third-party API dependency", severity: "Low", mitigation: "Fallback mechanism in place" },
  ]

  const feedbackList = getFeedbackForTeam("engineering" as TeamType, opportunity.id)

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
    <RolePageLayout opportunity={opportunity} stage="engineering">
      <Tabs defaultValue="details" className="space-y-6">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="feedback">Feedback Log</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <Card className="transition-all hover:shadow-md">
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

          <Card className="transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle>Assigned Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {opportunity.assignedUsers.map((user) => (
                  <Badge key={user} variant="secondary" className="px-3 py-1">
                    {user}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle>Technical Assessment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="similar"
                  checked={hasSimilarProjects}
                  onCheckedChange={(c) => setHasSimilarProjects(!!c)}
                />
                <label htmlFor="similar" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                  Similar Projects Exist
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="reusable"
                  checked={hasReusableComponents}
                  onCheckedChange={(c) => setHasReusableComponents(!!c)}
                />
                <label htmlFor="reusable" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                  Reusable Components Available
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="gxp" checked={hasGxpData} onCheckedChange={(c) => setHasGxpData(!!c)} />
                <label htmlFor="gxp" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                  GxP / Sensitive Data Involved
                </label>
              </div>
            </CardContent>
          </Card>

          {hasSimilarProjects && (
            <Card className="transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle>Similar Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Similarity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {similarProjects.map((project) => (
                      <TableRow key={project.id} className="transition-colors hover:bg-muted/50">
                        <TableCell className="font-mono text-sm">{project.id}</TableCell>
                        <TableCell>{project.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{project.similarity}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {hasReusableComponents && (
            <Card className="transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle>Reusable Components</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Component</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reusableComponents.map((component) => (
                      <TableRow key={component.name} className="transition-colors hover:bg-muted/50">
                        <TableCell className="font-medium">{component.name}</TableCell>
                        <TableCell>{component.type}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-success/50 bg-success/10 text-success">
                            {component.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          <Card className="transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Technical Risks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Risk</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Mitigation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {techRisks.map((risk, index) => (
                    <TableRow key={index} className="transition-colors hover:bg-muted/50">
                      <TableCell className="font-medium">{risk.risk}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            risk.severity === "High"
                              ? "border-destructive/50 bg-destructive/10 text-destructive"
                              : risk.severity === "Medium"
                                ? "border-warning/50 bg-warning/10 text-warning"
                                : "border-success/50 bg-success/10 text-success"
                          }
                        >
                          {risk.severity}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{risk.mitigation}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments">
          <CommentsSection opportunityId={opportunity.id} />
        </TabsContent>

        <TabsContent value="feedback">
          <Card>
            <CardHeader>
              <CardTitle>Feedback for {getTeamLabel("engineering")} Team</CardTitle>
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

export default function EngineeringPage() {
  return (
    <Suspense fallback={<EngineeringPageSkeleton />}>
      <EngineeringPageContent />
    </Suspense>
  )
}

function EngineeringPageSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  )
}
