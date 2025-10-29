"use client"

import { Suspense, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RolePageLayout } from "@/components/role-page-layout"
import { getOpportunityById, mockOpportunities } from "@/lib/mock-data"
import { useAuth, getRoleStageFilter } from "@/lib/auth-context"
import { getJiraConfig } from "@/lib/jira-config"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ImplementationTimeline } from "@/components/implementation-timeline"
import { ImplementationPhasesTimeline } from "@/components/implementation-phases-timeline"
import { ImplementationGanttChart } from "@/components/implementation-gantt-chart"

interface JiraIssue {
  id: string
  key: string
  summary: string
  status: string
  statusCategory: string
  assignee: {
    name: string
    email: string
  } | null
  progress: number
  issueType: string
  created: string
  updated: string
  dueDate?: string
  resolutionDate?: string
}

interface SprintData {
  id: number
  name: string
  state: string
  startDate: string
  endDate: string
  daysRemaining: number
}

function ImplementationPageContent() {
  const searchParams = useSearchParams()
  const id = searchParams.get("id")
  const { user } = useAuth()
  const roleStageFilter = getRoleStageFilter(user?.role || null)

  const opportunity = id
    ? getOpportunityById(id)
    : mockOpportunities.find((o) =>
        roleStageFilter ? o.currentStage === roleStageFilter : o.currentStage === "implementation",
      )

  const [jiraConnected, setJiraConnected] = useState(false)
  const [loadingJiraData, setLoadingJiraData] = useState(false)
  const [jiraIssues, setJiraIssues] = useState<JiraIssue[]>([])
  const [sprintData, setSprintData] = useState<SprintData | null>(null)
  const [jiraError, setJiraError] = useState<string | null>(null)

  useEffect(() => {
    const jiraConfig = getJiraConfig()
    if (jiraConfig) {
      setJiraConnected(true)
      fetchJiraData(jiraConfig)
    }
  }, [])

  const fetchJiraData = async (config: any) => {
    setLoadingJiraData(true)
    setJiraError(null)

    try {
      // Fetch issues
      const issuesResponse = await fetch("/api/jira/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      })

      if (!issuesResponse.ok) {
        throw new Error("Failed to fetch Jira issues")
      }

      const issuesData = await issuesResponse.json()
      setJiraIssues(issuesData.issues || [])

      // Fetch sprint data
      const sprintResponse = await fetch("/api/jira/sprint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      })

      if (sprintResponse.ok) {
        const sprintData = await sprintResponse.json()
        setSprintData(sprintData.sprint)
      }
    } catch (error) {
      console.error("[v0] Error fetching Jira data:", error)
      setJiraError("Failed to fetch data from Jira. Please check your integration settings.")
    } finally {
      setLoadingJiraData(false)
    }
  }

  if (!opportunity) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">No opportunity found</p>
      </div>
    )
  }

  const contributors = [
    { role: "Developer", name: "Sarah Chen", task: "Backend API Development", status: "in-progress", progress: 65 },
    {
      role: "Developer",
      name: "Mike Johnson",
      task: "Frontend UI Implementation",
      status: "in-progress",
      progress: 80,
    },
    {
      role: "Business Analyst",
      name: "Lisa Wang",
      task: "Requirements Documentation",
      status: "completed",
      progress: 100,
    },
    { role: "QA", name: "Tom Harris", task: "Test Case Creation", status: "in-progress", progress: 45 },
    { role: "QA", name: "Elena Rodriguez", task: "Integration Testing", status: "not-started", progress: 0 },
  ]

  const jiraContributors = jiraIssues.map((issue) => {
    let status = "not-started"
    if (issue.statusCategory === "done") status = "completed"
    else if (issue.statusCategory === "indeterminate") status = "in-progress"

    return {
      role: issue.issueType,
      name: issue.assignee?.name || "Unassigned",
      task: issue.summary,
      status,
      progress: issue.progress,
      jiraKey: issue.key,
    }
  })

  const displayContributors = jiraConnected && jiraIssues.length > 0 ? jiraContributors : contributors

  const calculateSprintMetrics = () => {
    if (jiraConnected && jiraIssues.length > 0) {
      const completed = jiraIssues.filter((i) => i.statusCategory === "done").length
      const total = jiraIssues.length
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

      return {
        sprint: sprintData?.name || "Current Sprint",
        daysRemaining: sprintData?.daysRemaining || 0,
        completed,
        total,
        percentage,
        velocity: Math.round(completed * 1.5), // Simple velocity calculation
      }
    }

    return {
      sprint: "Sprint 3",
      daysRemaining: 5,
      completed: 12,
      total: 18,
      percentage: 67,
      velocity: 24,
    }
  }

  const sprintMetrics = calculateSprintMetrics()

  const getKanbanColumns = () => {
    if (jiraConnected && jiraIssues.length > 0) {
      const columns = {
        "To Do": jiraIssues.filter((i) => i.statusCategory === "new"),
        "In Progress": jiraIssues.filter((i) => i.statusCategory === "indeterminate"),
        Review: jiraIssues.filter((i) => i.status.toLowerCase().includes("review")),
        Done: jiraIssues.filter((i) => i.statusCategory === "done"),
      }
      return columns
    }

    return {
      "To Do": [
        { key: "MOCK-1", summary: "API Documentation" },
        { key: "MOCK-2", summary: "Performance Testing" },
      ],
      "In Progress": [
        { key: "MOCK-3", summary: "Backend Development" },
        { key: "MOCK-4", summary: "UI Implementation" },
      ],
      Review: [{ key: "MOCK-5", summary: "Code Review PR #123" }],
      Done: [
        { key: "MOCK-6", summary: "Requirements Doc" },
        { key: "MOCK-7", summary: "Database Schema" },
        { key: "MOCK-8", summary: "Auth Module" },
      ],
    }
  }

  const kanbanColumns = getKanbanColumns()

  const getStatusBadge = (status: string) => {
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
      default:
        return (
          <Badge variant="outline" className="border-muted-foreground/50 bg-muted text-muted-foreground">
            Not Started
          </Badge>
        )
    }
  }

  return (
    <RolePageLayout opportunity={opportunity} stage="implementation">
      {!jiraConnected && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Using Mock Data</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>Connect to Jira Cloud to see real implementation data from your project.</span>
            <Button asChild variant="outline" size="sm">
              <Link href="/integration">Configure Integration</Link>
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {jiraConnected && jiraError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Jira Data</AlertTitle>
          <AlertDescription>{jiraError}</AlertDescription>
        </Alert>
      )}

      {jiraConnected && loadingJiraData && (
        <Alert>
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertTitle>Loading Jira Data</AlertTitle>
          <AlertDescription>Fetching implementation data from your Jira project...</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="details" className="space-y-6">
        <TabsList>
          <TabsTrigger value="details">Main Details</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <Card className="transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="mb-2 text-sm font-medium text-muted-foreground">Problem Statement</h4>
                <p className="text-sm leading-relaxed">{opportunity.problemStatement}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="mb-2 text-sm font-medium text-muted-foreground">Business Sponsor</h4>
                  <div className="text-sm font-medium">{opportunity.businessSponsor}</div>
                </div>
                <div>
                  <h4 className="mb-2 text-sm font-medium text-muted-foreground">Business Team</h4>
                  <div className="text-sm font-medium">{opportunity.businessTeam}</div>
                </div>
              </div>
              <div>
                <h4 className="mb-2 text-sm font-medium text-muted-foreground">Business Value</h4>
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
                {opportunity.assignedUsers && opportunity.assignedUsers.length > 0 ? (
                  opportunity.assignedUsers.map((user, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1">
                      {user}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No users assigned yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="transition-all hover:shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Implementation Team</CardTitle>
                {jiraConnected && (
                  <Badge variant="outline" className="border-primary/50 bg-primary/10 text-primary">
                    Synced with Jira
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>Contributor</TableHead>
                    <TableHead>Task / Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayContributors.map((contributor, index) => (
                    <TableRow key={index} className="transition-colors hover:bg-muted/50">
                      <TableCell>
                        <Badge variant="secondary">{contributor.role}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{contributor.name}</TableCell>
                      <TableCell>
                        {(contributor as any).jiraKey && (
                          <span className="mr-2 font-mono text-xs text-muted-foreground">
                            [{(contributor as any).jiraKey}]
                          </span>
                        )}
                        {contributor.task}
                      </TableCell>
                      <TableCell>{getStatusBadge(contributor.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-24 rounded-full bg-secondary">
                            <div
                              className="h-2 rounded-full bg-primary transition-all duration-500"
                              style={{ width: `${contributor.progress}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">{contributor.progress}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle>Sprint Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-lg border border-border bg-muted/20 p-4 transition-all hover:border-primary/50 hover:shadow-sm">
                  <p className="mb-1 text-sm text-muted-foreground">Current Sprint</p>
                  <p className="text-2xl font-semibold">{sprintMetrics.sprint}</p>
                  <p className="text-xs text-muted-foreground">{sprintMetrics.daysRemaining} days remaining</p>
                </div>
                <div className="rounded-lg border border-border bg-muted/20 p-4 transition-all hover:border-primary/50 hover:shadow-sm">
                  <p className="mb-1 text-sm text-muted-foreground">Tasks Completed</p>
                  <p className="text-2xl font-semibold">
                    {sprintMetrics.completed} / {sprintMetrics.total}
                  </p>
                  <p className="text-xs text-muted-foreground">{sprintMetrics.percentage}% complete</p>
                </div>
                <div className="rounded-lg border border-border bg-muted/20 p-4 transition-all hover:border-primary/50 hover:shadow-sm">
                  <p className="mb-1 text-sm text-muted-foreground">Velocity</p>
                  <p className="text-2xl font-semibold">{sprintMetrics.velocity} pts</p>
                  <p className="text-xs text-muted-foreground">
                    {sprintMetrics.velocity > 20 ? "Above average" : "On track"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle>Kanban Board</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                {Object.entries(kanbanColumns).map(([column, issues]) => (
                  <div key={column} className="rounded-lg border border-border bg-muted/20 p-3">
                    <h4 className="mb-3 text-sm font-medium">
                      {column} ({issues.length})
                    </h4>
                    <div className="space-y-2">
                      {issues.map((issue: any) => (
                        <div
                          key={issue.key || issue.id}
                          className="rounded border border-border bg-card p-2 text-xs transition-all hover:border-primary/50 hover:shadow-sm"
                        >
                          {issue.key && (
                            <div className="mb-1 font-mono text-[10px] text-muted-foreground">{issue.key}</div>
                          )}
                          <div>{issue.summary}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <ImplementationPhasesTimeline />
          <ImplementationGanttChart />
          <ImplementationTimeline
            issues={jiraIssues}
            sprintStartDate={sprintData?.startDate}
            sprintEndDate={sprintData?.endDate}
          />
        </TabsContent>
      </Tabs>
    </RolePageLayout>
  )
}

export default function ImplementationPage() {
  return (
    <Suspense fallback={<ImplementationPageSkeleton />}>
      <ImplementationPageContent />
    </Suspense>
  )
}

function ImplementationPageSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  )
}
