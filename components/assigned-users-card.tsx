"use client"

import { useEffect, useState, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { getAssignedUsers, removeUserFromOpportunity } from "@/lib/actions/opportunities"

interface AssignedUsersCardProps {
  opportunityId: string
}

export function AssignedUsersCard({ opportunityId }: AssignedUsersCardProps) {
  const [assignedUsers, setAssignedUsers] = useState<any[]>([])
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    async function loadAssignedUsers() {
      console.log("[v0] AssignedUsersCard: Loading users for opportunity:", opportunityId)
      const users = await getAssignedUsers(opportunityId)
      console.log("[v0] AssignedUsersCard: Loaded users:", users)
      setAssignedUsers(users)
    }
    loadAssignedUsers()
  }, [opportunityId, refreshTrigger])

  const handleRemoveUser = async (userId: string) => {
    const userName = assignedUsers.find((u) => u.id === userId)?.full_name || "User"

    console.log("[v0] AssignedUsersCard: Removing user:", userName)

    startTransition(async () => {
      try {
        setAssignedUsers((prev) => prev.filter((u) => u.id !== userId))
        await removeUserFromOpportunity(opportunityId, userId)
        console.log("[v0] AssignedUsersCard: User removed successfully")
        setRefreshTrigger((prev) => prev + 1)
        toast({
          title: "User Removed",
          description: `${userName} has been removed from this opportunity`,
        })
      } catch (error) {
        console.error("[v0] AssignedUsersCard: Error removing user:", error)
        const users = await getAssignedUsers(opportunityId)
        setAssignedUsers(users)
        toast({
          title: "Error",
          description: "Failed to remove user",
          variant: "destructive",
        })
      }
    })
  }

  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader>
        <CardTitle>Assigned Users</CardTitle>
      </CardHeader>
      <CardContent>
        {assignedUsers.length === 0 ? (
          <p className="text-sm text-muted-foreground">No users assigned yet</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {assignedUsers.map((user) => (
              <Badge key={user.id} variant="secondary" className="gap-1 px-3 py-1">
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
      </CardContent>
    </Card>
  )
}
