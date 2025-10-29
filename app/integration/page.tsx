"use client"

import { Suspense, useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"
import {
  saveJiraConfig,
  getJiraConfig,
  clearJiraConfig,
  saveGitHubConfig,
  getGitHubConfig,
  clearGitHubConfig,
  type JiraConfig,
  type GitHubConfig,
} from "@/lib/jira-config"

function IntegrationPageContent() {
  const { toast } = useToast()

  // Jira state
  const [jiraConfig, setJiraConfig] = useState<JiraConfig>({
    domain: "",
    email: "",
    apiToken: "",
    projectKey: "",
  })
  const [jiraConnected, setJiraConnected] = useState(false)
  const [testingJira, setTestingJira] = useState(false)

  // GitHub state
  const [githubConfig, setGithubConfig] = useState<GitHubConfig>({
    token: "",
    owner: "",
    repo: "",
  })
  const [githubConnected, setGithubConnected] = useState(false)
  const [testingGithub, setTestingGithub] = useState(false)

  // Load saved configs on mount
  useEffect(() => {
    const savedJira = getJiraConfig()
    if (savedJira) {
      setJiraConfig(savedJira)
      setJiraConnected(true)
    }

    const savedGithub = getGitHubConfig()
    if (savedGithub) {
      setGithubConfig(savedGithub)
      setGithubConnected(true)
    }
  }, [])

  const handleJiraTest = async () => {
    setTestingJira(true)
    try {
      const response = await fetch("/api/jira/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jiraConfig),
      })

      const data = await response.json()

      if (response.ok) {
        setJiraConnected(true)
        saveJiraConfig(jiraConfig)
        toast({
          title: "Connection Successful",
          description: `Connected to Jira project: ${data.project?.name || jiraConfig.projectKey}`,
        })
      } else {
        setJiraConnected(false)
        toast({
          title: "Connection Failed",
          description: data.error || "Failed to connect to Jira",
          variant: "destructive",
        })
      }
    } catch (error) {
      setJiraConnected(false)
      toast({
        title: "Connection Error",
        description: "Failed to test Jira connection",
        variant: "destructive",
      })
    } finally {
      setTestingJira(false)
    }
  }

  const handleJiraDisconnect = () => {
    clearJiraConfig()
    setJiraConfig({
      domain: "",
      email: "",
      apiToken: "",
      projectKey: "",
    })
    setJiraConnected(false)
    toast({
      title: "Disconnected",
      description: "Jira integration has been disconnected",
    })
  }

  const handleGithubTest = async () => {
    setTestingGithub(true)
    try {
      const response = await fetch("/api/github/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(githubConfig),
      })

      const data = await response.json()

      if (response.ok) {
        setGithubConnected(true)
        saveGitHubConfig(githubConfig)
        toast({
          title: "Connection Successful",
          description: `Connected to GitHub repository: ${githubConfig.owner}/${githubConfig.repo}`,
        })
      } else {
        setGithubConnected(false)
        toast({
          title: "Connection Failed",
          description: data.error || "Failed to connect to GitHub",
          variant: "destructive",
        })
      }
    } catch (error) {
      setGithubConnected(false)
      toast({
        title: "Connection Error",
        description: "Failed to test GitHub connection",
        variant: "destructive",
      })
    } finally {
      setTestingGithub(false)
    }
  }

  const handleGithubDisconnect = () => {
    clearGitHubConfig()
    setGithubConfig({
      token: "",
      owner: "",
      repo: "",
    })
    setGithubConnected(false)
    toast({
      title: "Disconnected",
      description: "GitHub integration has been disconnected",
    })
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border bg-card px-6 py-4">
        <h1 className="font-sans text-2xl font-semibold text-card-foreground">Integrations</h1>
        <p className="text-sm text-muted-foreground">Configure external integrations for your project lifecycle</p>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-4xl">
          <Tabs defaultValue="jira" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="jira" className="gap-2">
                Jira
                {jiraConnected && <CheckCircle2 className="h-4 w-4 text-success" />}
              </TabsTrigger>
              <TabsTrigger value="github" className="gap-2">
                GitHub
                {githubConnected && <CheckCircle2 className="h-4 w-4 text-success" />}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="jira" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Jira Cloud Integration</CardTitle>
                      <CardDescription>Connect to your Jira Cloud instance to sync implementation data</CardDescription>
                    </div>
                    {jiraConnected ? (
                      <Badge variant="outline" className="border-success/50 bg-success/10 text-success">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Connected
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-muted-foreground/50 bg-muted text-muted-foreground">
                        <XCircle className="mr-1 h-3 w-3" />
                        Not Connected
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="jira-domain">Jira Domain</Label>
                    <Input
                      id="jira-domain"
                      placeholder="your-domain.atlassian.net"
                      value={jiraConfig.domain}
                      onChange={(e) => setJiraConfig({ ...jiraConfig, domain: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">Your Jira Cloud domain (without https://)</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="jira-email">Email</Label>
                    <Input
                      id="jira-email"
                      type="email"
                      placeholder="your-email@company.com"
                      value={jiraConfig.email}
                      onChange={(e) => setJiraConfig({ ...jiraConfig, email: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">Your Jira account email</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="jira-token">API Token</Label>
                    <Input
                      id="jira-token"
                      type="password"
                      placeholder="Enter your Jira API token"
                      value={jiraConfig.apiToken}
                      onChange={(e) => setJiraConfig({ ...jiraConfig, apiToken: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Generate an API token from{" "}
                      <a
                        href="https://id.atlassian.com/manage-profile/security/api-tokens"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Atlassian Account Settings
                      </a>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="jira-project">Project Key</Label>
                    <Input
                      id="jira-project"
                      placeholder="PROJ"
                      value={jiraConfig.projectKey}
                      onChange={(e) => setJiraConfig({ ...jiraConfig, projectKey: e.target.value.toUpperCase() })}
                    />
                    <p className="text-xs text-muted-foreground">The project key from your Jira project (e.g., PROJ)</p>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={handleJiraTest}
                      disabled={
                        !jiraConfig.domain ||
                        !jiraConfig.email ||
                        !jiraConfig.apiToken ||
                        !jiraConfig.projectKey ||
                        testingJira
                      }
                    >
                      {testingJira && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Test Connection
                    </Button>
                    {jiraConnected && (
                      <Button variant="outline" onClick={handleJiraDisconnect}>
                        Disconnect
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>How It Works</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>Once connected, the Implementation page will automatically fetch data from your Jira project:</p>
                  <ul className="list-inside list-disc space-y-1 pl-4">
                    <li>Team members and their assigned issues</li>
                    <li>Sprint information and velocity metrics</li>
                    <li>Issue status and progress tracking</li>
                    <li>Kanban board view with real-time updates</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="github" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>GitHub Integration</CardTitle>
                      <CardDescription>Connect to your GitHub repository to track development progress</CardDescription>
                    </div>
                    {githubConnected ? (
                      <Badge variant="outline" className="border-success/50 bg-success/10 text-success">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Connected
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-muted-foreground/50 bg-muted text-muted-foreground">
                        <XCircle className="mr-1 h-3 w-3" />
                        Not Connected
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="github-token">Personal Access Token</Label>
                    <Input
                      id="github-token"
                      type="password"
                      placeholder="ghp_xxxxxxxxxxxx"
                      value={githubConfig.token}
                      onChange={(e) => setGithubConfig({ ...githubConfig, token: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Generate a token from{" "}
                      <a
                        href="https://github.com/settings/tokens"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        GitHub Settings
                      </a>{" "}
                      with repo access
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="github-owner">Repository Owner</Label>
                    <Input
                      id="github-owner"
                      placeholder="username or organization"
                      value={githubConfig.owner}
                      onChange={(e) => setGithubConfig({ ...githubConfig, owner: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">GitHub username or organization name</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="github-repo">Repository Name</Label>
                    <Input
                      id="github-repo"
                      placeholder="repository-name"
                      value={githubConfig.repo}
                      onChange={(e) => setGithubConfig({ ...githubConfig, repo: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">The name of your GitHub repository</p>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={handleGithubTest}
                      disabled={!githubConfig.token || !githubConfig.owner || !githubConfig.repo || testingGithub}
                    >
                      {testingGithub && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Test Connection
                    </Button>
                    {githubConnected && (
                      <Button variant="outline" onClick={handleGithubDisconnect}>
                        Disconnect
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>How It Works</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>Once connected, you can track development activity from your GitHub repository:</p>
                  <ul className="list-inside list-disc space-y-1 pl-4">
                    <li>Pull requests and code reviews</li>
                    <li>Commit history and contributors</li>
                    <li>Branch status and deployment tracking</li>
                    <li>Issue linking and progress updates</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default function IntegrationPage() {
  return (
    <Suspense fallback={<IntegrationPageSkeleton />}>
      <IntegrationPageContent />
    </Suspense>
  )
}

function IntegrationPageSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-48 w-full" />
    </div>
  )
}
