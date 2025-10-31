"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RolePageLayout } from "@/components/role-page-layout"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle2 } from "lucide-react"
import { useState } from "react"
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

export function SupportPageClient({ opportunity }: { opportunity: any }) {
  const { toast } = useToast()
  const [notes, setNotes] = useState("Project successfully delivered. All acceptance criteria met.")
  const [showCloseDialog, setShowCloseDialog] = useState(false)

  const handleCloseProject = () => {
    setShowCloseDialog(true)
  }

  const handleReopen = () => {
    toast({
      title: "Project Reopened",
      description: "This opportunity has been reopened for additional work",
    })
  }

  const confirmCloseProject = () => {
    toast({
      title: "Project Closed",
      description: "This opportunity has been successfully closed",
    })
    setShowCloseDialog(false)
  }

  return (
    <RolePageLayout opportunity={opportunity} stage="support">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-success" />
            Delivered Solution
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">Solution Summary</h3>
            <p className="text-sm leading-relaxed">
              Successfully implemented {opportunity.name.toLowerCase()} with all requested features. The solution
              includes automated workflows, real-time reporting, and integration with existing systems. User training
              has been completed and documentation is available.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="mb-2 text-sm font-medium text-muted-foreground">Deployment Date</h3>
              <p className="text-sm font-medium">March 15, 2024</p>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-medium text-muted-foreground">Version</h3>
              <p className="text-sm font-medium">v1.0.0</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Support Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">Support Owner</h3>
            <p className="text-sm font-medium">{opportunity.owner}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Key Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg border border-border bg-muted/20 p-4">
              <p className="mb-1 text-sm text-muted-foreground">Uptime</p>
              <p className="text-2xl font-semibold text-success">99.8%</p>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/20 p-4">
              <p className="mb-1 text-sm text-muted-foreground">Support Tickets</p>
              <p className="text-2xl font-semibold">12</p>
              <p className="text-xs text-muted-foreground">3 open, 9 resolved</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/20 p-4">
              <p className="mb-1 text-sm text-muted-foreground">User Satisfaction</p>
              <p className="text-2xl font-semibold">4.7/5</p>
              <p className="text-xs text-muted-foreground">Based on 24 responses</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Support Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add support notes..."
            className="min-h-[120px]"
          />
          <div className="flex gap-2">
            <Button onClick={handleCloseProject}>Close Project</Button>
            <Button variant="outline" onClick={handleReopen}>
              Reopen Project
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showCloseDialog} onOpenChange={setShowCloseDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Close Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to close this project? This will mark the project as complete and archive all
              related information.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, Keep Open</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCloseProject}>Yes, Close Project</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </RolePageLayout>
  )
}
