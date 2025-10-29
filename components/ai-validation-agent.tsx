"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, AlertCircle, Loader2, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Opportunity } from "@/lib/mock-data"

interface ValidationItem {
  id: string
  label: string
  status: "pass" | "fail" | "warning" | "checking"
  message?: string
}

interface AIValidationAgentProps {
  opportunity: Opportunity
  open: boolean
  onOpenChange: (open: boolean) => void
  onApprove: () => void
}

export function AIValidationAgent({ opportunity, open, onOpenChange, onApprove }: AIValidationAgentProps) {
  const [isValidating, setIsValidating] = useState(false)
  const [validationResults, setValidationResults] = useState<ValidationItem[]>([])

  useEffect(() => {
    if (open && validationResults.length === 0) {
      runValidation()
    }
  }, [open])

  const runValidation = async () => {
    setIsValidating(true)
    setValidationResults([
      { id: "pdd", label: "Product Design Document (PDD)", status: "checking" },
      { id: "jira-epic", label: "Jira Epic Data", status: "checking" },
      { id: "jira-story", label: "Jira Story Requirements", status: "checking" },
      { id: "business-value", label: "Business Value Defined", status: "checking" },
      { id: "attachments", label: "Supporting Attachments", status: "checking" },
      { id: "timeline", label: "Timeline & Estimates", status: "checking" },
      { id: "stakeholders", label: "Stakeholder Information", status: "checking" },
    ])

    // Simulate AI validation with delays
    await new Promise((resolve) => setTimeout(resolve, 800))

    const results: ValidationItem[] = []

    // Check for PDD in attachments
    const hasPDD = opportunity.attachments?.some(
      (att) => att.name.toLowerCase().includes("product design document") || att.name.toLowerCase().includes("pdd"),
    )
    results.push({
      id: "pdd",
      label: "Product Design Document (PDD)",
      status: hasPDD ? "pass" : "fail",
      message: hasPDD
        ? "PDD found in attachments"
        : "No PDD document found. Please attach the Product Design Document.",
    })

    await new Promise((resolve) => setTimeout(resolve, 600))

    // Check Jira Epic
    const hasJiraEpic = !!(opportunity.jiraEpicId && opportunity.jiraEpicUrl)
    results.push({
      id: "jira-epic",
      label: "Jira Epic Data",
      status: hasJiraEpic ? "pass" : "fail",
      message: hasJiraEpic ? "Jira Epic linked successfully" : "Jira Epic ID or URL is missing.",
    })

    await new Promise((resolve) => setTimeout(resolve, 600))

    // Check Jira Story
    const hasJiraStory = !!(opportunity.jiraStoryId && opportunity.jiraStoryUrl)
    results.push({
      id: "jira-story",
      label: "Jira Story Requirements",
      status: hasJiraStory ? "pass" : "fail",
      message: hasJiraStory ? "Jira Story linked with requirements" : "Jira Story ID or URL is missing.",
    })

    await new Promise((resolve) => setTimeout(resolve, 600))

    // Check Business Value
    const hasBusinessValue = opportunity.businessValue && opportunity.businessValue.length > 20
    results.push({
      id: "business-value",
      label: "Business Value Defined",
      status: hasBusinessValue ? "pass" : "warning",
      message: hasBusinessValue
        ? "Business value clearly defined"
        : "Business value description is too brief. Consider adding more details.",
    })

    await new Promise((resolve) => setTimeout(resolve, 600))

    // Check Attachments
    const hasAttachments = (opportunity.attachments?.length || 0) >= 2
    results.push({
      id: "attachments",
      label: "Supporting Attachments",
      status: hasAttachments ? "pass" : "warning",
      message: hasAttachments
        ? `${opportunity.attachments?.length} attachments found`
        : "Consider adding more supporting documentation.",
    })

    await new Promise((resolve) => setTimeout(resolve, 600))

    // Check Timeline (mock - would check actual timeline data)
    results.push({
      id: "timeline",
      label: "Timeline & Estimates",
      status: "pass",
      message: "Timeline information is present",
    })

    await new Promise((resolve) => setTimeout(resolve, 600))

    // Check Stakeholders
    const hasStakeholders = opportunity.businessSponsor && opportunity.businessTeam
    results.push({
      id: "stakeholders",
      label: "Stakeholder Information",
      status: hasStakeholders ? "pass" : "fail",
      message: hasStakeholders ? "Business sponsor and team identified" : "Missing stakeholder information.",
    })

    setValidationResults(results)
    setIsValidating(false)
  }

  const handleApprove = () => {
    onApprove()
    onOpenChange(false)
    setValidationResults([]) // Reset for next time
  }

  const handleFixIssues = () => {
    onOpenChange(false)
    setValidationResults([]) // Reset for next time
  }

  const handleCancel = () => {
    onOpenChange(false)
    setValidationResults([]) // Reset for next time
  }

  const getStatusIcon = (status: ValidationItem["status"]) => {
    switch (status) {
      case "pass":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "fail":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-amber-500" />
      case "checking":
        return <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
    }
  }

  const passCount = validationResults.filter((item) => item.status === "pass").length
  const failCount = validationResults.filter((item) => item.status === "fail").length
  const warningCount = validationResults.filter((item) => item.status === "warning").length
  const hasIssues = failCount > 0 || warningCount > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Validation Check
          </DialogTitle>
          <DialogDescription>
            Analyzing opportunity data, attachments, and Jira integration for completeness
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {validationResults.length > 0 && !isValidating && (
            <div className="flex gap-2">
              <Badge variant="outline" className="gap-1">
                <CheckCircle2 className="h-3 w-3 text-green-500" />
                {passCount} Passed
              </Badge>
              {warningCount > 0 && (
                <Badge variant="outline" className="gap-1">
                  <AlertCircle className="h-3 w-3 text-amber-500" />
                  {warningCount} Warnings
                </Badge>
              )}
              {failCount > 0 && (
                <Badge variant="outline" className="gap-1">
                  <XCircle className="h-3 w-3 text-red-500" />
                  {failCount} Failed
                </Badge>
              )}
            </div>
          )}

          {hasIssues && !isValidating && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {failCount > 0
                  ? "Critical issues detected. Approving without fixing these issues may cause delays in the project lifecycle."
                  : "Some warnings detected. Consider addressing these before approval to ensure smooth project progression."}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
            {validationResults.map((item) => (
              <Card key={item.id} className={item.status === "fail" ? "border-red-200 dark:border-red-900" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{getStatusIcon(item.status)}</div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm">{item.label}</p>
                        {item.status !== "checking" && (
                          <Badge
                            variant={
                              item.status === "pass"
                                ? "default"
                                : item.status === "warning"
                                  ? "secondary"
                                  : "destructive"
                            }
                            className="text-xs"
                          >
                            {item.status === "pass" ? "Pass" : item.status === "warning" ? "Warning" : "Failed"}
                          </Badge>
                        )}
                      </div>
                      {item.message && item.status !== "checking" && (
                        <p className="text-sm text-muted-foreground">{item.message}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleCancel} disabled={isValidating}>
            Cancel
          </Button>
          <Button variant="secondary" onClick={handleFixIssues} disabled={isValidating}>
            Fix Issues First
          </Button>
          <Button
            onClick={handleApprove}
            disabled={isValidating}
            variant={hasIssues ? "destructive" : "default"}
            className={hasIssues ? "bg-amber-600 hover:bg-amber-700" : ""}
          >
            {isValidating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Validating...
              </>
            ) : hasIssues ? (
              "Approve Anyway"
            ) : (
              "Approve"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
