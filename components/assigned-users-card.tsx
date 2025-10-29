"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { getAssignedUsers, removeUserFromOpportunity } from "@/lib/actions/opportunities"

interface AssignedUsersCardProps {
  opportunityId: string
}

export function AssignedUsersCard({ opportunityId }: AssignedUsersCardProps) {
  const [assignedUsers, setAssignedUsers] = useState<any[]>([])
  const { toast } = useToast()

  useEffect(() => {
    async function loadAssignedUsers() {
      const users = await getAssignedUsers(opportunityId)
      setAssignedUsers(users)
    }
    loadAssignedUsers()
  }, [opportunityId])

  const handleRemoveUser = async (userId: string) => {
    try {
      await removeUserFromOpportunity(opportunityId, userId)
      const users = await getAssignedUsers(opportunityId)
      setAssignedUsers(users)
      const userName = assignedUsers.find((u) => u.id === userId)?.full_name || "User"
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
