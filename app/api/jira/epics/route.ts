import { type NextRequest, NextResponse } from "next/server"
import { getJiraConfig } from "@/lib/jira-config"

export async function GET(request: NextRequest) {
  try {
    const config = getJiraConfig()
    if (!config) {
      return NextResponse.json({ error: "Jira not configured" }, { status: 400 })
    }

    const auth = Buffer.from(`${config.email}:${config.apiToken}`).toString("base64")
    const baseUrl = `https://${config.domain}`

    const jql = `project=${config.projectKey} AND issuetype=Epic ORDER BY created DESC`

    const response = await fetch(`${baseUrl}/rest/api/3/search/jql`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        jql,
        fields: ["summary", "status"],
        maxResults: 100,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("[v0] Jira fetch epics error:", errorData)
      return NextResponse.json({ error: "Failed to fetch epics", details: errorData }, { status: response.status })
    }

    const data = await response.json()

    const epics = data.issues.map((issue: any) => ({
      key: issue.key,
      summary: issue.fields.summary,
      status: issue.fields.status.name,
    }))

    return NextResponse.json({ epics })
  } catch (error) {
    console.error("[v0] Error fetching Jira epics:", error)
    return NextResponse.json({ error: "Failed to fetch epics" }, { status: 500 })
  }
}
