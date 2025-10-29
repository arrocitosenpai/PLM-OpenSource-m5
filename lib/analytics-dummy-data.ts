// Dummy data generator for analytics dashboard
import { addDays, format, startOfWeek, subWeeks } from "date-fns"

export type WorkItemType = "Story" | "Bug" | "Task" | "Epic"
export type WorkItemStatus = "To Do" | "In Progress" | "Review" | "QA" | "Done" | "Blocked"
export type StatusGroup = "todo" | "inprogress" | "review" | "done"

export interface WorkItem {
  id: string
  title: string
  type: WorkItemType
  status: WorkItemStatus
  statusGroup: StatusGroup
  assignee: string
  team: string
  project: string
  labels: string[]
  sprint?: string
  storyPoints: number
  createdAt: Date
  startedAt?: Date
  completedAt?: Date
  blockedHours: number
  blockerReason?: string
  reopened: boolean
  isPlanned: boolean
  component: string
}

const teams = ["Platform", "Frontend", "Backend"]
const assignees = [
  "Alice Johnson",
  "Bob Smith",
  "Carol White",
  "David Lee",
  "Emma Davis",
  "Frank Miller",
  "Grace Chen",
  "Henry Wilson",
]
const projects = ["Project Alpha", "Project Beta", "Project Gamma", "Project Delta"]
const components = ["Auth", "API", "UI", "Database", "Infrastructure", "Analytics"]
const labels = ["feature", "enhancement", "refactor", "security", "performance", "ux"]
const blockerReasons = [
  "Waiting for review",
  "Environment issue",
  "Dependency",
  "Blocked by other team",
  "Waiting for design",
]

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function generateWorkItems(weeks = 26): WorkItem[] {
  const items: WorkItem[] = []
  const now = new Date()
  const startDate = subWeeks(now, weeks)

  for (let i = 0; i < 300; i++) {
    const createdAt = addDays(startDate, randomInt(0, weeks * 7))
    const isCompleted = Math.random() > 0.2
    const isBlocked = Math.random() < 0.2
    const reopened = isCompleted && Math.random() < 0.06
    const isPlanned = Math.random() > 0.1

    let startedAt: Date | undefined
    let completedAt: Date | undefined

    if (isCompleted || Math.random() > 0.3) {
      startedAt = addDays(createdAt, randomInt(1, 5))
      if (isCompleted) {
        completedAt = addDays(startedAt, randomInt(2, 14))
      }
    }

    const statusGroup: StatusGroup = isCompleted
      ? "done"
      : startedAt
        ? isBlocked
          ? "inprogress"
          : Math.random() > 0.5
            ? "inprogress"
            : "review"
        : "todo"

    const status: WorkItemStatus = isCompleted
      ? "Done"
      : isBlocked
        ? "Blocked"
        : statusGroup === "todo"
          ? "To Do"
          : statusGroup === "inprogress"
            ? "In Progress"
            : statusGroup === "review"
              ? Math.random() > 0.5
                ? "Review"
                : "QA"
              : "To Do"

    items.push({
      id: `ITEM-${1000 + i}`,
      title: `${randomItem(["Implement", "Fix", "Update", "Refactor", "Add"])} ${randomItem(components)} ${randomItem(["feature", "bug", "component", "integration"])}`,
      type: randomItem<WorkItemType>(["Story", "Story", "Story", "Bug", "Task", "Epic"]),
      status,
      statusGroup,
      assignee: randomItem(assignees),
      team: randomItem(teams),
      project: randomItem(projects),
      labels: [randomItem(labels)],
      sprint: isCompleted || startedAt ? `Sprint ${randomInt(1, 20)}` : undefined,
      storyPoints: randomInt(1, 8),
      createdAt,
      startedAt,
      completedAt,
      blockedHours: isBlocked ? randomInt(4, 48) : 0,
      blockerReason: isBlocked ? randomItem(blockerReasons) : undefined,
      reopened,
      isPlanned,
      component: randomItem(components),
    })
  }

  return items.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
}

export interface TimeSeriesPoint {
  date: string
  week: string
  value: number
  [key: string]: string | number
}

export function generateThroughputData(items: WorkItem[]): TimeSeriesPoint[] {
  const weekMap = new Map<string, { total: number; Story: number; Bug: number; Task: number }>()

  items
    .filter((item) => item.completedAt)
    .forEach((item) => {
      const weekStart = startOfWeek(item.completedAt!)
      const weekKey = format(weekStart, "yyyy-MM-dd")

      if (!weekMap.has(weekKey)) {
        weekMap.set(weekKey, { total: 0, Story: 0, Bug: 0, Task: 0 })
      }

      const week = weekMap.get(weekKey)!
      week.total++
      if (item.type === "Story" || item.type === "Bug" || item.type === "Task") {
        week[item.type]++
      }
    })

  return Array.from(weekMap.entries())
    .map(([date, counts]) => ({
      date,
      week: format(new Date(date), "MMM dd"),
      value: counts.total,
      Story: counts.Story,
      Bug: counts.Bug,
      Task: counts.Task,
    }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

export function generateCumulativeFlowData(items: WorkItem[]): TimeSeriesPoint[] {
  const weekMap = new Map<string, { todo: number; inprogress: number; review: number; done: number }>()

  // Get all weeks in range
  const allWeeks = new Set<string>()
  items.forEach((item) => {
    const weekStart = startOfWeek(item.createdAt)
    allWeeks.add(format(weekStart, "yyyy-MM-dd"))
    if (item.completedAt) {
      const completedWeek = startOfWeek(item.completedAt)
      allWeeks.add(format(completedWeek, "yyyy-MM-dd"))
    }
  })

  const sortedWeeks = Array.from(allWeeks).sort()

  sortedWeeks.forEach((weekKey) => {
    const weekDate = new Date(weekKey)
    const todo = items.filter(
      (item) => item.createdAt <= weekDate && (!item.startedAt || item.startedAt > weekDate),
    ).length
    const inprogress = items.filter(
      (item) =>
        item.startedAt &&
        item.startedAt <= weekDate &&
        (!item.completedAt || item.completedAt > weekDate) &&
        item.statusGroup === "inprogress",
    ).length
    const review = items.filter(
      (item) =>
        item.startedAt &&
        item.startedAt <= weekDate &&
        (!item.completedAt || item.completedAt > weekDate) &&
        item.statusGroup === "review",
    ).length
    const done = items.filter((item) => item.completedAt && item.completedAt <= weekDate).length

    weekMap.set(weekKey, { todo, inprogress, review, done })
  })

  return Array.from(weekMap.entries())
    .map(([date, counts]) => ({
      date,
      week: format(new Date(date), "MMM dd"),
      value: counts.todo + counts.inprogress + counts.review + counts.done,
      todo: counts.todo,
      inprogress: counts.inprogress,
      review: counts.review,
      done: counts.done,
    }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

export function generateBottleneckHeatmapData(items: WorkItem[]) {
  const statuses = ["To Do", "In Progress", "Review", "QA", "Done"]
  const weeks = Array.from(new Set(items.map((item) => format(startOfWeek(item.createdAt), "MMM dd")))).slice(-8)

  const data: { x: string; y: string; value: number; itemCount: number; items: WorkItem[] }[] = []

  weeks.forEach((week) => {
    statuses.forEach((status) => {
      const weekStart = new Date(week)
      const weekEnd = addDays(weekStart, 7)

      const weekItems = items.filter((item) => {
        const itemWeek = startOfWeek(item.createdAt)
        return format(itemWeek, "MMM dd") === week && item.status === status
      })

      // Calculate average hours in stage (simulated realistic values)
      let avgHours = 0
      if (weekItems.length > 0) {
        if (status === "To Do") avgHours = randomInt(8, 48)
        else if (status === "In Progress") avgHours = randomInt(24, 120)
        else if (status === "Review") avgHours = randomInt(12, 72)
        else if (status === "QA") avgHours = randomInt(16, 80)
        else if (status === "Done") avgHours = randomInt(4, 24)
      }

      data.push({
        x: week,
        y: status,
        value: avgHours,
        itemCount: weekItems.length,
        items: weekItems,
      })
    })
  })

  return { data, xLabels: weeks, yLabels: statuses }
}

export function generateBlockerReasonsData(items: WorkItem[]) {
  const reasonMap = new Map<
    string,
    {
      hours: number
      count: number
      durations: number[]
      items: WorkItem[]
    }
  >()

  items
    .filter((item) => item.blockerReason && item.blockedHours > 0)
    .forEach((item) => {
      const reason = item.blockerReason!
      if (!reasonMap.has(reason)) {
        reasonMap.set(reason, { hours: 0, count: 0, durations: [], items: [] })
      }
      const data = reasonMap.get(reason)!
      data.hours += item.blockedHours
      data.count += 1
      data.durations.push(item.blockedHours)
      data.items.push(item)
    })

  return Array.from(reasonMap.entries())
    .map(([name, data]) => ({
      name,
      blockedHours: Math.round(data.hours),
      blockedItems: data.count,
      avgBlockDuration: Math.round(data.hours / data.count),
      medianBlockDuration: Math.round(data.durations.sort((a, b) => a - b)[Math.floor(data.durations.length / 2)] || 0),
      items: data.items,
    }))
    .sort((a, b) => b.blockedHours - a.blockedHours)
}

export function generateCycleTimeScatterData(items: WorkItem[]) {
  return items
    .filter((item) => item.completedAt && item.startedAt)
    .map((item) => {
      const cycleTime = (item.completedAt!.getTime() - item.startedAt!.getTime()) / (1000 * 60 * 60 * 24)
      return {
        id: item.id,
        cycleTime: Math.round(cycleTime),
        storyPoints: item.storyPoints,
        type: item.type,
        completedAt: format(item.completedAt!, "MMM dd"),
      }
    })
}

export function generateCommitmentReliabilityData(items: WorkItem[]) {
  const sprintMap = new Map<string, { planned: number; completed: number }>()

  items.forEach((item) => {
    if (item.sprint) {
      if (!sprintMap.has(item.sprint)) {
        sprintMap.set(item.sprint, { planned: 0, completed: 0 })
      }
      const sprint = sprintMap.get(item.sprint)!
      if (item.isPlanned) sprint.planned++
      if (item.completedAt) sprint.completed++
    }
  })

  return Array.from(sprintMap.entries())
    .map(([name, data]) => ({
      name,
      planned: data.planned,
      completed: data.completed,
      reliability: data.planned > 0 ? Math.round((data.completed / data.planned) * 100) : 0,
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(-10)
}

export function generateInactiveItemsData(items: WorkItem[]) {
  const now = new Date()
  return items
    .filter((item) => item.startedAt && !item.completedAt)
    .map((item) => {
      const daysSinceUpdate = Math.floor((now.getTime() - item.startedAt!.getTime()) / (1000 * 60 * 60 * 24))
      return {
        id: item.id,
        title: item.title,
        assignee: item.assignee,
        daysSinceUpdate,
        status: item.status,
      }
    })
    .filter((item) => item.daysSinceUpdate > 7)
    .sort((a, b) => b.daysSinceUpdate - a.daysSinceUpdate)
}

export function generateEffortImpactData(items: WorkItem[]) {
  const projects = Array.from(new Set(items.map((item) => item.project)))

  return projects.map((project) => {
    const projectItems = items.filter((item) => item.project === project)
    const effort = projectItems.reduce((sum, item) => sum + item.storyPoints, 0)
    const impact = randomInt(20, 100) // In real app, this would come from business metrics
    return {
      name: project,
      effort,
      impact,
    }
  })
}

export interface OKRNode {
  id: string
  title: string
  type: "objective" | "keyResult" | "initiative"
  progress: number
  owner: string
  children?: OKRNode[]
}

export function generateOKRTree(): OKRNode[] {
  return [
    {
      id: "O1",
      title: "Improve Product Quality",
      type: "objective",
      progress: 75,
      owner: "Engineering",
      children: [
        {
          id: "KR1.1",
          title: "Reduce bug count by 40%",
          type: "keyResult",
          progress: 80,
          owner: "QA Team",
          children: [
            {
              id: "I1.1.1",
              title: "Implement automated testing",
              type: "initiative",
              progress: 90,
              owner: "Alice Johnson",
            },
            { id: "I1.1.2", title: "Code review process", type: "initiative", progress: 70, owner: "Bob Smith" },
          ],
        },
        {
          id: "KR1.2",
          title: "Increase test coverage to 85%",
          type: "keyResult",
          progress: 70,
          owner: "Engineering",
        },
      ],
    },
    {
      id: "O2",
      title: "Accelerate Time to Market",
      type: "objective",
      progress: 60,
      owner: "Product",
      children: [
        {
          id: "KR2.1",
          title: "Reduce cycle time by 30%",
          type: "keyResult",
          progress: 55,
          owner: "Platform Team",
        },
        {
          id: "KR2.2",
          title: "Deploy 2x per week",
          type: "keyResult",
          progress: 65,
          owner: "DevOps",
        },
      ],
    },
  ]
}

export function generateInvestmentMixData(items: WorkItem[]) {
  const typeMap = new Map<string, number>()

  items.forEach((item) => {
    const count = typeMap.get(item.type) || 0
    typeMap.set(item.type, count + item.storyPoints)
  })

  return Array.from(typeMap.entries()).map(([name, value]) => ({ name, value }))
}

export function generateAverageTimePerStageData(items: WorkItem[]) {
  const stages = [
    { name: "Implementation", fill: "#ef4444" }, // red
    { name: "Intake", fill: "#a855f7" }, // purple
    { name: "Engineering", fill: "#10b981" }, // green
    { name: "Platform", fill: "#f59e0b" }, // orange
    { name: "Product", fill: "#3b82f6" }, // blue
  ]

  return stages.map((stage) => ({
    name: stage.name,
    value: randomInt(6, 12),
    fill: stage.fill,
  }))
}

export function generateStageBottlenecksData(items: WorkItem[]) {
  const stages = [
    { stage: "Implementation", fill: "#ef4444" },
    { stage: "Intake", fill: "#a855f7" },
    { stage: "Engineering", fill: "#10b981" },
    { stage: "Platform", fill: "#f59e0b" },
    { stage: "Product", fill: "#3b82f6" },
  ]

  return stages
    .map((stage) => ({
      stage: stage.stage,
      avgDays: randomInt(6, 12),
      projectCount: randomInt(1, 7),
      fill: stage.fill,
    }))
    .sort((a, b) => b.avgDays - a.avgDays)
}

export function calculateCycleTime(items: WorkItem[]): number {
  const completed = items.filter((item) => item.completedAt && item.startedAt)
  if (completed.length === 0) return 0

  const total = completed.reduce((sum, item) => {
    const days = (item.completedAt!.getTime() - item.startedAt!.getTime()) / (1000 * 60 * 60 * 24)
    return sum + days
  }, 0)

  return Math.round(total / completed.length)
}

export function calculateLeadTime(items: WorkItem[]): number {
  const completed = items.filter((item) => item.completedAt)
  if (completed.length === 0) return 0

  const total = completed.reduce((sum, item) => {
    const days = (item.completedAt!.getTime() - item.createdAt.getTime()) / (1000 * 60 * 60 * 24)
    return sum + days
  }, 0)

  return Math.round(total / completed.length)
}

export function calculateWIP(items: WorkItem[]): number {
  return items.filter((item) => item.startedAt && !item.completedAt).length
}

export function calculateReopenRate(items: WorkItem[]): number {
  const completed = items.filter((item) => item.completedAt)
  if (completed.length === 0) return 0

  const reopened = completed.filter((item) => item.reopened).length
  return Math.round((reopened / completed.length) * 100)
}

export interface KPIData {
  value: number
  delta: number
  trend: "up" | "down" | "neutral"
}

export function calculateKPIWithDelta(
  items: WorkItem[],
  calculator: (items: WorkItem[]) => number,
  lowerIsBetter = false,
): KPIData {
  const now = new Date()
  const twoWeeksAgo = subWeeks(now, 2)
  const fourWeeksAgo = subWeeks(now, 4)

  const currentPeriod = items.filter((item) => item.createdAt >= twoWeeksAgo)
  const previousPeriod = items.filter((item) => item.createdAt >= fourWeeksAgo && item.createdAt < twoWeeksAgo)

  const currentValue = calculator(currentPeriod)
  const previousValue = calculator(previousPeriod)

  const delta = previousValue === 0 ? 0 : Math.round(((currentValue - previousValue) / previousValue) * 100)

  let trend: "up" | "down" | "neutral" = "neutral"
  if (delta > 0) trend = "up"
  else if (delta < 0) trend = "down"

  return { value: currentValue, delta, trend }
}

export function generateReopenTrendData(items: WorkItem[]) {
  const weekMap = new Map<string, { total: number; reopened: number }>()

  items
    .filter((item) => item.completedAt)
    .forEach((item) => {
      const weekStart = startOfWeek(item.completedAt!)
      const weekKey = format(weekStart, "yyyy-MM-dd")

      if (!weekMap.has(weekKey)) {
        weekMap.set(weekKey, { total: 0, reopened: 0 })
      }

      const week = weekMap.get(weekKey)!
      week.total++
      if (item.reopened) week.reopened++
    })

  return Array.from(weekMap.entries())
    .map(([date, counts]) => ({
      date,
      week: format(new Date(date), "MMM dd"),
      reopenRate: counts.total > 0 ? Math.round((counts.reopened / counts.total) * 100) : 0,
      defects: counts.reopened,
    }))
    .sort((a, b) => a.date.localeCompare(b.date))
}
