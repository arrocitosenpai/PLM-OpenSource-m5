"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  type Opportunity,
  type OpportunityStatus,
  getStatusLabel,
  mockOpportunities,
  teamMembers,
  getFeedbackForTeam,
  getUnreadFeedbackCount,
  type TeamType,
  getTeamLabel,
  advanceOpportunityStage,
  getNextStage,
  getStageLabel,
} from "@/lib/mock-data"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { StatusBadge } from "@/components/status-badge"
import { MessageSquare, Bell } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth, getRoleStageFilter } from "@/lib/auth-context"

interface RolePageLayoutProps {
  opportunity: Opportunity
  stage: string
  children?: React.ReactNode
  onValidationTrigger?: () => void
}

export function RolePageLayout({ opportunity, stage, children, onValidationTrigger }: RolePageLayoutProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const roleStageFilter = getRoleStageFilter(user?.role || null)
  const [status, setStatus] = useState<OpportunityStatus>(opportunity.status)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [pendingStatus, setPendingStatus] = useState<OpportunityStatus | null>(null)
  const { toast } = useToast()

  const [assignedUsers, setAssignedUsers] = useState<string[]>(opportunity.assignedUsers)
  const [showAssignDialog, setShowAssignDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState("")
  const [openCombobox, setOpenCombobox] = useState(false)

  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState("")
  const [feedbackTarget, setFeedbackTarget] = useState("")

  const [showFeedbackListDialog, setShowFeedbackListDialog] = useState(false)
  const teamType = stage as TeamType
  const unreadCount = getUnreadFeedbackCount(teamType, opportunity.id)
  const feedbackList = getFeedbackForTeam(teamType, opportunity.id)

  const [showStageProgressDialog, setShowStageProgressDialog] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const nextStage = getNextStage(opportunity.currentStage)

  const feedbackTargets = ["product", "engineering", "platform"].filter((target) => target !== stage)

  const showFeedbackButton = ["product", "engineering", "platform"].includes(stage)
  const showFeedbackLog = ["product", "engineering", "platform"].includes(stage)

  const filteredOpportunities = roleStageFilter
    ? mockOpportunities.filter((o) => o.currentStage === roleStageFilter)
    : mockOpportunities

  useEffect(() => {
    setStatus(opportunity.status)
    setAssignedUsers(opportunity.assignedUsers)
  }, [opportunity.id, opportunity.status, opportunity.assignedUsers])

  const handleStatusChange = (newStatus: OpportunityStatus) => {
    setPendingStatus(newStatus)
    setShowConfirmDialog(true)
  }

  const confirmStatusChange = () => {
    if (pendingStatus) {
      setStatus(pendingStatus)
      toast({
        title: "Status Updated",
        description: `Status changed to ${getStatusLabel(pendingStatus)}`,
      })
      setShowConfirmDialog(false)
      setPendingStatus(null)
    }
  }

  const handleAssignUser = () => {
    if (selectedUser && !assignedUsers.includes(selectedUser)) {
      setAssignedUsers([...assignedUsers, selectedUser])
      toast({
        title: "User Assigned",
        description: `${selectedUser} has been assigned to this opportunity`,
      })
      setSelectedUser("")
      setShowAssignDialog(false)
    }
  }

  const handleRemoveUser = (userName: string) => {
    setAssignedUsers(assignedUsers.filter((user) => user !== userName))
    toast({
      title: "User Removed",
      description: `${userName} has been removed from this opportunity`,
    })
  }

  const handleSubmit = () => {
    if (onValidationTrigger) {
      onValidationTrigger()
      return
    }

    // Default behavior for other pages
    if (nextStage) {
      setShowStageProgressDialog(true)
    } else {
      toast({
        title: "Project Complete",
        description: "This project is already at the final stage",
      })
    }
  }

  const confirmStageProgression = () => {
    const updatedOpportunity = advanceOpportunityStage(opportunity.id)
    if (updatedOpportunity) {
      toast({
        title: "Stage Advanced",
        description: `Project moved to ${getStageLabel(updatedOpportunity.currentStage)} stage`,
      })
      setShowStageProgressDialog(false)
      // Refresh the page to show updated stage
      router.refresh()
    }
  }

  const handleCancel = () => {
    setShowCancelDialog(true)
  }

  const confirmCancel = () => {
    toast({
      title: "Project Cancelled",
      description: "This opportunity has been cancelled",
      variant: "destructive",
    })
    setShowCancelDialog(false)
  }

  const handleProjectChange = (projectId: string) => {
    router.push(`/${stage}?id=${projectId}`)
  }

  const handleSendFeedback = () => {
    if (feedbackMessage && feedbackTarget) {
      toast({
        title: "Feedback Sent",
        description: `Your feedback has been sent to the ${feedbackTarget} team`,
      })
      setFeedbackMessage("")
      setFeedbackTarget("")
      setShowFeedbackDialog(false)
    }
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
    <div className="flex h-full flex-col">
      <div className="border-b border-border bg-card px-8 py-4">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <Select value={opportunity.id} onValueChange={handleProjectChange}>
              <SelectTrigger className="mb-2 w-full max-w-md">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {filteredOpportunities.map((opp) => (
                  <SelectItem key={opp.id} value={opp.id}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{opp.name}</span>
                      <span className="text-xs text-muted-foreground">({opp.id})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <h1 className="font-sans text-2xl font-semibold text-card-foreground">{opportunity.name}</h1>
            <p className="text-sm text-muted-foreground">{opportunity.id}</p>
          </div>
          <StatusBadge status={status} />
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setShowAssignDialog(true)}>
            Assign Responsible
          </Button>

          {showFeedbackButton && (
            <>
              <Button variant="outline" onClick={() => setShowFeedbackDialog(true)}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Send Feedback
              </Button>

              <Button
                variant={unreadCount > 0 ? "default" : "outline"}
                onClick={() => setShowFeedbackListDialog(true)}
                className="relative"
              >
                <Bell className="mr-2 h-4 w-4" />
                Feedback
                {unreadCount > 0 && (
                  <Badge className="ml-2 h-5 min-w-5 rounded-full px-1 text-xs" variant="destructive">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </>
          )}

          <Button onClick={handleSubmit}>Submit/Approve</Button>
          <Button variant="destructive" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-8 py-6">
        <div className="mx-auto max-w-6xl space-y-6">{children}</div>
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change the status to {pendingStatus && getStatusLabel(pendingStatus)}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmStatusChange}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showStageProgressDialog} onOpenChange={setShowStageProgressDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Advance to Next Stage</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to advance this project from {getStageLabel(opportunity.currentStage)} to{" "}
              {nextStage && getStageLabel(nextStage)}? This will close the current stage and move the project forward.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmStageProgression}>Advance Stage</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Responsible</DialogTitle>
            <DialogDescription>Select a team member to assign to this opportunity</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Team Member</Label>
              <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" className="w-full justify-between bg-transparent">
                    {selectedUser || "Select team member..."}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search team members..." />
                    <CommandList>
                      <CommandEmpty>No team member found.</CommandEmpty>
                      <CommandGroup>
                        {teamMembers.map((member) => (
                          <CommandItem
                            key={member.id}
                            value={member.name}
                            onSelect={(value) => {
                              setSelectedUser(value)
                              setOpenCombobox(false)
                            }}
                          >
                            <Check
                              className={cn("mr-2 h-4 w-4", selectedUser === member.name ? "opacity-100" : "opacity-0")}
                            />
                            <div className="flex flex-col">
                              <span className="font-medium">{member.name}</span>
                              <span className="text-xs text-muted-foreground">{member.role}</span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignUser}>Assign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Feedback</DialogTitle>
            <DialogDescription>Send feedback to another team about this opportunity</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="feedback-target">Target Team</Label>
              <Select value={feedbackTarget} onValueChange={setFeedbackTarget}>
                <SelectTrigger id="feedback-target">
                  <SelectValue placeholder="Select target team" />
                </SelectTrigger>
                <SelectContent>
                  {feedbackTargets.map((target) => (
                    <SelectItem key={target} value={target}>
                      {target.charAt(0).toUpperCase() + target.slice(1)} Team
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="feedback-message">Message</Label>
              <Textarea
                id="feedback-message"
                placeholder="Enter your feedback message..."
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFeedbackDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendFeedback} disabled={!feedbackMessage || !feedbackTarget}>
              Send Feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showFeedbackListDialog} onOpenChange={setShowFeedbackListDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Feedback for {getTeamLabel(teamType)} Team</DialogTitle>
            <DialogDescription>Messages from other teams about {opportunity.name}</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[500px] pr-4">
            <div className="space-y-4 py-4">
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
          <DialogFooter>
            <Button onClick={() => setShowFeedbackListDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this project? This action cannot be undone and will mark the project as
              cancelled.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, Keep Project</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmCancel}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Yes, Cancel Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
