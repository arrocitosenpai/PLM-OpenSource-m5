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

  let query = supabase.from("opportunities").select(
    `
      *,
      owner:users!owner_id (
        id,
        full_name,
        email
      )
    `,
  )

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

  // Transform data to match component expectations
  const transformedData = await Promise.all(
    (data || []).map(async (opp: any) => {
      // Calculate time in stage
      const timeInStage = await calculateTimeInStage(opp.id, opp.current_stage, opp.updated_at)

      return {
        id: opp.id,
        name: opp.name,
        function: opp.function,
        currentStage: opp.current_stage, // Map snake_case to camelCase
        status: opp.status,
        priority: opp.priority,
        owner: opp.owner?.full_name || "Unassigned", // Get owner name from joined data
        timeInStage: timeInStage,
        created_at: opp.created_at,
        // Include all other fields for detail views
        problemStatement: opp.problem_statement,
        businessSponsor: opp.business_sponsor,
        businessTeam: opp.business_team,
        businessValue: opp.business_value,
        qualityValue: opp.quality_value,
        jiraEpicId: opp.jira_epic_id,
        jiraEpicUrl: opp.jira_epic_url,
        jiraStoryId: opp.jira_story_id,
        jiraStoryUrl: opp.jira_story_url,
        ownerId: opp.owner_id,
      }
    }),
  )

  return transformedData
}

async function calculateTimeInStage(opportunityId: string, currentStage: string, updatedAt: string): Promise<string> {
  const supabase = await createClient()

  // Try to get the most recent stage history entry for the current stage
  // Use maybeSingle() which returns null instead of throwing error when no rows found
  const { data: stageHistory, error } = await supabase
    .from("opportunity_stage_history")
    .select("start_date")
    .eq("opportunity_id", opportunityId)
    .eq("stage", currentStage)
    .order("start_date", { ascending: false })
    .limit(1)
    .maybeSingle()

  // If there's an error or no stage history, fall back to updated_at
  const startDate = stageHistory?.start_date ? new Date(stageHistory.start_date) : new Date(updatedAt)
  const now = new Date()
  const diffMs = now.getTime() - startDate.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "< 1 day"
  if (diffDays === 1) return "1 day"
  if (diffDays < 7) return `${diffDays} days`
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return weeks === 1 ? "1 week" : `${weeks} weeks`
  }
  const months = Math.floor(diffDays / 30)
  return months === 1 ? "1 month" : `${months} months`
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

  console.log("[v0] ========== STAGE ADVANCEMENT STARTED ==========")
  console.log("[v0] Advancing stage for opportunity:", id)

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

  console.log("[v0] Current opportunity data:", {
    id: opportunity.id,
    name: opportunity.name,
    current_stage: opportunity.current_stage,
    status: opportunity.status,
  })

  const stages = ["intake", "product", "engineering", "platform", "implementation", "support"]
  const currentIndex = stages.indexOf(opportunity.current_stage)

  console.log("[v0] Stage progression:", {
    currentStage: opportunity.current_stage,
    currentIndex,
    totalStages: stages.length,
  })

  if (currentIndex === -1) {
    console.error("[v0] Invalid current stage:", opportunity.current_stage)
    throw new Error("Invalid current stage")
  }

  if (currentIndex === stages.length - 1) {
    console.log("[v0] Already at final stage (support)")
    throw new Error("Cannot advance stage - already at final stage")
  }

  const nextStage = stages[currentIndex + 1]
  console.log("[v0] Advancing from", opportunity.current_stage, "to", nextStage)

  const { error: updateError } = await supabase
    .from("opportunities")
    .update({
      current_stage: nextStage,
      status: "in-progress",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (updateError) {
    console.error("[v0] Database update error:", updateError)
    throw new Error("Failed to advance opportunity stage")
  }

  console.log("[v0] ✅ Successfully updated opportunity to stage:", nextStage)

  // Add stage history entry
  const { error: historyError } = await supabase.from("opportunity_stage_history").insert({
    opportunity_id: id,
    stage: nextStage,
    start_date: new Date().toISOString(),
  })

  if (historyError) {
    console.error("[v0] Error creating stage history:", historyError)
  } else {
    console.log("[v0] ✅ Stage history entry created")
  }

  revalidatePath("/intake")
  revalidatePath("/product")
  revalidatePath("/engineering")
  revalidatePath("/platform")
  revalidatePath("/implementation")
  revalidatePath("/support")

  console.log("[v0] ========== STAGE ADVANCEMENT COMPLETE ==========")
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

  revalidatePath("/intake")
  revalidatePath("/product")
  revalidatePath("/engineering")
  revalidatePath("/platform")
  revalidatePath("/implementation")
  revalidatePath("/support")
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

  revalidatePath("/intake")
  revalidatePath("/product")
  revalidatePath("/engineering")
  revalidatePath("/platform")
  revalidatePath("/implementation")
  revalidatePath("/support")
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
