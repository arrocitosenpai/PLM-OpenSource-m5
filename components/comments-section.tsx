"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { type Comment, getCommentsForOpportunity, addComment } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"
import { MessageSquare, Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CommentsSectionProps {
  opportunityId: string
}

export function CommentsSection({ opportunityId }: CommentsSectionProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [comments, setComments] = useState<Comment[]>(getCommentsForOpportunity(opportunityId))
  const [newComment, setNewComment] = useState("")

  const handleAddComment = () => {
    if (!newComment.trim() || !user) return

    const comment = addComment(opportunityId, user.name, user.role, newComment.trim())
    setComments([comment, ...comments])
    setNewComment("")
    toast({
      title: "Comment Added",
      description: "Your comment has been posted successfully",
    })
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)

    if (days > 7) {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    }
    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    return "Just now"
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Comments
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            className="resize-none"
          />
          <div className="flex justify-end">
            <Button onClick={handleAddComment} disabled={!newComment.trim()} size="sm">
              <Send className="mr-2 h-4 w-4" />
              Post Comment
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No comments yet. Be the first to comment!
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-3 rounded-lg border border-border bg-muted/20 p-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                    {getInitials(comment.author)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{comment.author}</p>
                      <p className="text-xs text-muted-foreground">{comment.authorRole}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground">{comment.message}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
