"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProcessFlowDiagram } from "@/components/process-flow-diagram"
import { PresentationFlow } from "@/components/presentation-flow"

export default function ArchitecturePage() {
  const [activeTab, setActiveTab] = useState("system")

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">NUVIO - Product Lifecycle Manager</h1>
          <p className="text-xl text-muted-foreground">System Architecture & Integration Overview</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-3">
            <TabsTrigger value="system">System Architecture</TabsTrigger>
            <TabsTrigger value="process">Process Flow</TabsTrigger>
            <TabsTrigger value="presentation">Presentation</TabsTrigger>
          </TabsList>

          <TabsContent value="system" className="space-y-8">
            {/* Current Architecture */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Current Architecture</h2>
              <div className="rounded-lg border border-border bg-card p-8">
                <svg viewBox="0 0 1200 800" className="w-full" xmlns="http://www.w3.org/2000/svg">
                  {/* Presentation Layer */}
                  <rect
                    x="50"
                    y="50"
                    width="1100"
                    height="180"
                    fill="#1a1a1a"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    rx="8"
                  />
                  <text x="600" y="85" textAnchor="middle" fill="#3b82f6" fontSize="18" fontWeight="bold">
                    PRESENTATION LAYER
                  </text>

                  {/* UI Components */}
                  <rect
                    x="80"
                    y="110"
                    width="200"
                    height="100"
                    fill="#262626"
                    stroke="#60a5fa"
                    strokeWidth="1.5"
                    rx="6"
                  />
                  <text x="180" y="140" textAnchor="middle" fill="#e5e5e5" fontSize="14" fontWeight="600">
                    Dashboard
                  </text>
                  <text x="180" y="165" textAnchor="middle" fill="#a3a3a3" fontSize="12">
                    • Filters & Search
                  </text>
                  <text x="180" y="185" textAnchor="middle" fill="#a3a3a3" fontSize="12">
                    • Data Table
                  </text>
                  <text x="180" y="205" textAnchor="middle" fill="#a3a3a3" fontSize="12">
                    • Side Panel
                  </text>

                  <rect
                    x="310"
                    y="110"
                    width="200"
                    height="100"
                    fill="#262626"
                    stroke="#60a5fa"
                    strokeWidth="1.5"
                    rx="6"
                  />
                  <text x="410" y="140" textAnchor="middle" fill="#e5e5e5" fontSize="14" fontWeight="600">
                    Role Pages
                  </text>
                  <text x="410" y="165" textAnchor="middle" fill="#a3a3a3" fontSize="12">
                    Product • Engineering
                  </text>
                  <text x="410" y="185" textAnchor="middle" fill="#a3a3a3" fontSize="12">
                    Platform • Implementation
                  </text>
                  <text x="410" y="205" textAnchor="middle" fill="#a3a3a3" fontSize="12">
                    Support
                  </text>

                  <rect
                    x="540"
                    y="110"
                    width="200"
                    height="100"
                    fill="#262626"
                    stroke="#60a5fa"
                    strokeWidth="1.5"
                    rx="6"
                  />
                  <text x="640" y="140" textAnchor="middle" fill="#e5e5e5" fontSize="14" fontWeight="600">
                    Analytics
                  </text>
                  <text x="640" y="165" textAnchor="middle" fill="#a3a3a3" fontSize="12">
                    • KPI Cards
                  </text>
                  <text x="640" y="185" textAnchor="middle" fill="#a3a3a3" fontSize="12">
                    • Charts & Trends
                  </text>
                  <text x="640" y="205" textAnchor="middle" fill="#a3a3a3" fontSize="12">
                    • Bottleneck Analysis
                  </text>

                  <rect
                    x="770"
                    y="110"
                    width="350"
                    height="100"
                    fill="#262626"
                    stroke="#60a5fa"
                    strokeWidth="1.5"
                    rx="6"
                  />
                  <text x="945" y="140" textAnchor="middle" fill="#e5e5e5" fontSize="14" fontWeight="600">
                    Shared Components
                  </text>
                  <text x="945" y="165" textAnchor="middle" fill="#a3a3a3" fontSize="12">
                    Sidebar • Header • Status Badges • Priority Badges
                  </text>
                  <text x="945" y="185" textAnchor="middle" fill="#a3a3a3" fontSize="12">
                    Stage Progress • Role Page Layout
                  </text>

                  {/* Application Layer */}
                  <rect
                    x="50"
                    y="280"
                    width="1100"
                    height="180"
                    fill="#1a1a1a"
                    stroke="#10b981"
                    strokeWidth="2"
                    rx="8"
                  />
                  <text x="600" y="315" textAnchor="middle" fill="#10b981" fontSize="18" fontWeight="bold">
                    APPLICATION LAYER
                  </text>

                  <rect
                    x="80"
                    y="340"
                    width="250"
                    height="100"
                    fill="#262626"
                    stroke="#34d399"
                    strokeWidth="1.5"
                    rx="6"
                  />
                  <text x="205" y="370" textAnchor="middle" fill="#e5e5e5" fontSize="14" fontWeight="600">
                    Next.js App Router
                  </text>
                  <text x="205" y="395" textAnchor="middle" fill="#a3a3a3" fontSize="12">
                    • File-based Routing
                  </text>
                  <text x="205" y="415" textAnchor="middle" fill="#a3a3a3" fontSize="12">
                    • Server Components
                  </text>
                  <text x="205" y="435" textAnchor="middle" fill="#a3a3a3" fontSize="12">
                    • Client Components
                  </text>

                  <rect
                    x="360"
                    y="340"
                    width="250"
                    height="100"
                    fill="#262626"
                    stroke="#34d399"
                    strokeWidth="1.5"
                    rx="6"
                  />
                  <text x="485" y="370" textAnchor="middle" fill="#e5e5e5" fontSize="14" fontWeight="600">
                    State Management
                  </text>
                  <text x="485" y="395" textAnchor="middle" fill="#a3a3a3" fontSize="12">
                    • React Hooks (useState)
                  </text>
                  <text x="485" y="415" textAnchor="middle" fill="#a3a3a3" fontSize="12">
                    • URL Search Params
                  </text>
                  <text x="485" y="435" textAnchor="middle" fill="#a3a3a3" fontSize="12">
                    • Client-side Filtering
                  </text>

                  <rect
                    x="640"
                    y="340"
                    width="250"
                    height="100"
                    fill="#262626"
                    stroke="#34d399"
                    strokeWidth="1.5"
                    rx="6"
                  />
                  <text x="765" y="370" textAnchor="middle" fill="#e5e5e5" fontSize="14" fontWeight="600">
                    Business Logic
                  </text>
                  <text x="765" y="395" textAnchor="middle" fill="#a3a3a3" fontSize="12">
                    • Opportunity Management
                  </text>
                  <text x="765" y="415" textAnchor="middle" fill="#a3a3a3" fontSize="12">
                    • Stage Transitions
                  </text>
                  <text x="765" y="435" textAnchor="middle" fill="#a3a3a3" fontSize="12">
                    • Analytics Calculations
                  </text>

                  <rect
                    x="920"
                    y="340"
                    width="200"
                    height="100"
                    fill="#262626"
                    stroke="#34d399"
                    strokeWidth="1.5"
                    rx="6"
                  />
                  <text x="1020" y="370" textAnchor="middle" fill="#e5e5e5" fontSize="14" fontWeight="600">
                    UI Libraries
                  </text>
                  <text x="1020" y="395" textAnchor="middle" fill="#a3a3a3" fontSize="12">
                    • shadcn/ui
                  </text>
                  <text x="1020" y="415" textAnchor="middle" fill="#a3a3a3" fontSize="12">
                    • Tailwind CSS
                  </text>
                  <text x="1020" y="435" textAnchor="middle" fill="#a3a3a3" fontSize="12">
                    • Recharts
                  </text>

                  {/* Data Layer */}
                  <rect
                    x="50"
                    y="510"
                    width="1100"
                    height="120"
                    fill="#1a1a1a"
                    stroke="#f59e0b"
                    strokeWidth="2"
                    rx="8"
                  />
                  <text x="600" y="545" textAnchor="middle" fill="#f59e0b" fontSize="18" fontWeight="bold">
                    DATA LAYER (Current: Mock Data)
                  </text>

                  <rect
                    x="200"
                    y="565"
                    width="300"
                    height="50"
                    fill="#262626"
                    stroke="#fbbf24"
                    strokeWidth="1.5"
                    rx="6"
                  />
                  <text x="350" y="595" textAnchor="middle" fill="#e5e5e5" fontSize="14" fontWeight="600">
                    Mock Data Generator
                  </text>
                  <text x="350" y="615" textAnchor="middle" fill="#a3a3a3" fontSize="11">
                    Opportunities • Stage History • Analytics
                  </text>

                  <rect
                    x="700"
                    y="565"
                    width="300"
                    height="50"
                    fill="#262626"
                    stroke="#fbbf24"
                    strokeWidth="1.5"
                    rx="6"
                    strokeDasharray="5,5"
                  />
                  <text x="850" y="595" textAnchor="middle" fill="#e5e5e5" fontSize="14" fontWeight="600">
                    Future: Database Integration
                  </text>
                  <text x="850" y="615" textAnchor="middle" fill="#a3a3a3" fontSize="11">
                    Supabase • Neon • PostgreSQL
                  </text>

                  {/* Arrows */}
                  <path d="M 600 230 L 600 280" stroke="#60a5fa" strokeWidth="2" markerEnd="url(#arrowblue)" />
                  <path d="M 600 460 L 600 510" stroke="#34d399" strokeWidth="2" markerEnd="url(#arrowgreen)" />

                  {/* Arrow markers */}
                  <defs>
                    <marker
                      id="arrowblue"
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
                      id="arrowgreen"
                      markerWidth="10"
                      markerHeight="10"
                      refX="9"
                      refY="3"
                      orient="auto"
                      markerUnits="strokeWidth"
                    >
                      <path d="M0,0 L0,6 L9,3 z" fill="#34d399" />
                    </marker>
                    <marker
                      id="arroworange"
                      markerWidth="10"
                      markerHeight="10"
                      refX="9"
                      refY="3"
                      orient="auto"
                      markerUnits="strokeWidth"
                    >
                      <path d="M0,0 L0,6 L9,3 z" fill="#fbbf24" />
                    </marker>
                    <marker
                      id="arrowpurple"
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

                  {/* Legend */}
                  <text x="50" y="680" fill="#a3a3a3" fontSize="12" fontWeight="600">
                    Legend:
                  </text>
                  <rect x="50" y="690" width="15" height="15" fill="none" stroke="#3b82f6" strokeWidth="2" />
                  <text x="75" y="702" fill="#a3a3a3" fontSize="11">
                    Presentation Layer
                  </text>
                  <rect x="220" y="690" width="15" height="15" fill="none" stroke="#10b981" strokeWidth="2" />
                  <text x="245" y="702" fill="#a3a3a3" fontSize="11">
                    Application Layer
                  </text>
                  <rect x="390" y="690" width="15" height="15" fill="none" stroke="#f59e0b" strokeWidth="2" />
                  <text x="415" y="702" fill="#a3a3a3" fontSize="11">
                    Data Layer
                  </text>
                  <rect
                    x="540"
                    y="690"
                    width="15"
                    height="15"
                    fill="none"
                    stroke="#a3a3a3"
                    strokeWidth="2"
                    strokeDasharray="3,3"
                  />
                  <text x="565" y="702" fill="#a3a3a3" fontSize="11">
                    Future/Planned
                  </text>
                </svg>
              </div>
            </section>

            {/* AutoGen Integration Architecture */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Proposed AutoGen Integration Architecture</h2>
              <div className="rounded-lg border border-border bg-card p-8">
                <svg viewBox="0 0 1200 900" className="w-full" xmlns="http://www.w3.org/2000/svg">
                  {/* Frontend */}
                  <rect x="50" y="50" width="400" height="200" fill="#1a1a1a" stroke="#3b82f6" strokeWidth="2" rx="8" />
                  <text x="250" y="85" textAnchor="middle" fill="#3b82f6" fontSize="16" fontWeight="bold">
                    FRONTEND (Next.js)
                  </text>
                  <rect
                    x="80"
                    y="110"
                    width="340"
                    height="120"
                    fill="#262626"
                    stroke="#60a5fa"
                    strokeWidth="1.5"
                    rx="6"
                  />
                  <text x="250" y="135" textAnchor="middle" fill="#e5e5e5" fontSize="13" fontWeight="600">
                    User Actions
                  </text>
                  <text x="250" y="160" textAnchor="middle" fill="#a3a3a3" fontSize="11">
                    • Submit New Opportunity
                  </text>
                  <text x="250" y="180" textAnchor="middle" fill="#a3a3a3" fontSize="11">
                    • Update Stage Status
                  </text>
                  <text x="250" y="200" textAnchor="middle" fill="#a3a3a3" fontSize="11">
                    • Request Agent Analysis
                  </text>
                  <text x="250" y="220" textAnchor="middle" fill="#a3a3a3" fontSize="11">
                    • View Agent Recommendations
                  </text>

                  {/* API Layer */}
                  <rect
                    x="50"
                    y="300"
                    width="400"
                    height="250"
                    fill="#1a1a1a"
                    stroke="#10b981"
                    strokeWidth="2"
                    rx="8"
                  />
                  <text x="250" y="335" textAnchor="middle" fill="#10b981" fontSize="16" fontWeight="bold">
                    API LAYER (Next.js)
                  </text>

                  <rect
                    x="80"
                    y="355"
                    width="160"
                    height="80"
                    fill="#262626"
                    stroke="#34d399"
                    strokeWidth="1.5"
                    rx="6"
                  />
                  <text x="160" y="380" textAnchor="middle" fill="#e5e5e5" fontSize="12" fontWeight="600">
                    API Routes
                  </text>
                  <text x="160" y="400" textAnchor="middle" fill="#a3a3a3" fontSize="10">
                    /api/opportunities
                  </text>
                  <text x="160" y="418" textAnchor="middle" fill="#a3a3a3" fontSize="10">
                    /api/agents/analyze
                  </text>
                  <text x="160" y="436" textAnchor="middle" fill="#a3a3a3" fontSize="10">
                    /api/agents/status
                  </text>

                  <rect
                    x="260"
                    y="355"
                    width="160"
                    height="80"
                    fill="#262626"
                    stroke="#34d399"
                    strokeWidth="1.5"
                    rx="6"
                  />
                  <text x="340" y="380" textAnchor="middle" fill="#e5e5e5" fontSize="12" fontWeight="600">
                    Server Actions
                  </text>
                  <text x="340" y="400" textAnchor="middle" fill="#a3a3a3" fontSize="10">
                    submitOpportunity()
                  </text>
                  <text x="340" y="418" textAnchor="middle" fill="#a3a3a3" fontSize="10">
                    triggerAgentWorkflow()
                  </text>
                  <text x="340" y="436" textAnchor="middle" fill="#a3a3a3" fontSize="10">
                    updateWithAgentResults()
                  </text>

                  <rect
                    x="80"
                    y="455"
                    width="340"
                    height="80"
                    fill="#262626"
                    stroke="#34d399"
                    strokeWidth="1.5"
                    rx="6"
                  />
                  <text x="250" y="480" textAnchor="middle" fill="#e5e5e5" fontSize="12" fontWeight="600">
                    Event Queue / Webhooks
                  </text>
                  <text x="250" y="500" textAnchor="middle" fill="#a3a3a3" fontSize="10">
                    Async processing for long-running agent tasks
                  </text>
                  <text x="250" y="518" textAnchor="middle" fill="#a3a3a3" fontSize="10">
                    Background jobs • Status updates • Notifications
                  </text>

                  {/* AutoGen Service */}
                  <rect
                    x="550"
                    y="300"
                    width="600"
                    height="550"
                    fill="#1a1a1a"
                    stroke="#a78bfa"
                    strokeWidth="2"
                    rx="8"
                  />
                  <text x="850" y="335" textAnchor="middle" fill="#a78bfa" fontSize="16" fontWeight="bold">
                    AUTOGEN SERVICE
                  </text>

                  {/* Agent Orchestrator */}
                  <rect
                    x="580"
                    y="355"
                    width="540"
                    height="80"
                    fill="#262626"
                    stroke="#c4b5fd"
                    strokeWidth="1.5"
                    rx="6"
                  />
                  <text x="850" y="380" textAnchor="middle" fill="#e5e5e5" fontSize="13" fontWeight="600">
                    Agent Orchestrator
                  </text>
                  <text x="850" y="400" textAnchor="middle" fill="#a3a3a3" fontSize="11">
                    Coordinates multi-agent workflows • Manages conversation flow
                  </text>
                  <text x="850" y="418" textAnchor="middle" fill="#a3a3a3" fontSize="11">
                    Handles agent communication • Aggregates results
                  </text>

                  {/* Individual Agents */}
                  <rect
                    x="580"
                    y="455"
                    width="250"
                    height="110"
                    fill="#262626"
                    stroke="#c4b5fd"
                    strokeWidth="1.5"
                    rx="6"
                  />
                  <text x="705" y="480" textAnchor="middle" fill="#e5e5e5" fontSize="12" fontWeight="600">
                    Intake Analysis Agent
                  </text>
                  <text x="705" y="500" textAnchor="middle" fill="#a3a3a3" fontSize="10">
                    • Parse opportunity details
                  </text>
                  <text x="705" y="518" textAnchor="middle" fill="#a3a3a3" fontSize="10">
                    • Extract requirements
                  </text>
                  <text x="705" y="536" textAnchor="middle" fill="#a3a3a3" fontSize="10">
                    • Suggest categorization
                  </text>
                  <text x="705" y="554" textAnchor="middle" fill="#a3a3a3" fontSize="10">
                    • Identify stakeholders
                  </text>

                  <rect
                    x="870"
                    y="455"
                    width="250"
                    height="110"
                    fill="#262626"
                    stroke="#c4b5fd"
                    strokeWidth="1.5"
                    rx="6"
                  />
                  <text x="995" y="480" textAnchor="middle" fill="#e5e5e5" fontSize="12" fontWeight="600">
                    Technical Feasibility Agent
                  </text>
                  <text x="995" y="500" textAnchor="middle" fill="#a3a3a3" fontSize="10">
                    • Assess technical complexity
                  </text>
                  <text x="995" y="518" textAnchor="middle" fill="#a3a3a3" fontSize="10">
                    • Identify dependencies
                  </text>
                  <text x="995" y="536" textAnchor="middle" fill="#a3a3a3" fontSize="10">
                    • Flag potential blockers
                  </text>
                  <text x="995" y="554" textAnchor="middle" fill="#a3a3a3" fontSize="10">
                    • Suggest tech stack
                  </text>

                  <rect
                    x="580"
                    y="585"
                    width="250"
                    height="110"
                    fill="#262626"
                    stroke="#c4b5fd"
                    strokeWidth="1.5"
                    rx="6"
                  />
                  <text x="705" y="610" textAnchor="middle" fill="#e5e5e5" fontSize="12" fontWeight="600">
                    Resource Planning Agent
                  </text>
                  <text x="705" y="630" textAnchor="middle" fill="#a3a3a3" fontSize="10">
                    • Estimate effort & timeline
                  </text>
                  <text x="705" y="648" textAnchor="middle" fill="#a3a3a3" fontSize="10">
                    • Suggest team composition
                  </text>
                  <text x="705" y="666" textAnchor="middle" fill="#a3a3a3" fontSize="10">
                    • Check resource availability
                  </text>
                  <text x="705" y="684" textAnchor="middle" fill="#a3a3a3" fontSize="10">
                    • Calculate cost estimates
                  </text>

                  <rect
                    x="870"
                    y="585"
                    width="250"
                    height="110"
                    fill="#262626"
                    stroke="#c4b5fd"
                    strokeWidth="1.5"
                    rx="6"
                  />
                  <text x="995" y="610" textAnchor="middle" fill="#e5e5e5" fontSize="12" fontWeight="600">
                    Risk Assessment Agent
                  </text>
                  <text x="995" y="630" textAnchor="middle" fill="#a3a3a3" fontSize="10">
                    • Identify project risks
                  </text>
                  <text x="995" y="648" textAnchor="middle" fill="#a3a3a3" fontSize="10">
                    • Assess impact & probability
                  </text>
                  <text x="995" y="666" textAnchor="middle" fill="#a3a3a3" fontSize="10">
                    • Suggest mitigation strategies
                  </text>
                  <text x="995" y="684" textAnchor="middle" fill="#a3a3a3" fontSize="10">
                    • Monitor risk indicators
                  </text>

                  {/* LLM Provider */}
                  <rect
                    x="580"
                    y="715"
                    width="540"
                    height="70"
                    fill="#262626"
                    stroke="#c4b5fd"
                    strokeWidth="1.5"
                    rx="6"
                  />
                  <text x="850" y="740" textAnchor="middle" fill="#e5e5e5" fontSize="12" fontWeight="600">
                    LLM Provider Integration
                  </text>
                  <text x="850" y="760" textAnchor="middle" fill="#a3a3a3" fontSize="10">
                    OpenAI GPT-4 • Anthropic Claude • Azure OpenAI
                  </text>
                  <text x="850" y="778" textAnchor="middle" fill="#a3a3a3" fontSize="10">
                    Vercel AI Gateway for unified access
                  </text>

                  {/* Database */}
                  <rect
                    x="50"
                    y="600"
                    width="400"
                    height="120"
                    fill="#1a1a1a"
                    stroke="#f59e0b"
                    strokeWidth="2"
                    rx="8"
                  />
                  <text x="250" y="635" textAnchor="middle" fill="#f59e0b" fontSize="16" fontWeight="bold">
                    DATABASE
                  </text>
                  <rect
                    x="80"
                    y="655"
                    width="340"
                    height="50"
                    fill="#262626"
                    stroke="#fbbf24"
                    strokeWidth="1.5"
                    rx="6"
                  />
                  <text x="250" y="680" textAnchor="middle" fill="#e5e5e5" fontSize="12" fontWeight="600">
                    PostgreSQL (Supabase / Neon)
                  </text>
                  <text x="250" y="698" textAnchor="middle" fill="#a3a3a3" fontSize="10">
                    Opportunities • Agent Results • Audit Logs • User Data
                  </text>

                  {/* Arrows */}
                  <path d="M 250 250 L 250 300" stroke="#60a5fa" strokeWidth="2" markerEnd="url(#arrowblue)" />
                  <path d="M 450 400 L 550 400" stroke="#34d399" strokeWidth="2" markerEnd="url(#arrowgreen)" />
                  <path d="M 250 550 L 250 600" stroke="#fbbf24" strokeWidth="2" markerEnd="url(#arroworange)" />
                  <path d="M 530 640 L 450 640" stroke="#c4b5fd" strokeWidth="2" markerEnd="url(#arrowpurple)" />

                  {/* Bidirectional arrow */}
                  <path d="M 850 435 L 850 455" stroke="#c4b5fd" strokeWidth="2" markerEnd="url(#arrowpurple)" />
                  <path d="M 850 695 L 850 715" stroke="#c4b5fd" strokeWidth="2" markerEnd="url(#arrowpurple)" />
                </svg>
              </div>
            </section>

            {/* Component Details */}
            <section className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4 rounded-lg border border-border bg-card p-6">
                <h3 className="text-lg font-semibold text-foreground">Current System Components</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <h4 className="font-medium text-foreground">Presentation Layer</h4>
                    <p className="text-muted-foreground">
                      React components built with Next.js 15, shadcn/ui, and Tailwind CSS. Includes dashboard,
                      role-specific pages, and analytics views.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Application Layer</h4>
                    <p className="text-muted-foreground">
                      Next.js App Router with file-based routing, React hooks for state management, and URL search
                      params for navigation state.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Data Layer</h4>
                    <p className="text-muted-foreground">
                      Currently using mock data generators. Ready for database integration with Supabase, Neon, or
                      PostgreSQL.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 rounded-lg border border-border bg-card p-6">
                <h3 className="text-lg font-semibold text-foreground">AutoGen Integration Benefits</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <h4 className="font-medium text-foreground">Automated Analysis</h4>
                    <p className="text-muted-foreground">
                      AI agents automatically analyze new opportunities, extract requirements, and provide initial
                      assessments.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Multi-Agent Collaboration</h4>
                    <p className="text-muted-foreground">
                      Specialized agents work together to provide comprehensive insights on technical feasibility,
                      resources, and risks.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Intelligent Recommendations</h4>
                    <p className="text-muted-foreground">
                      Agents suggest team assignments, timelines, tech stacks, and mitigation strategies based on
                      historical data.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Implementation Options */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Implementation Options</h2>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-lg border border-border bg-card p-6">
                  <h3 className="mb-3 text-lg font-semibold text-foreground">Option A: Python AutoGen</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p className="font-medium text-foreground">Pros:</p>
                    <ul className="list-inside list-disc space-y-1">
                      <li>Official Microsoft implementation</li>
                      <li>Rich ecosystem and examples</li>
                      <li>Advanced agent capabilities</li>
                    </ul>
                    <p className="mt-3 font-medium text-foreground">Cons:</p>
                    <ul className="list-inside list-disc space-y-1">
                      <li>Requires separate Python service</li>
                      <li>Additional deployment complexity</li>
                      <li>Cross-language communication</li>
                    </ul>
                  </div>
                </div>

                <div className="rounded-lg border border-border bg-card p-6">
                  <h3 className="mb-3 text-lg font-semibold text-foreground">Option B: Vercel AI SDK</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p className="font-medium text-foreground">Pros:</p>
                    <ul className="list-inside list-disc space-y-1">
                      <li>Native TypeScript/JavaScript</li>
                      <li>Seamless Next.js integration</li>
                      <li>Built-in streaming & UI hooks</li>
                      <li>Vercel AI Gateway included</li>
                    </ul>
                    <p className="mt-3 font-medium text-foreground">Cons:</p>
                    <ul className="list-inside list-disc space-y-1">
                      <li>Different API than AutoGen</li>
                      <li>May need custom agent patterns</li>
                    </ul>
                  </div>
                </div>

                <div className="rounded-lg border border-border bg-card p-6">
                  <h3 className="mb-3 text-lg font-semibold text-foreground">Option C: Hybrid Approach</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p className="font-medium text-foreground">Pros:</p>
                    <ul className="list-inside list-disc space-y-1">
                      <li>Best of both worlds</li>
                      <li>Use AutoGen for complex workflows</li>
                      <li>Use AI SDK for simple tasks</li>
                    </ul>
                    <p className="mt-3 font-medium text-foreground">Cons:</p>
                    <ul className="list-inside list-disc space-y-1">
                      <li>Most complex architecture</li>
                      <li>Higher maintenance overhead</li>
                      <li>Multiple integration points</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Data Flow */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Agent Workflow Example</h2>
              <div className="rounded-lg border border-border bg-card p-6">
                <ol className="space-y-4 text-sm">
                  <li className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
                      1
                    </span>
                    <div>
                      <h4 className="font-medium text-foreground">User Submits Opportunity</h4>
                      <p className="text-muted-foreground">
                        User fills out opportunity form with title, description, requirements, and business context.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-500/20 text-green-400">
                      2
                    </span>
                    <div>
                      <h4 className="font-medium text-foreground">API Triggers Agent Workflow</h4>
                      <p className="text-muted-foreground">
                        Next.js API route or Server Action sends opportunity data to AutoGen service via HTTP request or
                        message queue.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-purple-400">
                      3
                    </span>
                    <div>
                      <h4 className="font-medium text-foreground">Agents Analyze in Parallel</h4>
                      <p className="text-muted-foreground">
                        Multiple specialized agents analyze different aspects: intake analysis, technical feasibility,
                        resource planning, and risk assessment.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-purple-400">
                      4
                    </span>
                    <div>
                      <h4 className="font-medium text-foreground">Agents Collaborate & Discuss</h4>
                      <p className="text-muted-foreground">
                        Agents share findings, debate recommendations, and reach consensus on priority, complexity, and
                        approach.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500/20 text-orange-400">
                      5
                    </span>
                    <div>
                      <h4 className="font-medium text-foreground">Results Stored in Database</h4>
                      <p className="text-muted-foreground">
                        Agent recommendations, analysis, and metadata are saved to the database and linked to the
                        opportunity record.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
                      6
                    </span>
                    <div>
                      <h4 className="font-medium text-foreground">UI Updates with Insights</h4>
                      <p className="text-muted-foreground">
                        Dashboard and role pages display agent recommendations, suggested priority, estimated timeline,
                        and identified risks.
                      </p>
                    </div>
                  </li>
                </ol>
              </div>
            </section>

            {/* Technical Stack */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Technology Stack</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border border-border bg-card p-4">
                  <h3 className="mb-2 font-semibold text-foreground">Frontend</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Next.js 15 (App Router)</li>
                    <li>• React 19</li>
                    <li>• TypeScript</li>
                    <li>• Tailwind CSS v4</li>
                    <li>• shadcn/ui</li>
                    <li>• Recharts</li>
                  </ul>
                </div>
                <div className="rounded-lg border border-border bg-card p-4">
                  <h3 className="mb-2 font-semibold text-foreground">Backend</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Next.js API Routes</li>
                    <li>• Server Actions</li>
                    <li>• Server Components</li>
                    <li>• Vercel Functions</li>
                  </ul>
                </div>
                <div className="rounded-lg border border-border bg-card p-4">
                  <h3 className="mb-2 font-semibold text-foreground">Database (Planned)</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• PostgreSQL</li>
                    <li>• Supabase / Neon</li>
                    <li>• Prisma ORM (optional)</li>
                    <li>• Redis (caching)</li>
                  </ul>
                </div>
                <div className="rounded-lg border border-border bg-card p-4">
                  <h3 className="mb-2 font-semibold text-foreground">AI Integration</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• AutoGen (Microsoft)</li>
                    <li>• Vercel AI SDK</li>
                    <li>• OpenAI GPT-4</li>
                    <li>• Vercel AI Gateway</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Deployment */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Deployment Architecture</h2>
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-foreground">Current Deployment</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-green-400">✓</span>
                        <span>
                          <strong className="text-foreground">Vercel Platform:</strong> Automatic deployments from Git
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-400">✓</span>
                        <span>
                          <strong className="text-foreground">Edge Network:</strong> Global CDN for fast page loads
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-400">✓</span>
                        <span>
                          <strong className="text-foreground">Serverless Functions:</strong> Auto-scaling API routes
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-400">✓</span>
                        <span>
                          <strong className="text-foreground">Preview Deployments:</strong> Every PR gets a preview URL
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-foreground">With AutoGen Integration</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">+</span>
                        <span>
                          <strong className="text-foreground">AutoGen Service:</strong> Separate container or serverless
                          function
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">+</span>
                        <span>
                          <strong className="text-foreground">Message Queue:</strong> Redis or Vercel KV for async jobs
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">+</span>
                        <span>
                          <strong className="text-foreground">Database:</strong> Supabase or Neon PostgreSQL
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">+</span>
                        <span>
                          <strong className="text-foreground">Background Workers:</strong> Long-running agent tasks
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Next Steps */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Recommended Next Steps</h2>
              <div className="space-y-3">
                <div className="rounded-lg border border-blue-500/50 bg-blue-500/10 p-4">
                  <h3 className="mb-2 font-semibold text-blue-400">Phase 1: Database Integration</h3>
                  <p className="text-sm text-muted-foreground">
                    Replace mock data with real database (Supabase/Neon). Set up tables for opportunities, users, stage
                    history, and audit logs.
                  </p>
                </div>
                <div className="rounded-lg border border-green-500/50 bg-green-500/10 p-4">
                  <h3 className="mb-2 font-semibold text-green-400">Phase 2: Authentication & Authorization</h3>
                  <p className="text-sm text-muted-foreground">
                    Implement user authentication and role-based access control. Connect user roles to stage filtering
                    and permissions.
                  </p>
                </div>
                <div className="rounded-lg border border-purple-500/50 bg-purple-500/10 p-4">
                  <h3 className="mb-2 font-semibold text-purple-400">Phase 3: AutoGen Proof of Concept</h3>
                  <p className="text-sm text-muted-foreground">
                    Build a simple agent workflow (e.g., Intake Analysis Agent) to validate the integration approach and
                    demonstrate value.
                  </p>
                </div>
                <div className="rounded-lg border border-orange-500/50 bg-orange-500/10 p-4">
                  <h3 className="mb-2 font-semibold text-orange-400">Phase 4: Full Multi-Agent System</h3>
                  <p className="text-sm text-muted-foreground">
                    Expand to all planned agents with orchestration, collaboration, and comprehensive recommendations
                    across all lifecycle stages.
                  </p>
                </div>
              </div>
            </section>
          </TabsContent>

          <TabsContent value="process" className="space-y-8">
            <ProcessFlowDiagram />
          </TabsContent>

          <TabsContent value="presentation" className="space-y-8">
            <PresentationFlow />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
