import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { domain, email, apiToken, projectKey } = await request.json()

    if (!domain || !email || !apiToken || !projectKey) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create Basic Auth header
    const auth = Buffer.from(`${email}:${apiToken}`).toString("base64")

    // Test connection by fetching project details
    const response = await fetch(`https://${domain}/rest/api/3/project/${projectKey}`, {
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      const error = await response.text()
      return NextResponse.json(
        { error: `Jira API error: ${response.statusText}`, details: error },
        { status: response.status },
      )
    }

    const project = await response.json()

    return NextResponse.json({
      success: true,
      project: {
        id: project.id,
        key: project.key,
        name: project.name,
      },
    })
  } catch (error) {
    console.error("[v0] Jira test connection error:", error)
    return NextResponse.json({ error: "Failed to connect to Jira" }, { status: 500 })
  }
}
