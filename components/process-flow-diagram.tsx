"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ZoomIn, ZoomOut, Maximize2 } from "lucide-react"

export function ProcessFlowDiagram() {
  const [openAgents, setOpenAgents] = useState<string[]>([])
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const toggleAgent = (agentId: string) => {
    setOpenAgents((prev) => (prev.includes(agentId) ? prev.filter((id) => id !== agentId) : [...prev, agentId]))
  }

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.2, 3))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.2, 0.5))
  }

  const handleResetZoom = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        const delta = e.deltaY > 0 ? -0.1 : 0.1
        setZoom((prev) => Math.max(0.5, Math.min(3, prev + delta)))
      }
    }

    container.addEventListener("wheel", handleWheel, { passive: false })
    return () => container.removeEventListener("wheel", handleWheel)
  }, [])

  return (
    <div className="space-y-8">
      {/* Diagram Section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Product Delivery Flow</h2>
          <p className="text-muted-foreground">
            End-to-end opportunity lifecycle with approval gates, AI agents, and feedback loops
          </p>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Button variant="outline" size="sm" onClick={handleZoomOut} disabled={zoom <= 0.5}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleResetZoom}>
            <Maximize2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleZoomIn} disabled={zoom >= 3}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground ml-2">{Math.round(zoom * 100)}%</span>
          {zoom > 1 && <span className="text-xs text-muted-foreground ml-2">(Drag to pan, Ctrl+Scroll to zoom)</span>}
        </div>

        <div
          ref={containerRef}
          className="rounded-lg border border-border bg-card p-8 overflow-hidden cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ touchAction: "none" }}
        >
          <div
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: "0 0",
              transition: isDragging ? "none" : "transform 0.1s ease-out",
            }}
          >
            <svg
              viewBox="0 0 1600 1000"
              className="w-full"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Nuvio product delivery architecture with approval gates and AI agents"
            >
              <defs>
                {/* Arrow markers */}
                <marker
                  id="arrowSolid"
                  markerWidth="10"
                  markerHeight="10"
                  refX="9"
                  refY="3"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <path d="M0,0 L0,6 L9,3 z" fill="#60a5fa" />
                </marker>
                <marker
                  id="arrowDotted"
                  markerWidth="10"
                  markerHeight="10"
                  refX="9"
                  refY="3"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <path d="M0,0 L0,6 L9,3 z" fill="#a78bfa" />
                </marker>
              </defs>

              {/* TOP ROW */}

              {/* Intake */}
              <rect x="50" y="50" width="280" height="140" fill="#1a1a1a" stroke="#3b82f6" strokeWidth="2" rx="12" />
              <text x="190" y="85" textAnchor="middle" fill="#3b82f6" fontSize="18" fontWeight="bold">
                Intake ✦
              </text>
              <text x="190" y="110" textAnchor="middle" fill="#a3a3a3" fontSize="11">
                Opportunity submitted
              </text>
              <text x="190" y="128" textAnchor="middle" fill="#a3a3a3" fontSize="11">
                AI pre-analysis
              </text>
              <text x="190" y="146" textAnchor="middle" fill="#a3a3a3" fontSize="11">
                Categorization
              </text>
              <text x="190" y="164" textAnchor="middle" fill="#a3a3a3" fontSize="11">
                Priority
              </text>

              {/* Arrow: Intake → Product */}
              <path d="M 330 120 L 420 120" stroke="#60a5fa" strokeWidth="2.5" markerEnd="url(#arrowSolid)" />
              <text x="375" y="110" textAnchor="middle" fill="#60a5fa" fontSize="10" fontWeight="600">
                Handoff: Intake → Product
              </text>
              <rect x="345" y="125" width="60" height="16" fill="#3b82f6" rx="8" />
              <text x="375" y="136" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="600">
                Approved
              </text>

              {/* Product */}
              <rect x="420" y="50" width="280" height="140" fill="#1a1a1a" stroke="#10b981" strokeWidth="2" rx="12" />
              <text x="560" y="85" textAnchor="middle" fill="#10b981" fontSize="18" fontWeight="bold">
                Product ✦
              </text>
              <text x="560" y="110" textAnchor="middle" fill="#a3a3a3" fontSize="11">
                Requirements
              </text>
              <text x="560" y="128" textAnchor="middle" fill="#a3a3a3" fontSize="11">
                Business case
              </text>
              <text x="560" y="146" textAnchor="middle" fill="#a3a3a3" fontSize="11">
                Stakeholder alignment
              </text>
              <text x="560" y="164" textAnchor="middle" fill="#a3a3a3" fontSize="11">
                Scope
              </text>

              {/* Arrow: Product → Engineering */}
              <path d="M 560 190 L 560 280" stroke="#10b981" strokeWidth="2.5" markerEnd="url(#arrowSolid)" />
              <text x="580" y="240" fill="#10b981" fontSize="10" fontWeight="600">
                Gate: Product
              </text>
              <text x="580" y="252" fill="#10b981" fontSize="10" fontWeight="600">
                Approved
              </text>

              {/* Feedback: Analytics → Product */}
              <path
                d="M 800 750 Q 800 400 560 220"
                stroke="#a78bfa"
                strokeWidth="2"
                strokeDasharray="5,5"
                fill="none"
                markerEnd="url(#arrowDotted)"
              />
              <text x="720" y="450" fill="#a78bfa" fontSize="10" fontWeight="600">
                Insights →
              </text>
              <text x="720" y="462" fill="#a78bfa" fontSize="10" fontWeight="600">
                Rescope
              </text>

              {/* Engineering */}
              <rect x="420" y="280" width="280" height="140" fill="#1a1a1a" stroke="#8b5cf6" strokeWidth="2" rx="12" />
              <text x="560" y="315" textAnchor="middle" fill="#8b5cf6" fontSize="18" fontWeight="bold">
                Engineering ✦
              </text>
              <text x="560" y="340" textAnchor="middle" fill="#a3a3a3" fontSize="11">
                Tech design
              </text>
              <text x="560" y="358" textAnchor="middle" fill="#a3a3a3" fontSize="11">
                Architecture review
              </text>
              <text x="560" y="376" textAnchor="middle" fill="#a3a3a3" fontSize="11">
                Feasibility
              </text>
              <text x="560" y="394" textAnchor="middle" fill="#a3a3a3" fontSize="11">
                Estimation
              </text>

              {/* Arrow: Engineering → Platform */}
              <path d="M 700 350 L 790 350" stroke="#8b5cf6" strokeWidth="2.5" markerEnd="url(#arrowSolid)" />
              <text x="745" y="340" textAnchor="middle" fill="#8b5cf6" fontSize="10" fontWeight="600">
                Gate: Design Ready
              </text>

              {/* Platform */}
              <rect x="790" y="280" width="280" height="140" fill="#1a1a1a" stroke="#f59e0b" strokeWidth="2" rx="12" />
              <text x="930" y="315" textAnchor="middle" fill="#f59e0b" fontSize="18" fontWeight="bold">
                Platform ✦
              </text>
              <text x="930" y="340" textAnchor="middle" fill="#a3a3a3" fontSize="11">
                Infra setup
              </text>
              <text x="930" y="358" textAnchor="middle" fill="#a3a3a3" fontSize="11">
                Security review
              </text>
              <text x="930" y="376" textAnchor="middle" fill="#a3a3a3" fontSize="11">
                Compliance
              </text>
              <text x="930" y="394" textAnchor="middle" fill="#a3a3a3" fontSize="11">
                Env provisioning
              </text>

              {/* Arrow: Platform → Implementation */}
              <path d="M 930 420 L 930 510" stroke="#f59e0b" strokeWidth="2.5" markerEnd="url(#arrowSolid)" />
              <text x="950" y="470" fill="#f59e0b" fontSize="10" fontWeight="600">
                Gate: Infra
              </text>
              <text x="950" y="482" fill="#f59e0b" fontSize="10" fontWeight="600">
                Ready
              </text>

              {/* BOTTOM ROW */}

              {/* Implementation */}
              <rect x="790" y="510" width="280" height="140" fill="#1a1a1a" stroke="#06b6d4" strokeWidth="2" rx="12" />
              <text x="930" y="545" textAnchor="middle" fill="#06b6d4" fontSize="18" fontWeight="bold">
                Implementation ✦
              </text>
              <text x="930" y="570" textAnchor="middle" fill="#a3a3a3" fontSize="11">
                Build • Test • QA
              </text>
              <text x="930" y="588" textAnchor="middle" fill="#a3a3a3" fontSize="11">
                UAT
              </text>
              <text x="930" y="606" textAnchor="middle" fill="#a3a3a3" fontSize="11">
                Deployment
              </text>

              {/* Arrow: Implementation → Support */}
              <path d="M 790 580 L 700 580" stroke="#06b6d4" strokeWidth="2.5" markerEnd="url(#arrowSolid)" />
              <text x="745" y="570" textAnchor="middle" fill="#06b6d4" fontSize="10" fontWeight="600">
                Gate: Release Go
              </text>

              {/* Arrow: Implementation → Analytics */}
              <path
                d="M 930 650 L 930 680"
                stroke="#a78bfa"
                strokeWidth="2"
                strokeDasharray="5,5"
                markerEnd="url(#arrowDotted)"
              />

              {/* Support */}
              <rect x="420" y="510" width="280" height="140" fill="#1a1a1a" stroke="#ec4899" strokeWidth="2" rx="12" />
              <text x="560" y="545" textAnchor="middle" fill="#ec4899" fontSize="18" fontWeight="bold">
                Support ✦
              </text>
              <text x="560" y="570" textAnchor="middle" fill="#a3a3a3" fontSize="11">
                Monitoring
              </text>
              <text x="560" y="588" textAnchor="middle" fill="#a3a3a3" fontSize="11">
                Incident mgmt
              </text>
              <text x="560" y="606" textAnchor="middle" fill="#a3a3a3" fontSize="11">
                Training
              </text>
              <text x="560" y="624" textAnchor="middle" fill="#a3a3a3" fontSize="11">
                Continuous improvement
              </text>

              {/* Arrow: Support → Analytics */}
              <path
                d="M 560 650 Q 680 700 750 720"
                stroke="#a78bfa"
                strokeWidth="2"
                strokeDasharray="5,5"
                fill="none"
                markerEnd="url(#arrowDotted)"
              />
              <text x="620" y="690" fill="#a78bfa" fontSize="10" fontWeight="600">
                Events, issues, CSAT
              </text>

              {/* Analytics & Insights (center bottom) */}
              <rect x="750" y="680" width="380" height="120" fill="#1a1a1a" stroke="#a78bfa" strokeWidth="2" rx="12" />
              <text x="940" y="715" textAnchor="middle" fill="#a78bfa" fontSize="18" fontWeight="bold">
                Analytics & Insights ✦
              </text>
              <text x="940" y="740" textAnchor="middle" fill="#a3a3a3" fontSize="11">
                Telemetry • A/B results
              </text>
              <text x="940" y="758" textAnchor="middle" fill="#a3a3a3" fontSize="11">
                KPI impact
              </text>
              <text x="940" y="776" textAnchor="middle" fill="#a3a3a3" fontSize="11">
                Post-release reviews
              </text>

              {/* Feedback: Analytics → Engineering */}
              <path
                d="M 800 680 Q 700 600 560 420"
                stroke="#a78bfa"
                strokeWidth="2"
                strokeDasharray="5,5"
                fill="none"
                markerEnd="url(#arrowDotted)"
              />
              <text x="650" y="550" fill="#a78bfa" fontSize="10" fontWeight="600">
                Tech debt
              </text>

              {/* Legend */}
              <rect x="50" y="850" width="1020" height="120" fill="#0a0a0a" stroke="#3b82f6" strokeWidth="1.5" rx="8" />
              <text x="560" y="880" textAnchor="middle" fill="#3b82f6" fontSize="14" fontWeight="bold">
                Legend
              </text>

              {/* Solid arrow example */}
              <path d="M 80 905 L 140 905" stroke="#60a5fa" strokeWidth="2.5" markerEnd="url(#arrowSolid)" />
              <text x="150" y="910" fill="#a3a3a3" fontSize="11">
                Stage transition
              </text>

              {/* Dotted arrow example */}
              <path
                d="M 280 905 L 340 905"
                stroke="#a78bfa"
                strokeWidth="2"
                strokeDasharray="5,5"
                markerEnd="url(#arrowDotted)"
              />
              <text x="350" y="910" fill="#a3a3a3" fontSize="11">
                Feedback loop
              </text>

              {/* Gate badge example */}
              <rect x="480" y="897" width="60" height="16" fill="#3b82f6" rx="8" />
              <text x="510" y="908" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="600">
                Approved
              </text>
              <text x="550" y="910" fill="#a3a3a3" fontSize="11">
                Approval gate
              </text>

              {/* Agent badge example */}
              <text x="680" y="910" fill="#f59e0b" fontSize="16" fontWeight="bold">
                ✦
              </text>
              <text x="700" y="910" fill="#a3a3a3" fontSize="11">
                AI Agent present (click for details)
              </text>

              <text x="80" y="940" fill="#a3a3a3" fontSize="10">
                Approval Gates: Intake Approved → Product Approved → Design Ready → Infra Ready → Release Go →
                Stabilized
              </text>
              <text x="80" y="955" fill="#a3a3a3" fontSize="10">
                Feedback Loop: Implementation/Support → Analytics → Product/Engineering
              </text>
            </svg>
          </div>
        </div>
      </section>

      {/* Stage Cards */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">Stage Details with Approval Gates</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Intake */}
          <Card className="border-blue-500/50 bg-blue-500/5 p-6">
            <div className="mb-3 flex items-center gap-2">
              <h3 className="text-lg font-semibold text-blue-400">Intake</h3>
              <Badge variant="outline" className="border-blue-500/50 text-blue-400">
                ✦ AI Agent
              </Badge>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-medium text-foreground">Entry Criteria:</p>
                <p className="text-muted-foreground">New request submitted via form/Slack/CRM</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Exit Gate: "Intake Approved" → Product</p>
                <p className="text-muted-foreground">Request validated, categorized, and prioritized</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Artifacts:</p>
                <p className="text-muted-foreground">Request record, tags, owner, priority</p>
              </div>
              <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-3">
                <p className="font-medium text-blue-300">AI Agent: Intake Analyst</p>
                <p className="text-xs text-muted-foreground">
                  Parses submissions, deduplicates against history, extracts key fields, and proposes initial priority &
                  suggested team.
                </p>
              </div>
            </div>
          </Card>

          {/* Product */}
          <Card className="border-green-500/50 bg-green-500/5 p-6">
            <div className="mb-3 flex items-center gap-2">
              <h3 className="text-lg font-semibold text-green-400">Product</h3>
              <Badge variant="outline" className="border-green-500/50 text-green-400">
                ✦ AI Agent
              </Badge>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-medium text-foreground">Entry Criteria:</p>
                <p className="text-muted-foreground">Intake Approved</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Exit Gate: "Product Approved" → Engineering</p>
                <p className="text-muted-foreground">PRD complete with success metrics and acceptance criteria</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Artifacts:</p>
                <p className="text-muted-foreground">
                  PRD, success metrics (NSM + guardrails), user stories, risk register
                </p>
              </div>
              <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-3">
                <p className="font-medium text-green-300">AI Agent: Repo Researcher</p>
                <p className="text-xs text-muted-foreground">
                  Scans internal repos/backlog to find similar projects, reusable components, prior decisions, and
                  risks; links references in PRD.
                </p>
              </div>
            </div>
          </Card>

          {/* Engineering */}
          <Card className="border-purple-500/50 bg-purple-500/5 p-6">
            <div className="mb-3 flex items-center gap-2">
              <h3 className="text-lg font-semibold text-purple-400">Engineering</h3>
              <Badge variant="outline" className="border-purple-500/50 text-purple-400">
                ✦ AI Agent
              </Badge>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-medium text-foreground">Entry Criteria:</p>
                <p className="text-muted-foreground">Product Approved</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Exit Gate: "Design Ready" → Platform</p>
                <p className="text-muted-foreground">Architecture validated, estimates complete, dependencies mapped</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Artifacts:</p>
                <p className="text-muted-foreground">Solution design, ADRs, estimates, dependency map</p>
              </div>
              <div className="rounded-lg border border-purple-500/30 bg-purple-500/10 p-3">
                <p className="font-medium text-purple-300">AI Agent: Design Copilot</p>
                <p className="text-xs text-muted-foreground">
                  Validates architecture against standards, flags perf/security gaps, proposes ADR templates and test
                  strategy.
                </p>
              </div>
            </div>
          </Card>

          {/* Platform */}
          <Card className="border-orange-500/50 bg-orange-500/5 p-6">
            <div className="mb-3 flex items-center gap-2">
              <h3 className="text-lg font-semibold text-orange-400">Platform</h3>
              <Badge variant="outline" className="border-orange-500/50 text-orange-400">
                ✦ AI Agent
              </Badge>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-medium text-foreground">Entry Criteria:</p>
                <p className="text-muted-foreground">Design Ready</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Exit Gate: "Infra Ready" → Implementation</p>
                <p className="text-muted-foreground">Infrastructure provisioned, security/compliance signed off</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Artifacts:</p>
                <p className="text-muted-foreground">
                  Infra blueprint, environment credentials, security/compliance checklist
                </p>
              </div>
              <div className="rounded-lg border border-orange-500/30 bg-orange-500/10 p-3">
                <p className="font-medium text-orange-300">AI Agent: Platform Compliance</p>
                <p className="text-xs text-muted-foreground">
                  Checks IaC, policies, and secrets; provisions sandbox/staging; verifies monitoring hooks exist.
                </p>
              </div>
            </div>
          </Card>

          {/* Implementation */}
          <Card className="border-cyan-500/50 bg-cyan-500/5 p-6">
            <div className="mb-3 flex items-center gap-2">
              <h3 className="text-lg font-semibold text-cyan-400">Implementation</h3>
              <Badge variant="outline" className="border-cyan-500/50 text-cyan-400">
                ✦ AI Agent
              </Badge>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-medium text-foreground">Entry Criteria:</p>
                <p className="text-muted-foreground">Infra Ready</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Exit Gate: "Release Go" → Support</p>
                <p className="text-muted-foreground">All tests passed, release plan approved, rollback verified</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Artifacts:</p>
                <p className="text-muted-foreground">
                  Build artifacts, feature flag plan, test report, release plan, user docs
                </p>
              </div>
              <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-3">
                <p className="font-medium text-cyan-300">AI Agent: QA & Release Watcher</p>
                <p className="text-xs text-muted-foreground">
                  Generates test cases from AC, watches CI/CD, blocks release on critical issues, verifies kill-switch
                  works post-deploy.
                </p>
              </div>
            </div>
          </Card>

          {/* Support */}
          <Card className="border-pink-500/50 bg-pink-500/5 p-6">
            <div className="mb-3 flex items-center gap-2">
              <h3 className="text-lg font-semibold text-pink-400">Support</h3>
              <Badge variant="outline" className="border-pink-500/50 text-pink-400">
                ✦ AI Agent
              </Badge>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-medium text-foreground">Entry Criteria:</p>
                <p className="text-muted-foreground">Release Go</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Exit Gate: "Stabilized" (after N-day window)</p>
                <p className="text-muted-foreground">Continuous loop to Product & Analytics</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Artifacts:</p>
                <p className="text-muted-foreground">Runbooks, incident reports, training materials</p>
              </div>
              <div className="rounded-lg border border-pink-500/30 bg-pink-500/10 p-3">
                <p className="font-medium text-pink-300">AI Agent: Triage & Summarizer</p>
                <p className="text-xs text-muted-foreground">
                  Clusters tickets, surfaces top issues, drafts knowledge articles, and pushes themes to Product.
                </p>
              </div>
            </div>
          </Card>

          {/* Analytics & Insights */}
          <Card className="border-purple-500/50 bg-purple-500/5 p-6 md:col-span-2">
            <div className="mb-3 flex items-center gap-2">
              <h3 className="text-lg font-semibold text-purple-400">Analytics & Insights</h3>
              <Badge variant="outline" className="border-purple-500/50 text-purple-400">
                ✦ AI Agent
              </Badge>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-medium text-foreground">Entry Criteria:</p>
                <p className="text-muted-foreground">Events streaming post-deploy and from Support</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Exit Gate: "Insights Published" to Product/Eng</p>
                <p className="text-muted-foreground">Cadence: weekly/monthly</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Artifacts:</p>
                <p className="text-muted-foreground">KPI dashboard, experiment readouts, RCA docs</p>
              </div>
              <div className="rounded-lg border border-purple-500/30 bg-purple-500/10 p-3">
                <p className="font-medium text-purple-300">AI Agent: Analytics Synthesizer</p>
                <p className="text-xs text-muted-foreground">
                  Validates event coverage, computes impact vs targets, suggests next best actions and backlog updates.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Team Interactions & Handoffs */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">Team Interactions & Handoffs</h2>
        <Card className="p-6">
          <ol className="space-y-4">
            <li className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 font-semibold">
                1
              </span>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">Intake → Product (Gate: Intake Approved)</h4>
                <p className="text-sm text-muted-foreground">AI summary, dedupe verdict, initial priority</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-500/20 text-green-400 font-semibold">
                2
              </span>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">Product → Engineering (Gate: Product Approved)</h4>
                <p className="text-sm text-muted-foreground">PRD + AC + success metrics + Repo Research matches</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-purple-400 font-semibold">
                3
              </span>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">Engineering → Platform (Gate: Design Ready)</h4>
                <p className="text-sm text-muted-foreground">ADRs, infra needs, security/perf NFRs</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500/20 text-orange-400 font-semibold">
                4
              </span>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">Platform → Implementation (Gate: Infra Ready)</h4>
                <p className="text-sm text-muted-foreground">Credentials, environments, monitoring hooks validated</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400 font-semibold">
                5
              </span>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">Implementation → Support (Gate: Release Go)</h4>
                <p className="text-sm text-muted-foreground">Release notes, rollback plan, runbooks, training pack</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-purple-400 font-semibold">
                6
              </span>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">Feedback Loops (Continuous)</h4>
                <p className="text-sm text-muted-foreground">Analytics & Support insights feed Product/Engineering</p>
              </div>
            </li>
          </ol>
        </Card>
      </section>

      {/* Agent Directory */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">Agent Directory</h2>
        <div className="space-y-3">
          {[
            {
              id: "intake-analyst",
              name: "Intake Analyst",
              description: "NLP parsing, dedupe, routing, priority suggestion",
              inputs: "Raw submission text, form fields, user metadata",
              actions:
                "Parse natural language, extract entities, check for duplicates in history, classify by type, suggest priority and owner",
              outputs: "Structured request record, tags, suggested priority, recommended team",
              systems: "CRM, Slack API, Request Database",
            },
            {
              id: "repo-researcher",
              name: "Repo Researcher",
              description: "Code & ticket search for similar work, reusable modules, known pitfalls",
              inputs: "PRD draft, requirements, keywords",
              actions:
                "Search code repos, scan backlog/tickets, identify similar past projects, find reusable components, surface known risks",
              outputs: "Links to relevant code/docs, list of reusable modules, risk warnings",
              systems: "GitHub, GitLab, Jira, Confluence",
            },
            {
              id: "design-copilot",
              name: "Design Copilot",
              description: "Architecture linting (standards, NFRs), test strategy suggestions",
              inputs: "Technical design doc, architecture diagrams",
              actions:
                "Validate against architecture standards, check NFRs (performance, security), suggest ADR templates, propose test strategy",
              outputs: "Validation report, flagged gaps, ADR templates, test plan outline",
              systems: "Architecture Decision Records, Design Doc Repository",
            },
            {
              id: "platform-compliance",
              name: "Platform Compliance",
              description: "Policy checks (security, compliance), IaC validation, env provisioning readiness",
              inputs: "Infrastructure-as-Code files, security policies, compliance requirements",
              actions:
                "Lint IaC, verify secrets management, check compliance policies, provision sandbox/staging, validate monitoring hooks",
              outputs: "Compliance report, provisioned environments, monitoring setup confirmation",
              systems: "Terraform, AWS/Azure/GCP, Security Policy Engine",
            },
            {
              id: "qa-release-watcher",
              name: "QA & Release Watcher",
              description: "Generates test outlines from AC, monitors CI gates, verifies feature flags & rollback",
              inputs: "Acceptance criteria, CI/CD pipeline status, feature flag config",
              actions:
                "Generate test cases from AC, monitor build/test results, block release on critical failures, verify rollback mechanism",
              outputs: "Test suite, release readiness report, rollback verification",
              systems: "CI/CD (Jenkins, GitHub Actions), Feature Flag Platform, Test Management",
            },
            {
              id: "triage-summarizer",
              name: "Triage & Summarizer",
              description: "Clusters incidents, drafts KB articles, proposes fixes",
              inputs: "Support tickets, incident reports, user feedback",
              actions:
                "Cluster similar issues, identify top themes, draft knowledge base articles, suggest fixes or workarounds",
              outputs: "Issue clusters, KB article drafts, fix recommendations",
              systems: "Support Ticketing System, Knowledge Base, Incident Management",
            },
            {
              id: "analytics-synthesizer",
              name: "Analytics Synthesizer",
              description: "Validates tracking plan, computes KPI deltas, drafts experiment summaries",
              inputs: "Event streams, KPI targets, experiment configs",
              actions:
                "Validate event coverage, compute impact vs targets, analyze A/B test results, suggest next actions",
              outputs: "KPI dashboard, experiment readouts, recommended backlog updates",
              systems: "Analytics Platform, A/B Testing Tool, Data Warehouse",
            },
          ].map((agent) => (
            <Collapsible key={agent.id} open={openAgents.includes(agent.id)} onOpenChange={() => toggleAgent(agent.id)}>
              <Card className="overflow-hidden">
                <CollapsibleTrigger className="flex w-full items-center justify-between p-4 text-left hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">✦</span>
                    <div>
                      <h4 className="font-semibold text-foreground">{agent.name}</h4>
                      <p className="text-sm text-muted-foreground">{agent.description}</p>
                    </div>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 text-muted-foreground transition-transform ${
                      openAgents.includes(agent.id) ? "rotate-180" : ""
                    }`}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="border-t border-border bg-muted/30 p-4 space-y-3 text-sm">
                    <div>
                      <p className="font-medium text-foreground">Inputs:</p>
                      <p className="text-muted-foreground">{agent.inputs}</p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Actions:</p>
                      <p className="text-muted-foreground">{agent.actions}</p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Outputs:</p>
                      <p className="text-muted-foreground">{agent.outputs}</p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Systems Touched:</p>
                      <p className="text-muted-foreground">{agent.systems}</p>
                    </div>
                  </div>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}
        </div>
      </section>
    </div>
  )
}
