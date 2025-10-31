"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RolePageLayout } from "@/components/role-page-layout"
import { AlertTriangle, CheckCircle2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CommentsSection } from "@/components/comments-section"
import { AssignedUsersCard } from "@/components/assigned-users-card"

export function PlatformPageClient({ opportunity }: { opportunity: any }) {
  const [currentTab, setCurrentTab] = useState("details")

  const dependencies = [
    { name: "Cloud Infrastructure", status: "Ready", type: "success" },
    { name: "Database Migration", status: "In Progress", type: "warning" },
    { name: "API Gateway Setup", status: "Pending", type: "muted" },
  ]

  const risks = [
    { title: "Scalability Concerns", description: "Current architecture may not handle 10x load increase" },
    { title: "Security Compliance", description: "Additional security audit required for sensitive data" },
  ]

  return (
    <RolePageLayout opportunity={opportunity} stage="platform" currentTab={currentTab}>
      <Tabs defaultValue="details" value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="mb-2 text-sm font-medium text-muted-foreground">Problem Statement</h3>
                <p className="text-sm leading-relaxed">
                  {opportunity.problemStatement || opportunity.problem_statement}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="mb-2 text-sm font-medium text-muted-foreground">Business Sponsor</h3>
                  <p className="text-sm font-medium">{opportunity.businessSponsor || opportunity.business_sponsor}</p>
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-medium text-muted-foreground">Business Team</h3>
                  <p className="text-sm font-medium">{opportunity.businessTeam || opportunity.business_team}</p>
                </div>
              </div>
              <div>
                <h3 className="mb-2 text-sm font-medium text-muted-foreground">Business Value</h3>
                <p className="text-sm leading-relaxed">{opportunity.businessValue || opportunity.business_value}</p>
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
      </Tabs>
    </RolePageLayout>
  )
}
