import { mockOpportunities, type Stage } from "./mock-data"

export interface StageAnalytics {
  stage: Stage
  avgDuration: number
  count: number
}

export interface TimelineData {
  month: string
  avgDuration: number
  count: number
}

export function calculateStageAnalytics(): StageAnalytics[] {
  const stageMap = new Map<Stage, { totalDuration: number; count: number }>()

  mockOpportunities.forEach((opp) => {
    opp.stageHistory.forEach((history) => {
      if (history.duration) {
        const existing = stageMap.get(history.stage) || { totalDuration: 0, count: 0 }
        stageMap.set(history.stage, {
          totalDuration: existing.totalDuration + history.duration,
          count: existing.count + 1,
        })
      }
    })
  })

  const analytics: StageAnalytics[] = []
  stageMap.forEach((value, stage) => {
    analytics.push({
      stage,
      avgDuration: Math.round(value.totalDuration / value.count),
      count: value.count,
    })
  })

  return analytics.sort((a, b) => b.avgDuration - a.avgDuration)
}

export function calculateTimelineData(): TimelineData[] {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
  return months.map((month, index) => ({
    month,
    avgDuration: Math.round(45 + Math.random() * 30 - index * 2),
    count: Math.round(5 + Math.random() * 10),
  }))
}

export function calculateKPIs() {
  const allDurations: number[] = []
  const stageDurations = new Map<Stage, number[]>()

  mockOpportunities.forEach((opp) => {
    let totalDuration = 0
    opp.stageHistory.forEach((history) => {
      if (history.duration) {
        totalDuration += history.duration
        const durations = stageDurations.get(history.stage) || []
        durations.push(history.duration)
        stageDurations.set(history.stage, durations)
      }
    })
    if (totalDuration > 0) {
      allDurations.push(totalDuration)
    }
  })

  const avgTotalDuration = allDurations.length
    ? Math.round(allDurations.reduce((a, b) => a + b, 0) / allDurations.length)
    : 0

  let fastestStage: Stage = "intake"
  let slowestStage: Stage = "intake"
  let minAvg = Number.POSITIVE_INFINITY
  let maxAvg = 0

  stageDurations.forEach((durations, stage) => {
    const avg = durations.reduce((a, b) => a + b, 0) / durations.length
    if (avg < minAvg) {
      minAvg = avg
      fastestStage = stage
    }
    if (avg > maxAvg) {
      maxAvg = avg
      slowestStage = stage
    }
  })

  const completedCount = mockOpportunities.filter((o) => o.status === "completed").length
  const completionRate = Math.round((completedCount / mockOpportunities.length) * 100)

  return {
    avgTotalDuration,
    fastestStage,
    slowestStage,
    completionRate,
  }
}
