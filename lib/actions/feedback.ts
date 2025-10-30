"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createFeedback(data: {
  opportunityId: string
  fromTeam: string
  toTeam: string
  message: string
}) {
  const supabase = await createClient()

  const feedbackId = crypto.randomUUID()

  const { data: feedback, error } = await supabase
    .from("feedback")
    .insert({
      id: feedbackId,
      opportunity_id: data.opportunityId,
      from_team: data.fromTeam,
      to_team: data.toTeam,
      message: data.message,
      read: false,
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Error creating feedback:", error)
    throw new Error("Failed to create feedback")
  }

  revalidatePath("/")
  return feedback
}

export async function getFeedbackForTeam(team: string, opportunityId?: string) {
  const supabase = await createClient()

  let query = supabase.from("feedback").select("*").eq("to_team", team).order("created_at", { ascending: false })

  if (opportunityId) {
    query = query.eq("opportunity_id", opportunityId)
  }

  const { data, error } = await query

  if (error) {
    console.error("[v0] Error fetching feedback:", error)
    return []
  }

  return data || []
}

export async function markFeedbackAsRead(feedbackId: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("feedback").update({ read: true }).eq("id", feedbackId)

  if (error) {
    console.error("[v0] Error marking feedback as read:", error)
    throw new Error("Failed to mark feedback as read")
  }

  revalidatePath("/")
}

export async function getUnreadFeedbackCount(team: string, opportunityId?: string) {
  const supabase = await createClient()

  let query = supabase.from("feedback").select("id", { count: "exact" }).eq("to_team", team).eq("read", false)

  if (opportunityId) {
    query = query.eq("opportunity_id", opportunityId)
  }

  const { count, error } = await query

  if (error) {
    console.error("[v0] Error counting unread feedback:", error)
    return 0
  }

  return count || 0
}
