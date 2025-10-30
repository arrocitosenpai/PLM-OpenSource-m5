"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getOpportunities(filters?: {
  year?: string
  function?: string
  stage?: string
  priority?: string
  search?: string
}) {
  const supabase = await createClient()

  let query = supabase.from("opportunities").select("*")

  if (filters?.year && filters.year !== "all") {
    const yearStart = `${filters.year}-01-01`
    const yearEnd = `${filters.year}-12-31`
    query = query.gte("created_at", yearStart).lte("created_at", yearEnd)
  }

  if (filters?.function && filters.function !== "all") {
    query = query.eq("function", filters.function)
  }

  if (filters?.stage && filters.stage !== "all") {
    query = query.eq("current_stage", filters.stage)
  }

  if (filters?.priority && filters.priority !== "all") {
    query = query.eq("priority", filters.priority)
  }

  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,id.ilike.%${filters.search}%`)
  }

  const { data, error } = await query.order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching opportunities:", error)
    return []
  }

  return data || []
}

export async function getOpportunityById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("opportunities").select("*").eq("id", id).single()

  if (error) {
    console.error("[v0] Error fetching opportunity:", error)
    return null
  }

  return data
}

export async function updateOpportunityStatus(id: string, status: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("opportunities").update({ status }).eq("id", id)

  if (error) {
    console.error("[v0] Error updating opportunity status:", error)
    throw new Error("Failed to update opportunity status")
  }

  revalidatePath("/")
}

export async function advanceOpportunityStage(id: string) {
  const supabase = await createClient()

  // Get current opportunity
  const { data: opportunity, error: fetchError } = await supabase
    .from("opportunities")
    .select("*")
    .eq("id", id)
    .single()

  if (fetchError || !opportunity) {
    console.error("[v0] Error fetching opportunity:", fetchError)
    throw new Error("Failed to fetch opportunity")
  }

  const stages = ["intake", "product", "engineering", "platform", "implementation", "support"]
  const currentIndex = stages.indexOf(opportunity.current_stage)

  if (currentIndex === -1 || currentIndex === stages.length - 1) {
    throw new Error("Cannot advance stage")
  }

  const nextStage = stages[currentIndex + 1]

  // Update opportunity stage
  const { error: updateError } = await supabase
    .from("opportunities")
    .update({
      current_stage: nextStage,
      status: "in-progress",
    })
    .eq("id", id)

  if (updateError) {
    console.error("[v0] Error advancing opportunity stage:", updateError)
    throw new Error("Failed to advance opportunity stage")
  }

  // Add stage history entry
  const { error: historyError } = await supabase.from("opportunity_stage_history").insert({
    opportunity_id: id,
    stage: nextStage,
    started_at: new Date().toISOString(),
  })

  if (historyError) {
    console.error("[v0] Error creating stage history:", historyError)
  }

  revalidatePath("/")
  return nextStage
}

export async function assignUserToOpportunity(opportunityId: string, userId: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("opportunity_assignments").insert({
    opportunity_id: opportunityId,
    user_id: userId,
  })

  if (error) {
    console.error("[v0] Error assigning user:", error)
    throw new Error("Failed to assign user")
  }

  revalidatePath("/")
}

export async function removeUserFromOpportunity(opportunityId: string, userId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("opportunity_assignments")
    .delete()
    .eq("opportunity_id", opportunityId)
    .eq("user_id", userId)

  if (error) {
    console.error("[v0] Error removing user:", error)
    throw new Error("Failed to remove user")
  }

  revalidatePath("/")
}

export async function cancelOpportunity(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("opportunities").update({ status: "cancelled" }).eq("id", id)

  if (error) {
    console.error("[v0] Error cancelling opportunity:", error)
    throw new Error("Failed to cancel opportunity")
  }

  revalidatePath("/")
}

export async function getAssignedUsers(opportunityId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("opportunity_assignments")
    .select(
      `
      user_id,
      users (
        id,
        full_name,
        email,
        role,
        team_type,
        avatar_url
      )
    `,
    )
    .eq("opportunity_id", opportunityId)

  if (error) {
    console.error("[v0] Error fetching assigned users:", error)
    return []
  }

  return data?.map((assignment: any) => assignment.users) || []
}
