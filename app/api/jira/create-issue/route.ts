import { type NextRequest, NextResponse } from "next/server"
import { getJiraConfig } from "@/lib/jira-config"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { issueType, summary, description, parentKey } = body

    const config = getJiraConfig()
    if (!config) {
      return NextResponse.json({ error: "Jira not configured" }, { status: 400 })
    }

    const auth = Buffer.from(`${config.email}:${config.apiToken}`).toString("base64")
    const baseUrl = `https://${config.domain}`

    const issuePayload: any = {
      fields: {
        project: {
          key: config.projectKey,
        },
        summary,
        description: {
          type: "doc",
          version: 1,
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: description || "",
                },
              ],
            },
          ],
        },
        issuetype: {
          name: issueType, // "Epic" or "Story"
        },
      },
    }

    if (issueType === "Story" && parentKey && parentKey.trim() !== "") {
      issuePayload.fields.parent = {
        key: parentKey,
      }
    }

    console.log("[v0] Creating Jira issue with payload:", JSON.stringify(issuePayload, null, 2))

    const response = await fetch(`${baseUrl}/rest/api/3/issue`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(issuePayload),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("[v0] Jira create issue error:", errorData)
      return NextResponse.json(
        {
          error: errorData.errorMessages?.[0] || "Failed to create issue",
          details: errorData,
        },
        { status: response.status },
      )
    }

    const data = await response.json()
    console.log("[v0] Successfully created Jira issue:", data.key)

    return NextResponse.json({
      success: true,
      issue: {
        key: data.key,
        id: data.id,
        self: data.self,
        url: `${baseUrl}/browse/${data.key}`,
      },
    })
  } catch (error) {
    console.error("[v0] Error creating Jira issue:", error)
    return NextResponse.json({ error: "Failed to create issue" }, { status: 500 })
  }
}
