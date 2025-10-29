"use client"

import { useState } from "react"
import { Palette, Wand2, Layout, Type, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import type { Opportunity } from "@/lib/mock-data"

interface AIDesignCopilotProps {
  opportunity: Opportunity | null
}

export function AIDesignCopilot({ opportunity }: AIDesignCopilotProps) {
  const [designPrompt, setDesignPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [designSuggestions, setDesignSuggestions] = useState<any>(null)

  const handleGenerate = async () => {
    if (!designPrompt.trim()) return

    setIsGenerating(true)
    // Simulate AI design generation
    setTimeout(() => {
      setDesignSuggestions({
        colorPalette: {
          primary: "#3b82f6",
          secondary: "#8b5cf6",
          accent: "#10b981",
          neutral: "#64748b",
        },
        typography: {
          heading: "Inter, sans-serif",
          body: "Inter, sans-serif",
          scale: "1.25 (Major Third)",
        },
        layout: {
          type: "Dashboard Layout",
          grid: "12-column responsive grid",
          spacing: "8px base unit",
        },
        components: [
          "Navigation sidebar with collapsible menu",
          "Card-based content sections",
          "Data visualization charts",
          "Action buttons with primary/secondary hierarchy",
          "Form inputs with validation states",
        ],
        designSystem: {
          borderRadius: "8px",
          shadows: "Subtle elevation system (3 levels)",
          animations: "Smooth transitions (200-300ms)",
        },
      })
      setIsGenerating(false)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-purple-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-500/10 p-2">
                <Palette className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Agent Type</div>
                <div className="font-semibold text-foreground">Design Assistant</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-pink-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-pink-500/10 p-2">
                <Wand2 className="h-5 w-5 text-pink-500" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">AI Model</div>
                <div className="font-semibold text-foreground">GPT-4o</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-indigo-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-indigo-500/10 p-2">
                <Layout className="h-5 w-5 text-indigo-500" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Output Type</div>
                <div className="font-semibold text-foreground">Design System</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* About Section */}
      <Card>
        <CardHeader>
          <CardTitle>About AI Design Copilot</CardTitle>
          <CardDescription>Intelligent design system generation and UI recommendations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="mb-2 font-semibold text-foreground">What It Does</h4>
            <p className="text-sm leading-relaxed text-muted-foreground">
              The AI Design Copilot analyzes your product requirements and generates comprehensive design
              recommendations including color palettes, typography systems, layout structures, and component
              specifications tailored to your project needs.
            </p>
          </div>

          <div>
            <h4 className="mb-2 font-semibold text-foreground">Key Features</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Automated color palette generation with accessibility compliance</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Typography system recommendations with scale ratios</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Layout structure and grid system suggestions</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Component library recommendations</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Design system specifications (spacing, shadows, animations)</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Design Prompt */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Design Recommendations</CardTitle>
          <CardDescription>
            {opportunity ? `Creating design system for: ${opportunity.name}` : "Describe your design requirements"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Describe your design needs... (e.g., 'Modern dashboard for analytics platform with dark mode support, professional look, data-heavy interface')"
            value={designPrompt}
            onChange={(e) => setDesignPrompt(e.target.value)}
            rows={4}
            className="resize-none"
          />
          <Button onClick={handleGenerate} disabled={isGenerating || !designPrompt.trim()} className="w-full">
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating design recommendations...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate Design System
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Design Suggestions */}
      {designSuggestions && (
        <>
          {/* Color Palette */}
          <Card>
            <CardHeader>
              <CardTitle>Color Palette</CardTitle>
              <CardDescription>Recommended color system for your project</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                {Object.entries(designSuggestions.colorPalette).map(([name, color]) => (
                  <div key={name} className="space-y-2">
                    <div
                      className="h-20 rounded-lg border border-border"
                      style={{ backgroundColor: color as string }}
                    />
                    <div>
                      <div className="text-sm font-medium capitalize text-foreground">{name}</div>
                      <div className="font-mono text-xs text-muted-foreground">{color as string}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Typography */}
          <Card>
            <CardHeader>
              <CardTitle>Typography System</CardTitle>
              <CardDescription>Font families and type scale recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-border p-4">
                  <div className="mb-1 flex items-center gap-2">
                    <Type className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">Heading Font</span>
                  </div>
                  <div className="text-lg font-semibold" style={{ fontFamily: "Inter, sans-serif" }}>
                    {designSuggestions.typography.heading}
                  </div>
                </div>
                <div className="rounded-lg border border-border p-4">
                  <div className="mb-1 flex items-center gap-2">
                    <Type className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">Body Font</span>
                  </div>
                  <div className="text-lg" style={{ fontFamily: "Inter, sans-serif" }}>
                    {designSuggestions.typography.body}
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-border p-4">
                <span className="text-sm font-medium text-foreground">Type Scale: </span>
                <span className="text-sm text-muted-foreground">{designSuggestions.typography.scale}</span>
              </div>
            </CardContent>
          </Card>

          {/* Layout */}
          <Card>
            <CardHeader>
              <CardTitle>Layout Structure</CardTitle>
              <CardDescription>Grid system and spacing recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <span className="text-sm font-medium text-foreground">Layout Type</span>
                <Badge>{designSuggestions.layout.type}</Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <span className="text-sm font-medium text-foreground">Grid System</span>
                <span className="text-sm text-muted-foreground">{designSuggestions.layout.grid}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <span className="text-sm font-medium text-foreground">Spacing Unit</span>
                <span className="text-sm text-muted-foreground">{designSuggestions.layout.spacing}</span>
              </div>
            </CardContent>
          </Card>

          {/* Components */}
          <Card>
            <CardHeader>
              <CardTitle>Recommended Components</CardTitle>
              <CardDescription>UI components to include in your design system</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {designSuggestions.components.map((component: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-success">✓</span>
                    <span>{component}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Design System Specs */}
          <Card>
            <CardHeader>
              <CardTitle>Design System Specifications</CardTitle>
              <CardDescription>Additional design tokens and guidelines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <span className="text-sm font-medium text-foreground">Border Radius</span>
                <span className="text-sm text-muted-foreground">{designSuggestions.designSystem.borderRadius}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <span className="text-sm font-medium text-foreground">Shadow System</span>
                <span className="text-sm text-muted-foreground">{designSuggestions.designSystem.shadows}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <span className="text-sm font-medium text-foreground">Animations</span>
                <span className="text-sm text-muted-foreground">{designSuggestions.designSystem.animations}</span>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
