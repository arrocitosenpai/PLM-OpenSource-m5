"use client"

import { Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Upload, ExternalLink } from "lucide-react"
import { RolePageLayout } from "@/components/role-page-layout"
import { getOpportunityById, mockOpportunities, getFeedbackForTeam, type TeamType } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"
import { useAuth, getRoleStageFilter } from "@/lib/auth-context"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CommentsSection } from "@/components/comments-section"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getTeamLabel } from "@/lib/mock-data"
import { JiraCreateDialog } from "@/components/jira-create-dialog"
import { AssignedUsersCard } from "@/components/assigned-users-card"

function ProductPageContent() {
  const searchParams = useSearchParams()
  const id = searchParams.get("id")
  const { user } = useAuth()
  const roleStageFilter = getRoleStageFilter(user?.role || null)

  const opportunity = id
    ? getOpportunityById(id)
    : mockOpportunities.find((o) =>
        roleStageFilter ? o.currentStage === roleStageFilter : o.currentStage === "product",
      )
  const { toast } = useToast()

  const [isJiraCreateOpen, setIsJiraCreateOpen] = useState(false)

  if (!opportunity) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">No opportunity found</p>
      </div>
    )
  }

  const feedbackList = getFeedbackForTeam("product" as TeamType, opportunity.id)

  const handleUpload = () => {
    toast({
      title: "Upload Initiated",
      description: "File upload functionality (mock)",
    })
  }

  const handleJiraCreateSuccess = (issueKey: string, issueUrl: string) => {
    toast({
      title: "Jira Issue Created",
      description: `Successfully created ${issueKey}`,
    })
    // Optionally update the opportunity with the new Jira links
  }

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
    <RolePageLayout opportunity={opportunity} stage="product">
      <Tabs defaultValue="details" className="space-y-6">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="feedback">Feedback Log</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <Card className="transition-all hover:shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Summary & Business Priority</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
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
              <div className="border-t pt-4">
                <h3 className="mb-4 text-sm font-semibold">Priority Information</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-muted-foreground">Priority Level</h4>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-32 rounded-full bg-secondary">
                        <div className="h-2 w-24 rounded-full bg-primary transition-all duration-500" />
                      </div>
                      <span className="text-sm font-medium capitalize">{opportunity.priority}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-muted-foreground">Expected ROI</h4>
                    <p className="text-2xl font-semibold text-primary">$250K</p>
                    <p className="text-sm text-muted-foreground">Annual savings</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <AssignedUsersCard opportunityId={opportunity.id} />

          <Card className="transition-all hover:shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Jira Integration</CardTitle>
                <Button variant="outline" size="sm" onClick={() => setIsJiraCreateOpen(true)}>
                  Create Epic/Story
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="mb-2 text-sm font-medium text-muted-foreground">Jira Epic (Project Name)</h3>
                  {opportunity.jiraEpicId && opportunity.jiraEpicUrl ? (
                    <a
                      href={opportunity.jiraEpicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                    >
                      {opportunity.jiraEpicId}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <p className="text-sm text-muted-foreground">Not linked</p>
                  )}
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-medium text-muted-foreground">Jira Story (Requirements)</h3>
                  {opportunity.jiraStoryId && opportunity.jiraStoryUrl ? (
                    <a
                      href={opportunity.jiraStoryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                    >
                      {opportunity.jiraStoryId}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <p className="text-sm text-muted-foreground">Not linked</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle>Business & Quality Value</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="mb-2 text-sm font-medium text-muted-foreground">Business Value</h3>
                <p className="text-sm leading-relaxed">{opportunity.businessValue}</p>
              </div>
              <div>
                <h3 className="mb-2 text-sm font-medium text-muted-foreground">Quality Value</h3>
                <p className="text-sm leading-relaxed">{opportunity.qualityValue}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle>Documentation & Media</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border-2 border-dashed border-border bg-muted/20 p-8 text-center transition-colors hover:border-primary/50 hover:bg-muted/30">
                  <Upload className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="mb-1 text-sm font-medium">Upload documents or videos</p>
                  <p className="mb-4 text-xs text-muted-foreground">Drag and drop or click to browse</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleUpload}
                    className="transition-all hover:scale-105 bg-transparent"
                  >
                    Select Files
                  </Button>
                </div>
                <div className="space-y-2">
                  {opportunity.attachments?.map((attachment, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border border-border bg-card p-3 transition-all hover:border-primary/50 hover:shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10 text-xs font-medium text-primary">
                          {attachment.type}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{attachment.name}</p>
                          <p className="text-xs text-muted-foreground">{attachment.size}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={() => {}}>Submit/Approve</Button>
          </div>
        </TabsContent>

        <TabsContent value="comments">
          <CommentsSection opportunityId={opportunity.id} />
        </TabsContent>

        <TabsContent value="feedback">
          <Card>
            <CardHeader>
              <CardTitle>Feedback for {getTeamLabel("product")} Team</CardTitle>
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

      <JiraCreateDialog
        open={isJiraCreateOpen}
        onOpenChange={setIsJiraCreateOpen}
        defaultSummary={opportunity.title}
        defaultDescription={opportunity.problemStatement}
        onSuccess={handleJiraCreateSuccess}
      />
    </RolePageLayout>
  )
}

export default function ProductPage() {
  return (
    <Suspense fallback={<ProductPageSkeleton />}>
      <ProductPageContent />
    </Suspense>
  )
}

function ProductPageSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  )
}
