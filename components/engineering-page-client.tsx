"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { RolePageLayout } from "@/components/role-page-layout"
import { AlertTriangle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CommentsSection } from "@/components/comments-section"
import { AssignedUsersCard } from "@/components/assigned-users-card"

export function EngineeringPageClient({ opportunity }: { opportunity: any }) {
  const [hasSimilarProjects, setHasSimilarProjects] = useState(true)
  const [hasReusableComponents, setHasReusableComponents] = useState(true)
  const [hasGxpData, setHasGxpData] = useState(false)
  const [currentTab, setCurrentTab] = useState("details")

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

  return (
    <RolePageLayout opportunity={opportunity} stage="engineering" currentTab={currentTab}>
      <Tabs defaultValue="details" value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <Card className="transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="mb-2 text-sm font-medium text-muted-foreground">Problem Statement</h3>
                <p className="text-sm leading-relaxed">{opportunity.problem_statement}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="mb-2 text-sm font-medium text-muted-foreground">Business Sponsor</h3>
                  <p className="text-sm font-medium">{opportunity.business_sponsor}</p>
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-medium text-muted-foreground">Business Team</h3>
                  <p className="text-sm font-medium">{opportunity.business_team}</p>
                </div>
              </div>
              <div>
                <h3 className="mb-2 text-sm font-medium text-muted-foreground">Business Value</h3>
                <p className="text-sm leading-relaxed">{opportunity.business_value}</p>
              </div>
            </CardContent>
          </Card>

          <AssignedUsersCard opportunityId={opportunity.id} />

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
      </Tabs>
    </RolePageLayout>
  )
}
