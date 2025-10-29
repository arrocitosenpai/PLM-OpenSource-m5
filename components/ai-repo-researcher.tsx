"use client"

import { useState } from "react"
import { Search, FileCode, Package, AlertTriangle, ExternalLink, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Opportunity } from "@/lib/mock-data"

interface AIRepoResearcherProps {
  opportunity: Opportunity | null
}

export function AIRepoResearcher({ opportunity }: AIRepoResearcherProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<any>(null)

  const handleAnalyze = async () => {
    if (!opportunity) return

    setIsAnalyzing(true)
    // Simulate AI analysis
    setTimeout(() => {
      setResults({
        similarProjects: [
          {
            name: "Customer Portal v2",
            similarity: 85,
            repo: "github.com/company/customer-portal",
            description: "Similar authentication and dashboard requirements",
          },
          {
            name: "Analytics Dashboard",
            similarity: 72,
            repo: "github.com/company/analytics-dash",
            description: "Reusable chart components and data visualization",
          },
        ],
        reusableComponents: [
          {
            name: "AuthenticationModule",
            path: "/shared/auth",
            description: "OAuth2 + JWT authentication with role-based access",
            confidence: "High",
          },
          {
            name: "DataTableComponent",
            path: "/components/data-table",
            description: "Sortable, filterable table with pagination",
            confidence: "High",
          },
          {
            name: "NotificationService",
            path: "/services/notifications",
            description: "Real-time notification system with WebSocket support",
            confidence: "Medium",
          },
        ],
        risks: [
          {
            type: "Technical Debt",
            severity: "Medium",
            description: "Legacy authentication system needs migration before reuse",
            mitigation: "Plan 2-week refactoring sprint before integration",
          },
          {
            type: "Dependency Conflict",
            severity: "Low",
            description: "React version mismatch in reusable components",
            mitigation: "Update dependencies or use compatibility layer",
          },
        ],
        backlogInsights: {
          relatedTickets: 8,
          estimatedEffort: "3-4 weeks",
          teamExperience: "High - team has built similar features 3 times",
        },
      })
      setIsAnalyzing(false)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-info/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-info/10 p-2">
                <Search className="h-5 w-5 text-info" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Agent Type</div>
                <div className="font-semibold text-foreground">Repository Research</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-success/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-success/10 p-2">
                <FileCode className="h-5 w-5 text-success" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Data Sources</div>
                <div className="font-semibold text-foreground">Multi-source</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-warning/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-warning/10 p-2">
                <Package className="h-5 w-5 text-warning" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Output Type</div>
                <div className="font-semibold text-foreground">Actionable Insights</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* About Section */}
      <Card>
        <CardHeader>
          <CardTitle>About AI Repo Researcher</CardTitle>
          <CardDescription>Intelligent code repository and project analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="mb-2 font-semibold text-foreground">What It Does</h4>
            <p className="text-sm leading-relaxed text-muted-foreground">
              The AI Repo Researcher scans your Product Design Documents, product page data, code repositories, and
              backlog tickets to identify similar past projects, find reusable components, and surface potential risks
              before development begins.
            </p>
          </div>

          <div>
            <h4 className="mb-2 font-semibold text-foreground">Data Sources</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Product Design Documents (PDD)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Product page data and requirements</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Code repositories and component libraries</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Backlog tickets and historical project data</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-2 font-semibold text-foreground">Outputs</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-success">✓</span>
                <span>Links to relevant code and documentation</span>
              </li>
              <li className="flex gap-2">
                <span className="text-success">✓</span>
                <span>List of reusable modules and components</span>
              </li>
              <li className="flex gap-2">
                <span className="text-success">✓</span>
                <span>Risk warnings and mitigation strategies</span>
              </li>
              <li className="flex gap-2">
                <span className="text-success">✓</span>
                <span>Similar project references and lessons learned</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Section */}
      {opportunity ? (
        <Card>
          <CardHeader>
            <CardTitle>Analyze Repository</CardTitle>
            <CardDescription>
              Analyzing: <span className="font-semibold text-foreground">{opportunity.name}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full">
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing repositories and backlog...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Start Repository Analysis
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm text-muted-foreground">Select an opportunity to begin repository analysis</p>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {results && (
        <>
          {/* Similar Projects */}
          <Card>
            <CardHeader>
              <CardTitle>Similar Past Projects</CardTitle>
              <CardDescription>Projects with comparable requirements and implementations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {results.similarProjects.map((project: any, index: number) => (
                <div key={index} className="flex items-start justify-between rounded-lg border border-border p-4">
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <h4 className="font-semibold text-foreground">{project.name}</h4>
                      <Badge variant="secondary">{project.similarity}% match</Badge>
                    </div>
                    <p className="mb-2 text-sm text-muted-foreground">{project.description}</p>
                    <a
                      href={`https://${project.repo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      {project.repo}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Reusable Components */}
          <Card>
            <CardHeader>
              <CardTitle>Reusable Components</CardTitle>
              <CardDescription>Existing modules that can accelerate development</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {results.reusableComponents.map((component: any, index: number) => (
                <div key={index} className="flex items-start justify-between rounded-lg border border-border p-4">
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <Package className="h-4 w-4 text-success" />
                      <h4 className="font-semibold text-foreground">{component.name}</h4>
                      <Badge variant={component.confidence === "High" ? "default" : "secondary"}>
                        {component.confidence} confidence
                      </Badge>
                    </div>
                    <p className="mb-1 text-sm text-muted-foreground">{component.description}</p>
                    <code className="text-xs text-info">{component.path}</code>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Risk Warnings */}
          <Card>
            <CardHeader>
              <CardTitle>Risk Warnings</CardTitle>
              <CardDescription>Potential issues and recommended mitigations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {results.risks.map((risk: any, index: number) => (
                <div key={index} className="rounded-lg border border-warning/20 bg-warning/5 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    <h4 className="font-semibold text-foreground">{risk.type}</h4>
                    <Badge variant={risk.severity === "High" ? "destructive" : "secondary"}>{risk.severity}</Badge>
                  </div>
                  <p className="mb-2 text-sm text-muted-foreground">{risk.description}</p>
                  <div className="rounded bg-background/50 p-2">
                    <p className="text-xs font-medium text-foreground">Mitigation:</p>
                    <p className="text-xs text-muted-foreground">{risk.mitigation}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Backlog Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Backlog Insights</CardTitle>
              <CardDescription>Historical data and team experience</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-border p-4">
                  <div className="text-2xl font-bold text-foreground">{results.backlogInsights.relatedTickets}</div>
                  <div className="text-sm text-muted-foreground">Related Tickets</div>
                </div>
                <div className="rounded-lg border border-border p-4">
                  <div className="text-2xl font-bold text-foreground">{results.backlogInsights.estimatedEffort}</div>
                  <div className="text-sm text-muted-foreground">Estimated Effort</div>
                </div>
                <div className="rounded-lg border border-border p-4">
                  <div className="text-sm font-medium text-success">{results.backlogInsights.teamExperience}</div>
                  <div className="text-sm text-muted-foreground">Team Experience</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
