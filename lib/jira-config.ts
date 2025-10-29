// Jira configuration management
export interface JiraConfig {
  domain: string
  email: string
  apiToken: string
  projectKey: string
}

export interface GitHubConfig {
  token: string
  owner: string
  repo: string
}

const JIRA_CONFIG_KEY = "jira_config"
const GITHUB_CONFIG_KEY = "github_config"

export function saveJiraConfig(config: JiraConfig): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(JIRA_CONFIG_KEY, JSON.stringify(config))
  }
}

export function getJiraConfig(): JiraConfig | null {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(JIRA_CONFIG_KEY)
    return stored ? JSON.parse(stored) : null
  }
  return null
}

export function clearJiraConfig(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(JIRA_CONFIG_KEY)
  }
}

export function saveGitHubConfig(config: GitHubConfig): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(GITHUB_CONFIG_KEY, JSON.stringify(config))
  }
}

export function getGitHubConfig(): GitHubConfig | null {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(GITHUB_CONFIG_KEY)
    return stored ? JSON.parse(stored) : null
  }
  return null
}

export function clearGitHubConfig(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(GITHUB_CONFIG_KEY)
  }
}
