"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, ExternalLink } from "lucide-react"
import { RolePageLayout } from "@/components/role-page-layout"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CommentsSection } from "@/components/comments-section"
import { JiraCreateDialog } from "@/components/jira-create-dialog"
import { AssignedUsersCard } from "@/components/assigned-users-card"

export function ProductPageClient({ opportunity }: { opportunity: any }) {
  const { toast } = useToast()
  const [isJiraCreateOpen, setIsJiraCreateOpen] = useState(false)
  const [currentTab, setCurrentTab] = useState("details")

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
  }

  return (
    <RolePageLayout opportunity={opportunity} stage="product" currentTab={currentTab}>
      <Tabs defaultValue="details" value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
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
                  {opportunity.jira_epic_id && opportunity.jira_epic_url ? (
                    <a
                      href={opportunity.jira_epic_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                    >
                      {opportunity.jira_epic_id}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <p className="text-sm text-muted-foreground">Not linked</p>
                  )}
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-medium text-muted-foreground">Jira Story (Requirements)</h3>
                  {opportunity.jira_story_id && opportunity.jira_story_url ? (
                    <a
                      href={opportunity.jira_story_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                    >
                      {opportunity.jira_story_id}
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
                <p className="text-sm leading-relaxed">{opportunity.business_value}</p>
              </div>
              <div>
                <h3 className="mb-2 text-sm font-medium text-muted-foreground">Quality Value</h3>
                <p className="text-sm leading-relaxed">{opportunity.quality_value}</p>
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
                    className="bg-transparent transition-all hover:scale-105"
                  >
                    Select Files
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments">
          <CommentsSection opportunityId={opportunity.id} />
        </TabsContent>
      </Tabs>

      <JiraCreateDialog
        open={isJiraCreateOpen}
        onOpenChange={setIsJiraCreateOpen}
        defaultSummary={opportunity.name}
        defaultDescription={opportunity.problem_statement}
        onSuccess={handleJiraCreateSuccess}
      />
    </RolePageLayout>
  )
}
