export type OpportunityStatus = "not-started" | "in-progress" | "need-clarification" | "completed" | "cancelled"
export type Stage = "intake" | "product" | "engineering" | "platform" | "implementation" | "support"
export type FunctionType = "Supply Chain" | "TS" | "Finance" | "Operations" | "Marketing" | "HR"
export type Priority = "high" | "medium" | "low"
export type TeamType = "product" | "engineering" | "platform"
export type TeamMember = {
  id: string
  name: string
  role: string
  team: TeamType
  email: string
  capacity: number
  projectIds: string[]
  weeklyCapacityHours: number
  history: { week: string; value: number }[]
}

export interface Opportunity {
  id: string
  name: string
  function: FunctionType
  currentStage: Stage
  status: OpportunityStatus
  priority: Priority
  owner: string
  timeInStage: string
  problemStatement: string
  businessSponsor: string
  businessTeam: string
  businessValue: string
  qualityValue: string
  assignedUsers: string[]
  createdAt: Date
  stageHistory: {
    stage: Stage
    startDate: Date
    endDate?: Date
    duration?: number
  }[]
  comments?: Comment[]
  jiraEpicId?: string
  jiraEpicUrl?: string
  jiraStoryId?: string
  jiraStoryUrl?: string
  attachments?: {
    name: string
    type: string
    size: string
    url?: string
  }[]
}

export interface Feedback {
  id: string
  opportunityId: string
  from: TeamType
  to: TeamType
  message: string
  createdAt: Date
  read: boolean
}

export interface Comment {
  id: string
  opportunityId: string
  author: string
  authorRole: string
  message: string
  createdAt: Date
}

const stages: Stage[] = ["intake", "product", "engineering", "platform", "implementation", "support"]
const functions: FunctionType[] = ["Supply Chain", "TS", "Finance", "Operations", "Marketing", "HR"]
const statuses: OpportunityStatus[] = ["not-started", "in-progress", "need-clarification", "completed", "cancelled"]
const priorities: Priority[] = ["high", "medium", "low"]
const teams: TeamType[] = ["product", "engineering", "platform"]

function randomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

function generateStageHistory(currentStage: Stage): Opportunity["stageHistory"] {
  const history: Opportunity["stageHistory"] = []
  const currentStageIndex = stages.indexOf(currentStage)
  const baseDate = new Date("2024-01-01")

  for (let i = 0; i <= currentStageIndex; i++) {
    const startDate = new Date(baseDate.getTime() + i * 7 * 24 * 60 * 60 * 1000)
    const endDate =
      i < currentStageIndex ? new Date(startDate.getTime() + Math.random() * 14 * 24 * 60 * 60 * 1000) : undefined
    const duration = endDate ? Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) : undefined

    history.push({
      stage: stages[i],
      startDate,
      endDate,
      duration,
    })
  }

  return history
}

export const mockOpportunities: Opportunity[] = [
  {
    id: "OPP-001",
    name: "Inventory Management System",
    function: "Supply Chain",
    currentStage: "engineering",
    status: "in-progress",
    priority: "high",
    owner: "Sarah Chen",
    timeInStage: "3d 4h",
    problemStatement:
      "Current inventory tracking is manual and error-prone, leading to stockouts and overstock situations.",
    businessSponsor: "John Smith",
    businessTeam: "Supply Chain Operations",
    businessValue: "Reduce inventory costs by 15% and improve stock accuracy to 99%",
    qualityValue: "Eliminate manual data entry errors and improve real-time visibility",
    assignedUsers: ["Sarah Chen", "Mike Johnson", "Lisa Wang"],
    createdAt: new Date("2024-01-15"),
    stageHistory: generateStageHistory("engineering"),
    jiraEpicId: "EPIC-1234",
    jiraEpicUrl: "https://company.atlassian.net/browse/EPIC-1234",
    jiraStoryId: "STORY-5678",
    jiraStoryUrl: "https://company.atlassian.net/browse/STORY-5678",
    attachments: [
      { name: "Business Requirements.pdf", type: "PDF", size: "2.4 MB" },
      { name: "Demo Video.mp4", type: "MP4", size: "15.8 MB" },
      { name: "Product Design Document.pdf", type: "PDF", size: "3.2 MB" },
    ],
    comments: [
      {
        id: "CMT-001",
        opportunityId: "OPP-001",
        author: "Sarah Chen",
        authorRole: "Product Manager",
        message: "Initial requirements have been documented. Ready for engineering review.",
        createdAt: new Date("2024-03-01T09:00:00"),
      },
      {
        id: "CMT-002",
        opportunityId: "OPP-001",
        author: "Mike Johnson",
        authorRole: "Senior Engineer",
        message: "Reviewed the requirements. We'll need to clarify the API rate limiting strategy.",
        createdAt: new Date("2024-03-02T14:30:00"),
      },
      {
        id: "CMT-003",
        opportunityId: "OPP-001",
        author: "Lisa Wang",
        authorRole: "Engineer",
        message: "Started working on the database schema. Should have initial draft by end of week.",
        createdAt: new Date("2024-03-04T10:15:00"),
      },
    ],
  },
  {
    id: "OPP-002",
    name: "Customer Portal Enhancement",
    function: "TS",
    currentStage: "product",
    status: "in-progress",
    priority: "medium",
    owner: "David Park",
    timeInStage: "1d 2h",
    problemStatement: "Customers lack self-service capabilities for order tracking and support requests.",
    businessSponsor: "Emily Rodriguez",
    businessTeam: "Customer Success",
    businessValue: "Reduce support tickets by 30% and improve customer satisfaction scores",
    qualityValue: "Provide 24/7 self-service access and reduce response times",
    assignedUsers: ["David Park", "Anna Lee"],
    createdAt: new Date("2024-02-01"),
    stageHistory: generateStageHistory("product"),
    jiraEpicId: "EPIC-2345",
    jiraEpicUrl: "https://company.atlassian.net/browse/EPIC-2345",
    jiraStoryId: "STORY-6789",
    jiraStoryUrl: "https://company.atlassian.net/browse/STORY-6789",
    attachments: [{ name: "Customer Feedback.pdf", type: "PDF", size: "1.8 MB" }],
    comments: [
      {
        id: "CMT-004",
        opportunityId: "OPP-002",
        author: "David Park",
        authorRole: "Product Manager",
        message: "Customer feedback session completed. Adding new requirements to the spec.",
        createdAt: new Date("2024-02-28T16:00:00"),
      },
    ],
  },
  {
    id: "OPP-003",
    name: "Financial Reporting Automation",
    function: "Finance",
    currentStage: "implementation",
    status: "in-progress",
    priority: "high",
    owner: "Rachel Green",
    timeInStage: "5d 6h",
    problemStatement: "Monthly financial reports take 5 days to compile manually with high error rates.",
    businessSponsor: "Tom Anderson",
    businessTeam: "Finance Operations",
    businessValue: "Save 80 hours per month and improve reporting accuracy to 99.9%",
    qualityValue: "Enable real-time financial insights and reduce month-end close time",
    assignedUsers: ["Rachel Green", "Kevin Brown", "Sophia Martinez"],
    createdAt: new Date("2023-11-20"),
    stageHistory: generateStageHistory("implementation"),
    jiraEpicId: "EPIC-3456",
    jiraEpicUrl: "https://company.atlassian.net/browse/EPIC-3456",
    jiraStoryId: "STORY-7890",
    jiraStoryUrl: "https://company.atlassian.net/browse/STORY-7890",
    attachments: [{ name: "Financial Report Template.xlsx", type: "XLSX", size: "5.1 MB" }],
  },
  {
    id: "OPP-004",
    name: "Supplier Onboarding Platform",
    function: "Supply Chain",
    currentStage: "platform",
    status: "need-clarification",
    priority: "medium",
    owner: "James Wilson",
    timeInStage: "2d 1h",
    problemStatement: "Supplier onboarding takes 4-6 weeks with multiple manual touchpoints.",
    businessSponsor: "Maria Garcia",
    businessTeam: "Procurement",
    businessValue: "Reduce onboarding time to 1 week and improve supplier data quality",
    qualityValue: "Standardize onboarding process and ensure compliance",
    assignedUsers: ["James Wilson", "Nina Patel"],
    createdAt: new Date("2024-01-10"),
    stageHistory: generateStageHistory("platform"),
    jiraEpicId: "EPIC-4567",
    jiraEpicUrl: "https://company.atlassian.net/browse/EPIC-4567",
    jiraStoryId: "STORY-8901",
    jiraStoryUrl: "https://company.atlassian.net/browse/STORY-8901",
    attachments: [{ name: "Supplier Onboarding Process.docx", type: "DOCX", size: "1.2 MB" }],
  },
  {
    id: "OPP-005",
    name: "Employee Training Portal",
    function: "HR",
    currentStage: "support",
    status: "completed",
    priority: "low",
    owner: "Alex Turner",
    timeInStage: "12d 3h",
    problemStatement: "Training materials are scattered across multiple systems with no tracking.",
    businessSponsor: "Jennifer Lee",
    businessTeam: "Human Resources",
    businessValue: "Improve training completion rates by 40% and reduce onboarding time",
    qualityValue: "Centralize training content and enable progress tracking",
    assignedUsers: ["Alex Turner", "Chris Davis"],
    createdAt: new Date("2023-10-15"),
    stageHistory: generateStageHistory("support"),
    jiraEpicId: "EPIC-5678",
    jiraEpicUrl: "https://company.atlassian.net/browse/EPIC-5678",
    jiraStoryId: "STORY-9012",
    jiraStoryUrl: "https://company.atlassian.net/browse/STORY-9012",
    attachments: [{ name: "Training Portal Design.pptx", type: "PPTX", size: "3.5 MB" }],
  },
  {
    id: "OPP-006",
    name: "Marketing Campaign Analytics",
    function: "Marketing",
    currentStage: "intake",
    status: "not-started",
    priority: "medium",
    owner: "Olivia Thompson",
    timeInStage: "0d 8h",
    problemStatement: "Unable to measure ROI of marketing campaigns across multiple channels.",
    businessSponsor: "Robert Kim",
    businessTeam: "Marketing Operations",
    businessValue: "Improve marketing ROI by 25% through better targeting and measurement",
    qualityValue: "Enable data-driven marketing decisions and attribution modeling",
    assignedUsers: ["Olivia Thompson"],
    createdAt: new Date("2024-03-01"),
    stageHistory: generateStageHistory("intake"),
    jiraEpicId: "EPIC-6789",
    jiraEpicUrl: "https://company.atlassian.net/browse/EPIC-6789",
    jiraStoryId: "STORY-0123",
    jiraStoryUrl: "https://company.atlassian.net/browse/STORY-0123",
    attachments: [{ name: "Marketing Campaign Data.xlsx", type: "XLSX", size: "4.8 MB" }],
  },
  {
    id: "OPP-007",
    name: "Quality Control Dashboard",
    function: "Operations",
    currentStage: "engineering",
    status: "in-progress",
    priority: "high",
    owner: "Marcus Johnson",
    timeInStage: "4d 7h",
    problemStatement: "Quality metrics are reported weekly, delaying corrective actions.",
    businessSponsor: "Patricia White",
    businessTeam: "Quality Assurance",
    businessValue: "Reduce defect rates by 20% through real-time monitoring",
    qualityValue: "Enable proactive quality management and trend analysis",
    assignedUsers: ["Marcus Johnson", "Elena Rodriguez", "Tom Harris"],
    createdAt: new Date("2024-01-25"),
    stageHistory: generateStageHistory("engineering"),
    jiraEpicId: "EPIC-7890",
    jiraEpicUrl: "https://company.atlassian.net/browse/EPIC-7890",
    jiraStoryId: "STORY-1234",
    jiraStoryUrl: "https://company.atlassian.net/browse/STORY-1234",
    attachments: [{ name: "Quality Metrics Report.pdf", type: "PDF", size: "2.9 MB" }],
  },
  {
    id: "OPP-008",
    name: "Budget Planning Tool",
    function: "Finance",
    currentStage: "product",
    status: "in-progress",
    priority: "low",
    owner: "Diana Prince",
    timeInStage: "2d 5h",
    problemStatement: "Annual budget planning uses spreadsheets with version control issues.",
    businessSponsor: "Bruce Wayne",
    businessTeam: "Financial Planning",
    businessValue: "Reduce budget planning cycle from 8 weeks to 4 weeks",
    qualityValue: "Improve collaboration and maintain single source of truth",
    assignedUsers: ["Diana Prince", "Clark Kent"],
    createdAt: new Date("2024-02-10"),
    stageHistory: generateStageHistory("product"),
    jiraEpicId: "EPIC-8901",
    jiraEpicUrl: "https://company.atlassian.net/browse/EPIC-8901",
    jiraStoryId: "STORY-2345",
    jiraStoryUrl: "https://company.atlassian.net/browse/STORY-2345",
    attachments: [{ name: "Budget Planning Spreadsheet.xlsx", type: "XLSX", size: "6.2 MB" }],
  },
]

export const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "Product Manager",
    team: "product",
    email: "sarah.chen@company.com",
    capacity: 85,
    projectIds: ["OPP-001", "OPP-002"],
    weeklyCapacityHours: 40,
    history: [
      { week: "W-8", value: 75 },
      { week: "W-7", value: 78 },
      { week: "W-6", value: 82 },
      { week: "W-5", value: 80 },
      { week: "W-4", value: 83 },
      { week: "W-3", value: 85 },
      { week: "W-2", value: 84 },
      { week: "W-1", value: 85 },
    ],
  },
  {
    id: "2",
    name: "Mike Johnson",
    role: "Senior Engineer",
    team: "engineering",
    email: "mike.johnson@company.com",
    capacity: 110,
    projectIds: ["OPP-001", "OPP-003", "OPP-007"],
    weeklyCapacityHours: 40,
    history: [
      { week: "W-8", value: 95 },
      { week: "W-7", value: 98 },
      { week: "W-6", value: 102 },
      { week: "W-5", value: 105 },
      { week: "W-4", value: 107 },
      { week: "W-3", value: 108 },
      { week: "W-2", value: 109 },
      { week: "W-1", value: 110 },
    ],
  },
  {
    id: "3",
    name: "Lisa Wang",
    role: "Engineer",
    team: "engineering",
    email: "lisa.wang@company.com",
    capacity: 75,
    projectIds: ["OPP-001", "OPP-007"],
    weeklyCapacityHours: 40,
    history: [
      { week: "W-8", value: 70 },
      { week: "W-7", value: 72 },
      { week: "W-6", value: 73 },
      { week: "W-5", value: 74 },
      { week: "W-4", value: 75 },
      { week: "W-3", value: 76 },
      { week: "W-2", value: 75 },
      { week: "W-1", value: 75 },
    ],
  },
  {
    id: "4",
    name: "David Park",
    role: "Product Manager",
    team: "product",
    email: "david.park@company.com",
    capacity: 60,
    projectIds: ["OPP-002"],
    weeklyCapacityHours: 40,
    history: [
      { week: "W-8", value: 65 },
      { week: "W-7", value: 63 },
      { week: "W-6", value: 62 },
      { week: "W-5", value: 61 },
      { week: "W-4", value: 60 },
      { week: "W-3", value: 59 },
      { week: "W-2", value: 60 },
      { week: "W-1", value: 60 },
    ],
  },
  {
    id: "5",
    name: "Anna Lee",
    role: "Platform Engineer",
    team: "platform",
    email: "anna.lee@company.com",
    capacity: 90,
    projectIds: ["OPP-004", "OPP-002"],
    weeklyCapacityHours: 40,
    history: [
      { week: "W-8", value: 85 },
      { week: "W-7", value: 86 },
      { week: "W-6", value: 88 },
      { week: "W-5", value: 89 },
      { week: "W-4", value: 90 },
      { week: "W-3", value: 91 },
      { week: "W-2", value: 90 },
      { week: "W-1", value: 90 },
    ],
  },
  {
    id: "6",
    name: "Rachel Green",
    role: "Finance Lead",
    team: "product",
    email: "rachel.green@company.com",
    capacity: 70,
    projectIds: ["OPP-003"],
    weeklyCapacityHours: 40,
    history: [
      { week: "W-8", value: 68 },
      { week: "W-7", value: 69 },
      { week: "W-6", value: 70 },
      { week: "W-5", value: 71 },
      { week: "W-4", value: 70 },
      { week: "W-3", value: 69 },
      { week: "W-2", value: 70 },
      { week: "W-1", value: 70 },
    ],
  },
  {
    id: "7",
    name: "Kevin Brown",
    role: "Engineer",
    team: "engineering",
    email: "kevin.brown@company.com",
    capacity: 95,
    projectIds: ["OPP-003", "OPP-007"],
    weeklyCapacityHours: 40,
    history: [
      { week: "W-8", value: 88 },
      { week: "W-7", value: 90 },
      { week: "W-6", value: 92 },
      { week: "W-5", value: 93 },
      { week: "W-4", value: 94 },
      { week: "W-3", value: 95 },
      { week: "W-2", value: 95 },
      { week: "W-1", value: 95 },
    ],
  },
  {
    id: "8",
    name: "Sophia Martinez",
    role: "Data Analyst",
    team: "product",
    email: "sophia.martinez@company.com",
    capacity: 50,
    projectIds: ["OPP-003"],
    weeklyCapacityHours: 40,
    history: [
      { week: "W-8", value: 55 },
      { week: "W-7", value: 53 },
      { week: "W-6", value: 52 },
      { week: "W-5", value: 51 },
      { week: "W-4", value: 50 },
      { week: "W-3", value: 49 },
      { week: "W-2", value: 50 },
      { week: "W-1", value: 50 },
    ],
  },
  {
    id: "9",
    name: "James Wilson",
    role: "Platform Lead",
    team: "platform",
    email: "james.wilson@company.com",
    capacity: 100,
    projectIds: ["OPP-004", "OPP-006"],
    weeklyCapacityHours: 40,
    history: [
      { week: "W-8", value: 98 },
      { week: "W-7", value: 99 },
      { week: "W-6", value: 100 },
      { week: "W-5", value: 100 },
      { week: "W-4", value: 101 },
      { week: "W-3", value: 100 },
      { week: "W-2", value: 100 },
      { week: "W-1", value: 100 },
    ],
  },
  {
    id: "10",
    name: "Nina Patel",
    role: "Platform Engineer",
    team: "platform",
    email: "nina.patel@company.com",
    capacity: 80,
    projectIds: ["OPP-004"],
    weeklyCapacityHours: 40,
    history: [
      { week: "W-8", value: 78 },
      { week: "W-7", value: 79 },
      { week: "W-6", value: 80 },
      { week: "W-5", value: 81 },
      { week: "W-4", value: 80 },
      { week: "W-3", value: 79 },
      { week: "W-2", value: 80 },
      { week: "W-1", value: 80 },
    ],
  },
  {
    id: "11",
    name: "Marcus Johnson",
    role: "Senior Engineer",
    team: "engineering",
    email: "marcus.johnson@company.com",
    capacity: 105,
    projectIds: ["OPP-007", "OPP-001"],
    weeklyCapacityHours: 40,
    history: [
      { week: "W-8", value: 100 },
      { week: "W-7", value: 101 },
      { week: "W-6", value: 103 },
      { week: "W-5", value: 104 },
      { week: "W-4", value: 105 },
      { week: "W-3", value: 106 },
      { week: "W-2", value: 105 },
      { week: "W-1", value: 105 },
    ],
  },
  {
    id: "12",
    name: "Elena Rodriguez",
    role: "Engineer",
    team: "engineering",
    email: "elena.rodriguez@company.com",
    capacity: 65,
    projectIds: ["OPP-007"],
    weeklyCapacityHours: 40,
    history: [
      { week: "W-8", value: 62 },
      { week: "W-7", value: 63 },
      { week: "W-6", value: 64 },
      { week: "W-5", value: 65 },
      { week: "W-4", value: 66 },
      { week: "W-3", value: 65 },
      { week: "W-2", value: 65 },
      { week: "W-1", value: 65 },
    ],
  },
]

export const mockFeedback: Feedback[] = [
  {
    id: "FB-001",
    opportunityId: "OPP-001",
    from: "product",
    to: "engineering",
    message:
      "The inventory management requirements have been updated. Please review the new API specifications in the product documentation.",
    createdAt: new Date("2024-03-05T10:30:00"),
    read: false,
  },
  {
    id: "FB-002",
    opportunityId: "OPP-001",
    from: "engineering",
    to: "platform",
    message:
      "We need additional database capacity for the inventory system. Current estimates show we'll need 500GB storage and high IOPS.",
    createdAt: new Date("2024-03-05T14:20:00"),
    read: false,
  },
  {
    id: "FB-003",
    opportunityId: "OPP-002",
    from: "engineering",
    to: "product",
    message:
      "The customer portal authentication flow needs clarification. Should we support social login or just email/password?",
    createdAt: new Date("2024-03-04T09:15:00"),
    read: false,
  },
  {
    id: "FB-004",
    opportunityId: "OPP-004",
    from: "platform",
    to: "engineering",
    message:
      "Infrastructure is ready for the supplier onboarding platform. All environments have been provisioned and tested.",
    createdAt: new Date("2024-03-03T16:45:00"),
    read: true,
  },
  {
    id: "FB-005",
    opportunityId: "OPP-007",
    from: "product",
    to: "engineering",
    message:
      "Quality dashboard mockups are complete. Please review the design and let us know if any metrics are missing.",
    createdAt: new Date("2024-03-06T11:00:00"),
    read: false,
  },
]

export const mockComments: Comment[] = [
  {
    id: "CMT-001",
    opportunityId: "OPP-001",
    author: "Sarah Chen",
    authorRole: "Product Manager",
    message: "Initial requirements have been documented. Ready for engineering review.",
    createdAt: new Date("2024-03-01T09:00:00"),
  },
  {
    id: "CMT-002",
    opportunityId: "OPP-001",
    author: "Mike Johnson",
    authorRole: "Senior Engineer",
    message: "Reviewed the requirements. We'll need to clarify the API rate limiting strategy.",
    createdAt: new Date("2024-03-02T14:30:00"),
  },
  {
    id: "CMT-003",
    opportunityId: "OPP-001",
    author: "Lisa Wang",
    authorRole: "Engineer",
    message: "Started working on the database schema. Should have initial draft by end of week.",
    createdAt: new Date("2024-03-04T10:15:00"),
  },
  {
    id: "CMT-004",
    opportunityId: "OPP-002",
    author: "David Park",
    authorRole: "Product Manager",
    message: "Customer feedback session completed. Adding new requirements to the spec.",
    createdAt: new Date("2024-02-28T16:00:00"),
  },
]

export function getOpportunities(filters?: {
  year?: string
  function?: FunctionType | "all"
  stage?: Stage | "all"
  priority?: Priority | "all"
  search?: string
}) {
  let filtered = [...mockOpportunities]

  if (filters?.year && filters.year !== "all") {
    filtered = filtered.filter((opp) => opp.createdAt.getFullYear().toString() === filters.year)
  }

  if (filters?.function && filters.function !== "all") {
    filtered = filtered.filter((opp) => opp.function === filters.function)
  }

  if (filters?.stage && filters.stage !== "all") {
    filtered = filtered.filter((opp) => opp.currentStage === filters.stage)
  }

  if (filters?.priority && filters.priority !== "all") {
    filtered = filtered.filter((opp) => opp.priority === filters.priority)
  }

  if (filters?.search) {
    const search = filters.search.toLowerCase()
    filtered = filtered.filter(
      (opp) => opp.name.toLowerCase().includes(search) || opp.id.toLowerCase().includes(search),
    )
  }

  return filtered
}

export function getOpportunityById(id: string) {
  return mockOpportunities.find((opp) => opp.id === id)
}

export function getStageLabel(stage: Stage): string {
  return stage.charAt(0).toUpperCase() + stage.slice(1)
}

export function getStatusColor(status: OpportunityStatus): string {
  switch (status) {
    case "completed":
      return "text-success"
    case "in-progress":
      return "text-primary"
    case "need-clarification":
      return "text-warning"
    case "cancelled":
      return "text-destructive"
    default:
      return "text-muted-foreground"
  }
}

export function getStatusLabel(status: OpportunityStatus): string {
  return status
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export function getPriorityColor(priority: Priority): string {
  switch (priority) {
    case "high":
      return "text-destructive"
    case "medium":
      return "text-warning"
    case "low":
      return "text-success"
    default:
      return "text-muted-foreground"
  }
}

export function getPriorityLabel(priority: Priority): string {
  return priority.charAt(0).toUpperCase() + priority.slice(1)
}

export function getFeedbackForTeam(team: TeamType, opportunityId?: string): Feedback[] {
  let feedback = mockFeedback.filter((fb) => fb.to === team)
  if (opportunityId) {
    feedback = feedback.filter((fb) => fb.opportunityId === opportunityId)
  }
  return feedback.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export function getUnreadFeedbackCount(team: TeamType, opportunityId?: string): number {
  return getFeedbackForTeam(team, opportunityId).filter((fb) => !fb.read).length
}

export function getTeamLabel(team: TeamType): string {
  return team.charAt(0).toUpperCase() + team.slice(1)
}

export function getCommentsForOpportunity(opportunityId: string): Comment[] {
  return mockComments
    .filter((comment) => comment.opportunityId === opportunityId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export function addComment(opportunityId: string, author: string, authorRole: string, message: string): Comment {
  const newComment: Comment = {
    id: `CMT-${String(mockComments.length + 1).padStart(3, "0")}`,
    opportunityId,
    author,
    authorRole,
    message,
    createdAt: new Date(),
  }
  mockComments.push(newComment)
  return newComment
}

export function getNextStage(currentStage: Stage): Stage | null {
  const stages: Stage[] = ["intake", "product", "engineering", "platform", "implementation", "support"]
  const currentIndex = stages.indexOf(currentStage)
  if (currentIndex === -1 || currentIndex === stages.length - 1) {
    return null // Invalid stage or already at final stage
  }
  return stages[currentIndex + 1]
}

export function advanceOpportunityStage(opportunityId: string): Opportunity | null {
  const opportunity = mockOpportunities.find((opp) => opp.id === opportunityId)
  if (!opportunity) return null

  const nextStage = getNextStage(opportunity.currentStage)
  if (!nextStage) return null

  // Close current stage in history
  const currentStageHistory = opportunity.stageHistory.find((h) => h.stage === opportunity.currentStage && !h.endDate)
  if (currentStageHistory) {
    currentStageHistory.endDate = new Date()
    currentStageHistory.duration = Math.floor(
      (currentStageHistory.endDate.getTime() - currentStageHistory.startDate.getTime()) / (1000 * 60 * 60 * 24),
    )
  }

  // Add new stage to history
  opportunity.stageHistory.push({
    stage: nextStage,
    startDate: new Date(),
  })

  // Update current stage
  opportunity.currentStage = nextStage
  opportunity.status = "in-progress"

  return opportunity
}
