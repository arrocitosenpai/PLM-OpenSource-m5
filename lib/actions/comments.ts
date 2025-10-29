"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createComment(data: {
  opportunityId: string
  userId: string
  message: string
}) {
  const supabase = await createClient()

  const { data: comment, error } = await supabase
    .from("comments")
    .insert({
      opportunity_id: data.opportunityId,
      user_id: data.userId,
      message: data.message,
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Error creating comment:", error)
    throw new Error("Failed to create comment")
  }

  revalidatePath("/")
  return comment
}

export async function getCommentsForOpportunity(opportunityId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("comments")
    .select(`
      *,
      users (
        name,
        role
      )
    `)
    .eq("opportunity_id", opportunityId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching comments:", error)
    return []
  }

  return data || []
}
