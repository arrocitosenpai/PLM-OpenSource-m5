import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { token, owner, repo } = await request.json()

    if (!token || !owner || !repo) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Test connection by fetching repository details
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
      },
    })

    if (!response.ok) {
      const error = await response.text()
      return NextResponse.json(
        { error: `GitHub API error: ${response.statusText}`, details: error },
        { status: response.status },
      )
    }

    const repoData = await response.json()

    return NextResponse.json({
      success: true,
      repository: {
        id: repoData.id,
        name: repoData.name,
        fullName: repoData.full_name,
        private: repoData.private,
      },
    })
  } catch (error) {
    console.error("[v0] GitHub test connection error:", error)
    return NextResponse.json({ error: "Failed to connect to GitHub" }, { status: 500 })
  }
}
