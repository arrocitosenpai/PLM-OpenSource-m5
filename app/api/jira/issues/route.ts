import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { domain, email, apiToken, projectKey } = await request.json()

    if (!domain || !email || !apiToken || !projectKey) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const auth = Buffer.from(`${email}:${apiToken}`).toString("base64")

    // Fetch issues from the project using the new /rest/api/3/search/jql endpoint with POST method
    const response = await fetch(`https://${domain}/rest/api/3/search/jql`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jql: `project=${projectKey}`,
        fields: [
          "summary",
          "status",
          "assignee",
          "progress",
          "issuetype",
          "created",
          "updated",
          "duedate",
          "resolutiondate",
        ],
        maxResults: 100,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      return NextResponse.json(
        { error: `Jira API error: ${response.statusText}`, details: error },
        { status: response.status },
      )
    }

    const data = await response.json()

    // Transform Jira issues to our format
    const issues = data.issues.map((issue: any) => ({
      id: issue.id,
      key: issue.key,
      summary: issue.fields.summary,
      status: issue.fields.status.name,
      statusCategory: issue.fields.status.statusCategory.key,
      assignee: issue.fields.assignee
        ? {
            name: issue.fields.assignee.displayName,
            email: issue.fields.assignee.emailAddress,
          }
        : null,
      progress: issue.fields.progress?.percent || 0,
      issueType: issue.fields.issuetype.name,
      created: issue.fields.created,
      updated: issue.fields.updated,
      dueDate: issue.fields.duedate,
      resolutionDate: issue.fields.resolutiondate,
    }))

    return NextResponse.json({ issues })
  } catch (error) {
    console.error("[v0] Jira fetch issues error:", error)
    return NextResponse.json({ error: "Failed to fetch Jira issues" }, { status: 500 })
  }
}
