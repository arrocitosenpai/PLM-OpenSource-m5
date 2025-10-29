import type { TeamMember } from "./mock-data"

export interface ForecastResult {
  nextWeekUtilization: number
  confidence: "high" | "medium" | "low"
  estimatedHours?: number
  insights: string[]
}

export function forecastCapacity(member: TeamMember): ForecastResult {
  const history = member.history || []
  const insights: string[] = []

  // If no history, return current capacity
  if (history.length === 0) {
    return {
      nextWeekUtilization: member.capacity,
      confidence: "low",
      insights: ["No historical data available"],
    }
  }

  // Linear regression on historical data
  const n = history.length
  const xValues = history.map((_, i) => i)
  const yValues = history.map((h) => h.value)

  const sumX = xValues.reduce((a, b) => a + b, 0)
  const sumY = yValues.reduce((a, b) => a + b, 0)
  const sumXY = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0)
  const sumX2 = xValues.reduce((sum, x) => sum + x * x, 0)

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n

  // Predict next week (index = n)
  const nextWeekUtilization = Math.round(slope * n + intercept)

  // Calculate confidence based on variance
  const mean = sumY / n
  const variance = yValues.reduce((sum, y) => sum + Math.pow(y - mean, 0), 0) / n
  const confidence = variance < 25 ? "high" : variance < 100 ? "medium" : "low"

  // Generate insights
  if (nextWeekUtilization > 110) {
    insights.push("High risk next week")
  }

  // Check for sustained overallocation
  const recentHigh = yValues.slice(-3).filter((v) => v > 100).length
  if (recentHigh >= 3) {
    insights.push("Sustained >100% for 3+ weeks")
  }

  // Check for under-utilization
  const recentLow = yValues.slice(-2).filter((v) => v < 70).length
  if (recentLow >= 2) {
    insights.push("Under-utilized for 2+ weeks")
  }

  // Check for spike risk
  if (slope > 5) {
    insights.push("Spike risk next week")
  }

  // Calculate estimated hours if weekly capacity is provided
  const estimatedHours = member.weeklyCapacityHours
    ? Math.round((nextWeekUtilization / 100) * member.weeklyCapacityHours * 10) / 10
    : undefined

  return {
    nextWeekUtilization,
    confidence,
    estimatedHours,
    insights,
  }
}

export function getCapacityBand(capacity: number): "under" | "balanced" | "high" | "over" {
  if (capacity < 70) return "under"
  if (capacity <= 100) return "balanced"
  if (capacity <= 110) return "high"
  return "over"
}

export function getCapacityBandLabel(band: "under" | "balanced" | "high" | "over"): string {
  switch (band) {
    case "under":
      return "Under (<70%)"
    case "balanced":
      return "Balanced (70-100%)"
    case "high":
      return "High (100-110%)"
    case "over":
      return "Over (>110%)"
  }
}

export function getCapacityColor(capacity: number): string {
  if (capacity < 90) return "hsl(var(--success))"
  if (capacity <= 100) return "hsl(var(--chart-2))"
  if (capacity <= 110) return "hsl(var(--warning))"
  return "hsl(var(--destructive))"
}

export function getStatusBadgeVariant(capacity: number): "default" | "secondary" | "destructive" | "outline" {
  if (capacity > 110) return "destructive"
  if (capacity > 100) return "default"
  if (capacity < 70) return "secondary"
  return "outline"
}
