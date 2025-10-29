"use client"

import { useState } from "react"
import { Sparkles, Brain, Zap, Target, TrendingUp, Search, Palette } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IntakeAnalysisPanel } from "@/components/intake-analysis-panel"
import { AIRepoResearcher } from "@/components/ai-repo-researcher"
import { AIDesignCopilot } from "@/components/ai-design-copilot"
import { getOpportunities, type Opportunity } from "@/lib/mock-data"

export default function AINuvioPage() {
  const opportunities = getOpportunities()
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(opportunities[0] || null)

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="mb-2 font-sans text-2xl font-semibold text-card-foreground">AI Nuvio</h1>
            <p className="text-sm text-muted-foreground">
              AI-powered agents for intelligent project lifecycle management
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI Powered</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <Tabs defaultValue="intake" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="intake" className="gap-2">
              <Brain className="h-4 w-4" />
              Intake Analyst
            </TabsTrigger>
            <TabsTrigger value="researcher" className="gap-2">
              <Search className="h-4 w-4" />
              AI Repo Researcher
            </TabsTrigger>
            <TabsTrigger value="design" className="gap-2">
              <Palette className="h-4 w-4" />
              AI Design Copilot
            </TabsTrigger>
          </TabsList>

          {/* Intake Analyst Tab */}
          <TabsContent value="intake" className="space-y-6">
            {/* Overview Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card className="border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Brain className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Agent Type</div>
                      <div className="font-semibold text-foreground">Intake Analysis</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-success/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-success/10 p-2">
                      <Zap className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">AI Model</div>
                      <div className="font-semibold text-foreground">GPT-4o Mini</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-info/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-info/10 p-2">
                      <Target className="h-5 w-5 text-info" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Analysis Type</div>
                      <div className="font-semibold text-foreground">Structured</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-warning/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-warning/10 p-2">
                      <TrendingUp className="h-5 w-5 text-warning" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Capabilities</div>
                      <div className="font-semibold text-foreground">Multi-metric</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle>About Intake Analyst</CardTitle>
                <CardDescription>AI-powered opportunity evaluation and analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="mb-2 font-semibold text-foreground">What It Does</h4>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    The Intake Analysis Agent uses advanced AI to evaluate new opportunities by analyzing problem
                    statements, business value, and technical requirements. It provides structured insights including
                    risk assessment, priority recommendations, resource estimates, and actionable recommendations.
                  </p>
                </div>

                <div>
                  <h4 className="mb-2 font-semibold text-foreground">Key Features</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>Structured analysis with 10+ evaluation metrics</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>Risk assessment and priority recommendations</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>Resource requirement estimation (team size, duration, skills)</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>Executive summary generation for stakeholders</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Opportunity Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Try It Out</CardTitle>
                <CardDescription>Select an opportunity to analyze with the AI agent</CardDescription>
              </CardHeader>
              <CardContent>
                <Select
                  value={selectedOpportunity?.id}
                  onValueChange={(id) => {
                    const opp = opportunities.find((o) => o.id === id)
                    setSelectedOpportunity(opp || null)
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select an opportunity" />
                  </SelectTrigger>
                  <SelectContent>
                    {opportunities.map((opp) => (
                      <SelectItem key={opp.id} value={opp.id}>
                        {opp.name} ({opp.id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Analysis Panel */}
            {selectedOpportunity && <IntakeAnalysisPanel opportunity={selectedOpportunity} />}
          </TabsContent>

          {/* AI Repo Researcher Tab */}
          <TabsContent value="researcher" className="space-y-6">
            <AIRepoResearcher opportunity={selectedOpportunity} />
          </TabsContent>

          {/* AI Design Copilot Tab */}
          <TabsContent value="design" className="space-y-6">
            <AIDesignCopilot opportunity={selectedOpportunity} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
