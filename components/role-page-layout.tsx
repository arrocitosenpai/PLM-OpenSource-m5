"use client"

import type React from "react"
import { useState, useEffect, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
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
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth, getRoleStageFilter } from "@/lib/auth-context"
import { createFeedback, getFeedbackForTeam, getUnreadFeedbackCount } from "@/lib/actions/feedback"
import {
  advanceOpportunityStage as advanceStage,
  updateOpportunityStatus,
  cancelOpportunity,
  assignUserToOpportunity,
  removeUserFromOpportunity,
  getAssignedUsers,
} from "@/lib/actions/opportunities"
import { getUsers } from "@/lib/actions/users"

interface RolePageLayoutProps {
  opportunity: any
  stage: string
  children?: React.ReactNode
}

export function RolePageLayout({ opportunity, stage, children }: RolePageLayoutProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const roleStageFilter = getRoleStageFilter(user?.role || null)
  const [status, setStatus] = useState(opportunity.status)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [pendingStatus, setPendingStatus] = useState<string | null>(null)
  const { toast } = useToast()

  const [assignedUsers, setAssignedUsers] = useState<any[]>([])
  const [isPending, startTransition] = useTransition()
  const [showAssignDialog, setShowAssignDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState("")
  const [openCombobox, setOpenCombobox] = useState(false)
  const [teamMembers, setTeamMembers] = useState<any[]>([])

  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState("")
  const [feedbackTarget, setFeedbackTarget] = useState("")

  const [showFeedbackListDialog, setShowFeedbackListDialog] = useState(false)
  const teamType = stage
  const [unreadCount, setUnreadCount] = useState(0)
  const [feedbackList, setFeedbackList] = useState<any[]>([])

  const [showStageProgressDialog, setShowStageProgressDialog] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  const stages = ["intake", "product", "engineering", "platform", "implementation", "support"]
  const currentIndex = stages.indexOf(opportunity.current_stage)
  const nextStage = currentIndex !== -1 && currentIndex < stages.length - 1 ? stages[currentIndex + 1] : null

  const feedbackTargets = ["product", "engineering", "platform"].filter((target) => target !== stage)

  const showFeedbackButton = ["product", "engineering", "platform"].includes(stage)
  const showFeedbackLog = ["product", "engineering", "platform"].includes(stage)

  useEffect(() => {
    async function loadData() {
      const users = await getUsers()
      setTeamMembers(users)

      const assigned = await getAssignedUsers(opportunity.id)
      setAssignedUsers(assigned)

      const feedback = await getFeedbackForTeam(teamType, opportunity.id)
      setFeedbackList(feedback)

      const count = await getUnreadFeedbackCount(teamType, opportunity.id)
      setUnreadCount(count)
    }
    loadData()
  }, [teamType, opportunity.id])

  useEffect(() => {
    setStatus(opportunity.status)
  }, [opportunity.id, opportunity.status])

  const handleStatusChange = (newStatus: string) => {
    setPendingStatus(newStatus)
    setShowConfirmDialog(true)
  }

  const confirmStatusChange = async () => {
    if (pendingStatus) {
      try {
        await updateOpportunityStatus(opportunity.id, pendingStatus)
        setStatus(pendingStatus)
        toast({
          title: "Status Updated",
          description: `Status changed to ${pendingStatus}`,
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update status",
          variant: "destructive",
        })
      }
      setShowConfirmDialog(false)
      setPendingStatus(null)
    }
  }

  const handleAssignUser = async () => {
    if (selectedUser && !assignedUsers.find((u) => u.id === selectedUser)) {
      const userName = teamMembers.find((u) => u.id === selectedUser)?.full_name || "User"
      const newUser = teamMembers.find((u) => u.id === selectedUser)

      setShowAssignDialog(false)
      setSelectedUser("")

      startTransition(async () => {
        try {
          await assignUserToOpportunity(opportunity.id, selectedUser)
          setAssignedUsers((prev) => [...prev, newUser])
          toast({
            title: "User Assigned",
            description: `${userName} has been assigned to this opportunity`,
          })
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to assign user",
            variant: "destructive",
          })
        }
      })
    }
  }

  const handleRemoveUser = async (userId: string) => {
    const userName = assignedUsers.find((u) => u.id === userId)?.full_name || "User"

    startTransition(async () => {
      try {
        await removeUserFromOpportunity(opportunity.id, userId)
        setAssignedUsers((prev) => prev.filter((u) => u.id !== userId))
        toast({
          title: "User Removed",
          description: `${userName} has been removed from this opportunity`,
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to remove user",
          variant: "destructive",
        })
      }
    })
  }

  const handleSubmit = () => {
    if (nextStage) {
      setShowStageProgressDialog(true)
    } else {
      toast({
        title: "Project Complete",
        description: "This project is already at the final stage",
      })
    }
  }

  const confirmStageProgression = async () => {
    try {
      const newStage = await advanceStage(opportunity.id)
      toast({
        title: "Stage Advanced",
        description: `Project moved to ${newStage} stage`,
      })
      setShowStageProgressDialog(false)
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to advance stage",
        variant: "destructive",
      })
    }
  }

  const handleCancel = () => {
    setShowCancelDialog(true)
  }

  const confirmCancel = async () => {
    try {
      await cancelOpportunity(opportunity.id)
      toast({
        title: "Project Cancelled",
        description: "This opportunity has been cancelled",
        variant: "destructive",
      })
      setShowCancelDialog(false)
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel opportunity",
        variant: "destructive",
      })
    }
  }

  const handleProjectChange = (projectId: string) => {
    router.push(`/${stage}?id=${projectId}`)
  }

  const handleSendFeedback = async () => {
    if (feedbackMessage && feedbackTarget && user) {
      try {
        await createFeedback({
          opportunityId: opportunity.id,
          fromTeam: stage,
          toTeam: feedbackTarget,
          message: feedbackMessage,
          userId: user.id || "00000000-0000-0000-0000-000000000001",
        })
        toast({
          title: "Feedback Sent",
          description: `Your feedback has been sent to the ${feedbackTarget} team`,
        })
        setFeedbackMessage("")
        setFeedbackTarget("")
        setShowFeedbackDialog(false)
        const feedback = await getFeedbackForTeam(teamType, opportunity.id)
        setFeedbackList(feedback)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to send feedback",
          variant: "destructive",
        })
      }
    }
  }

  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === "string" ? new Date(date) : date
    const now = new Date()
    const diff = now.getTime() - dateObj.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    return "Just now"
  }

  const getTeamLabel = (team: string) => {
    return team.charAt(0).toUpperCase() + team.slice(1)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border bg-card px-8 py-4">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
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
        <div className="mx-auto max-w-6xl space-y-6">
          {children}
          {assignedUsers.length > 0 && (
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">Assigned:</span>
              {assignedUsers.map((user) => (
                <Badge key={user.id} variant="secondary" className="gap-1">
                  {user.full_name}
                  <button
                    onClick={() => handleRemoveUser(user.id)}
                    className="ml-1 rounded-full hover:bg-muted"
                    aria-label={`Remove ${user.full_name}`}
                    disabled={isPending}
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign User</DialogTitle>
            <DialogDescription>Assign a team member to this opportunity</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="user-select">Select User</Label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger id="user-select">
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers
                    .filter((member) => !assignedUsers.find((u) => u.id === member.id))
                    .map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        <div className="flex flex-col">
                          <span>{member.full_name}</span>
                          <span className="text-xs text-muted-foreground">
                            {member.role} - {member.team_type}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignUser} disabled={!selectedUser}>
              Assign User
            </Button>
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
                            From {getTeamLabel(feedback.from_team)}
                          </Badge>
                          {!feedback.read && (
                            <Badge variant="default" className="text-xs">
                              New
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">{formatDate(feedback.created_at)}</span>
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
    </div>
  )
}
