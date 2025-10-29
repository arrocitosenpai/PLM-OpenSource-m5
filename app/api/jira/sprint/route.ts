import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { domain, email, apiToken, projectKey } = await request.json()

    if (!domain || !email || !apiToken || !projectKey) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const auth = Buffer.from(`${email}:${apiToken}`).toString("base64")

    // First, get the board ID for the project
    const boardResponse = await fetch(`https://${domain}/rest/agile/1.0/board?projectKeyOrId=${projectKey}`, {
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: "application/json",
      },
    })

    if (!boardResponse.ok) {
      return NextResponse.json({ error: "Failed to fetch board information" }, { status: boardResponse.status })
    }

    const boardData = await boardResponse.json()
    if (!boardData.values || boardData.values.length === 0) {
      return NextResponse.json({ error: "No board found for this project" }, { status: 404 })
    }

    const board = boardData.values[0]
    const boardId = board.id

    const boardType = board.type?.toLowerCase()
    if (boardType !== "scrum") {
      console.log(
        `[v0] Board ${boardId} is type '${boardType}', skipping sprint fetch (sprints only available for Scrum boards)`,
      )
      return NextResponse.json({ sprint: null })
    }

    // Get active sprint
    const sprintResponse = await fetch(`https://${domain}/rest/agile/1.0/board/${boardId}/sprint?state=active`, {
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: "application/json",
      },
    })

    if (!sprintResponse.ok) {
      if (sprintResponse.status === 400) {
        console.log(`[v0] Board ${boardId} does not support sprints, returning null`)
        return NextResponse.json({ sprint: null })
      }
      return NextResponse.json({ sprint: null })
    }

    const sprintData = await sprintResponse.json()
    if (!sprintData.values || sprintData.values.length === 0) {
      return NextResponse.json({ sprint: null })
    }

    const activeSprint = sprintData.values[0]

    // Calculate days remaining
    const endDate = new Date(activeSprint.endDate)
    const now = new Date()
    const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    return NextResponse.json({
      sprint: {
        id: activeSprint.id,
        name: activeSprint.name,
        state: activeSprint.state,
        startDate: activeSprint.startDate,
        endDate: activeSprint.endDate,
        daysRemaining: Math.max(0, daysRemaining),
      },
    })
  } catch (error) {
    console.error("[v0] Jira fetch sprint error:", error)
    return NextResponse.json({ sprint: null })
  }
}
