"use client"

import { useState } from "react"
import { Sparkles, TrendingUp, AlertTriangle, CheckCircle2, Users, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
// import { analyzeOpportunity, generateAnalysisSummary, type IntakeAnalysis } from "@/lib/agents/intake-analysis-agent"
import type { Opportunity } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"

type IntakeAnalysis = {
  overallScore: number
  riskLevel: "low" | "medium" | "high"
  recommendedPriority: "low" | "medium" | "high"
  keyInsights: string[]
  potentialChallenges: string[]
  recommendations: string[]
  estimatedComplexity: "low" | "medium" | "high"
  businessValueScore: number
  technicalFeasibilityScore: number
  resourceRequirements: {
    estimatedTeamSize: number
    estimatedDuration: string
    skillsRequired: string[]
  }
}

interface IntakeAnalysisPanelProps {
  opportunity: Opportunity
}

export function IntakeAnalysisPanel({ opportunity }: IntakeAnalysisPanelProps) {
  const [analysis, setAnalysis] = useState<IntakeAnalysis | null>(null)
  const [summary, setSummary] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const { toast } = useToast()

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    try {
      const { analyzeOpportunity, generateAnalysisSummary } = await import("@/lib/agents/intake-analysis-agent")

      const result = await analyzeOpportunity(opportunity)
      setAnalysis(result)

      const summaryText = await generateAnalysisSummary(opportunity, result)
      setSummary(summaryText)

      toast({
        title: "Analysis Complete",
        description: "AI-powered intake analysis has been generated successfully.",
      })
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze opportunity. Please try again.",
        variant: "destructive",
      })
      console.error("Analysis error:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-success/10 text-success border-success/20"
      case "medium":
        return "bg-warning/10 text-warning border-warning/20"
      case "high":
        return "bg-danger/10 text-danger border-danger/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-danger/10 text-danger border-danger/20"
      case "medium":
        return "bg-warning/10 text-warning border-warning/20"
      case "low":
        return "bg-success/10 text-success border-success/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "low":
        return "bg-success/10 text-success border-success/20"
      case "medium":
        return "bg-info/10 text-info border-info/20"
      case "high":
        return "bg-warning/10 text-warning border-warning/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-gradient-to-br from-card to-card/50">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI Intake Analysis
              </CardTitle>
              <CardDescription>AutoGen-powered analysis for opportunity evaluation and insights</CardDescription>
            </div>
            <Button onClick={handleAnalyze} disabled={isAnalyzing} size="sm">
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Run Analysis
                </>
              )}
            </Button>
          </div>
        </CardHeader>

        {analysis && (
          <CardContent className="space-y-6">
            {/* Executive Summary */}
            {summary && (
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <h4 className="mb-2 font-semibold text-foreground">Executive Summary</h4>
                <p className="text-sm leading-relaxed text-muted-foreground">{summary}</p>
              </div>
            )}

            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Overall Score</span>
                      <TrendingUp className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-3xl font-bold text-foreground">{analysis.overallScore}</div>
                    <Progress value={analysis.overallScore} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Business Value</span>
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    </div>
                    <div className="text-3xl font-bold text-foreground">{analysis.businessValueScore}/10</div>
                    <Progress value={analysis.businessValueScore * 10} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Feasibility</span>
                      <AlertTriangle className="h-4 w-4 text-info" />
                    </div>
                    <div className="text-3xl font-bold text-foreground">{analysis.technicalFeasibilityScore}/10</div>
                    <Progress value={analysis.technicalFeasibilityScore * 10} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Assessment Badges */}
            <div className="flex flex-wrap gap-3">
              <Badge variant="outline" className={getRiskColor(analysis.riskLevel)}>
                Risk: {analysis.riskLevel.toUpperCase()}
              </Badge>
              <Badge variant="outline" className={getPriorityColor(analysis.recommendedPriority)}>
                Priority: {analysis.recommendedPriority.toUpperCase()}
              </Badge>
              <Badge variant="outline" className={getComplexityColor(analysis.estimatedComplexity)}>
                Complexity: {analysis.estimatedComplexity.toUpperCase()}
              </Badge>
            </div>

            <Separator />

            {/* Resource Requirements */}
            <div className="space-y-3">
              <h4 className="flex items-center gap-2 font-semibold text-foreground">
                <Users className="h-4 w-4" />
                Resource Requirements
              </h4>
              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-lg border border-border bg-muted/30 p-3">
                  <div className="text-xs text-muted-foreground">Team Size</div>
                  <div className="mt-1 text-lg font-semibold text-foreground">
                    {analysis.resourceRequirements.estimatedTeamSize} people
                  </div>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-3">
                  <div className="text-xs text-muted-foreground">Duration</div>
                  <div className="mt-1 text-lg font-semibold text-foreground">
                    {analysis.resourceRequirements.estimatedDuration}
                  </div>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-3">
                  <div className="text-xs text-muted-foreground">Skills Required</div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {analysis.resourceRequirements.skillsRequired.slice(0, 2).map((skill, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {analysis.resourceRequirements.skillsRequired.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{analysis.resourceRequirements.skillsRequired.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Key Insights */}
            <div className="space-y-3">
              <h4 className="flex items-center gap-2 font-semibold text-foreground">
                <TrendingUp className="h-4 w-4" />
                Key Insights
              </h4>
              <ul className="space-y-2">
                {analysis.keyInsights.map((insight, i) => (
                  <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" />
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            {/* Potential Challenges */}
            <div className="space-y-3">
              <h4 className="flex items-center gap-2 font-semibold text-foreground">
                <AlertTriangle className="h-4 w-4" />
                Potential Challenges
              </h4>
              <ul className="space-y-2">
                {analysis.potentialChallenges.map((challenge, i) => (
                  <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                    <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-warning" />
                    <span>{challenge}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            {/* Recommendations */}
            <div className="space-y-3">
              <h4 className="flex items-center gap-2 font-semibold text-foreground">
                <Sparkles className="h-4 w-4" />
                Recommendations
              </h4>
              <ul className="space-y-2">
                {analysis.recommendations.map((rec, i) => (
                  <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                    <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
