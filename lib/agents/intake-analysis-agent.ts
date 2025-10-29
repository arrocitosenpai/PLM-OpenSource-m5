"use server"

import { generateText, generateObject } from "ai"
import { z } from "zod"
import type { Opportunity } from "@/lib/mock-data"

// Schema for structured analysis output
const IntakeAnalysisSchema = z.object({
  overallScore: z.number().min(0).max(100).describe("Overall opportunity score from 0-100"),
  riskLevel: z.enum(["low", "medium", "high"]).describe("Risk assessment level"),
  recommendedPriority: z.enum(["low", "medium", "high"]).describe("Recommended priority level"),
  keyInsights: z.array(z.string()).describe("Key insights about the opportunity"),
  potentialChallenges: z.array(z.string()).describe("Potential challenges or blockers"),
  recommendations: z.array(z.string()).describe("Actionable recommendations"),
  estimatedComplexity: z.enum(["low", "medium", "high"]).describe("Technical complexity estimate"),
  businessValueScore: z.number().min(0).max(10).describe("Business value score from 0-10"),
  technicalFeasibilityScore: z.number().min(0).max(10).describe("Technical feasibility score from 0-10"),
  resourceRequirements: z.object({
    estimatedTeamSize: z.number().describe("Estimated team size needed"),
    estimatedDuration: z.string().describe("Estimated duration (e.g., '4-6 weeks')"),
    skillsRequired: z.array(z.string()).describe("Key skills required"),
  }),
})

export type IntakeAnalysis = z.infer<typeof IntakeAnalysisSchema>

/**
 * Intake Analysis Agent
 * Analyzes new opportunities and provides structured insights
 */
export async function analyzeOpportunity(opportunity: Opportunity): Promise<IntakeAnalysis> {
  console.log("[v0] Starting intake analysis for:", opportunity.id)

  try {
    // Generate structured analysis using AI
    const { object } = await generateObject({
      model: "openai/gpt-4o-mini",
      schema: IntakeAnalysisSchema,
      prompt: `You are an expert project intake analyst. Analyze the following opportunity and provide detailed insights.

Opportunity Details:
- ID: ${opportunity.id}
- Name: ${opportunity.name}
- Function: ${opportunity.function}
- Current Stage: ${opportunity.currentStage}
- Priority: ${opportunity.priority}
- Problem Statement: ${opportunity.problemStatement}
- Business Sponsor: ${opportunity.businessSponsor}
- Business Team: ${opportunity.businessTeam}
- Business Value: ${opportunity.businessValue}
- Quality Value: ${opportunity.qualityValue}

Analyze this opportunity considering:
1. Business value and impact
2. Technical complexity and feasibility
3. Resource requirements
4. Potential risks and challenges
5. Strategic alignment
6. Implementation considerations

Provide a comprehensive analysis with actionable insights and recommendations.`,
    })

    console.log("[v0] Analysis completed successfully")
    return object
  } catch (error) {
    console.error("[v0] Error analyzing opportunity:", error)
    throw new Error("Failed to analyze opportunity")
  }
}

/**
 * Generate a summary report for the opportunity
 */
export async function generateAnalysisSummary(opportunity: Opportunity, analysis: IntakeAnalysis): Promise<string> {
  console.log("[v0] Generating analysis summary")

  try {
    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `Create a concise executive summary (2-3 paragraphs) for the following opportunity analysis:

Opportunity: ${opportunity.name} (${opportunity.id})
Overall Score: ${analysis.overallScore}/100
Risk Level: ${analysis.riskLevel}
Recommended Priority: ${analysis.recommendedPriority}

Key Insights:
${analysis.keyInsights.map((insight) => `- ${insight}`).join("\n")}

Recommendations:
${analysis.recommendations.map((rec) => `- ${rec}`).join("\n")}

Write a professional summary that highlights the most important findings and recommendations.`,
    })

    return text
  } catch (error) {
    console.error("[v0] Error generating summary:", error)
    throw new Error("Failed to generate summary")
  }
}

/**
 * Batch analyze multiple opportunities
 */
export async function batchAnalyzeOpportunities(opportunities: Opportunity[]): Promise<Map<string, IntakeAnalysis>> {
  console.log("[v0] Starting batch analysis for", opportunities.length, "opportunities")

  const results = new Map<string, IntakeAnalysis>()

  // Process opportunities in parallel (limit to 3 concurrent to avoid rate limits)
  const batchSize = 3
  for (let i = 0; i < opportunities.length; i += batchSize) {
    const batch = opportunities.slice(i, i + batchSize)
    const analyses = await Promise.all(batch.map((opp) => analyzeOpportunity(opp)))

    batch.forEach((opp, index) => {
      results.set(opp.id, analyses[index])
    })
  }

  console.log("[v0] Batch analysis completed")
  return results
}
