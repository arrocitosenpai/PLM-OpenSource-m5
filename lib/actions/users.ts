"use server"

import { createClient } from "@/lib/supabase/server"

export async function getUsers() {
  const supabase = await createClient()

  const { data, error } = await supabase.from("users").select("*").order("full_name")

  if (error) {
    console.error("[v0] Error fetching users:", error)
    return []
  }

  return data || []
}

export async function getUserById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("users").select("*").eq("id", id).single()

  if (error) {
    console.error("[v0] Error fetching user:", error)
    return null
  }

  return data
}
