"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2, ExternalLink } from "lucide-react"

interface JiraCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultType?: "Epic" | "Story"
  defaultSummary?: string
  defaultDescription?: string
  onSuccess?: (issueKey: string, issueUrl: string) => void
}

interface Epic {
  key: string
  summary: string
  status: string
}

export function JiraCreateDialog({
  open,
  onOpenChange,
  defaultType = "Epic",
  defaultSummary = "",
  defaultDescription = "",
  onSuccess,
}: JiraCreateDialogProps) {
  const { toast } = useToast()
  const [creating, setCreating] = useState(false)
  const [issueType, setIssueType] = useState<"Epic" | "Story">(defaultType)
  const [summary, setSummary] = useState(defaultSummary)
  const [description, setDescription] = useState(defaultDescription)
  const [parentKey, setParentKey] = useState("")
  const [createdIssue, setCreatedIssue] = useState<{ key: string; url: string } | null>(null)

  const [availableEpics, setAvailableEpics] = useState<Epic[]>([])
  const [loadingEpics, setLoadingEpics] = useState(false)

  useEffect(() => {
    if (open && issueType === "Story") {
      fetchAvailableEpics()
    }
  }, [open, issueType])

  const fetchAvailableEpics = async () => {
    setLoadingEpics(true)
    try {
      const response = await fetch("/api/jira/epics")
      const data = await response.json()

      if (response.ok && data.epics) {
        setAvailableEpics(data.epics)
      } else {
        console.error("[v0] Failed to fetch epics:", data.error)
      }
    } catch (error) {
      console.error("[v0] Error fetching epics:", error)
    } finally {
      setLoadingEpics(false)
    }
  }

  const handleCreate = async () => {
    if (!summary.trim()) {
      toast({
        title: "Validation Error",
        description: "Summary is required",
        variant: "destructive",
      })
      return
    }

    if (issueType === "Story" && parentKey && !availableEpics.find((e) => e.key === parentKey)) {
      toast({
        title: "Validation Error",
        description: "Please select a valid parent epic",
        variant: "destructive",
      })
      return
    }

    setCreating(true)
    try {
      const response = await fetch("/api/jira/create-issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          issueType,
          summary,
          description,
          parentKey: issueType === "Story" && parentKey ? parentKey : undefined,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setCreatedIssue({ key: data.issue.key, url: data.issue.url })
        toast({
          title: "Success",
          description: `${issueType} ${data.issue.key} created successfully`,
        })
        onSuccess?.(data.issue.key, data.issue.url)
      } else {
        toast({
          title: "Creation Failed",
          description: data.error || `Failed to create ${issueType.toLowerCase()}`,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to create ${issueType.toLowerCase()}`,
        variant: "destructive",
      })
    } finally {
      setCreating(false)
    }
  }

  const handleClose = () => {
    setSummary(defaultSummary)
    setDescription(defaultDescription)
    setParentKey("")
    setCreatedIssue(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Jira {issueType}</DialogTitle>
          <DialogDescription>
            {createdIssue
              ? `${issueType} created successfully. You can view it in Jira or create another.`
              : `Create a new ${issueType.toLowerCase()} in your Jira project`}
          </DialogDescription>
        </DialogHeader>

        {createdIssue ? (
          <div className="space-y-4 py-4">
            <div className="rounded-lg border border-success/50 bg-success/10 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-success">
                    {issueType} Created: {createdIssue.key}
                  </p>
                  <p className="text-sm text-muted-foreground">Successfully created in Jira</p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href={createdIssue.url} target="_blank" rel="noopener noreferrer">
                    View in Jira
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="issue-type">Issue Type</Label>
              <Select value={issueType} onValueChange={(value) => setIssueType(value as "Epic" | "Story")}>
                <SelectTrigger id="issue-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Epic">Epic</SelectItem>
                  <SelectItem value="Story">Story</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {issueType === "Story" && (
              <div className="space-y-2">
                <Label htmlFor="parent-key">Parent Epic (Optional)</Label>
                <Select value={parentKey} onValueChange={setParentKey} disabled={loadingEpics}>
                  <SelectTrigger id="parent-key">
                    <SelectValue placeholder={loadingEpics ? "Loading epics..." : "Select an epic"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No parent epic</SelectItem>
                    {availableEpics.map((epic) => (
                      <SelectItem key={epic.key} value={epic.key}>
                        {epic.key} - {epic.summary}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {availableEpics.length === 0 && !loadingEpics
                    ? "No epics found in this project. Create an epic first."
                    : "Link this story to an existing epic"}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="summary">Summary *</Label>
              <Input
                id="summary"
                placeholder={`Enter ${issueType.toLowerCase()} summary`}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
              {issueType === "Epic" && (
                <p className="text-xs text-muted-foreground">This will be used as the epic name</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder={`Enter ${issueType.toLowerCase()} description`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
              />
            </div>
          </div>
        )}

        <DialogFooter>
          {createdIssue ? (
            <>
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
              <Button
                onClick={() => {
                  setCreatedIssue(null)
                  setSummary("")
                  setDescription("")
                  setParentKey("")
                }}
              >
                Create Another
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleClose} disabled={creating}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={creating}>
                {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create {issueType}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
