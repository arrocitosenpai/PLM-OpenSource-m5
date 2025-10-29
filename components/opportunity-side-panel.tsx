"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getOpportunityById } from "@/lib/mock-data"
import { StatusBadge } from "@/components/status-badge"
import { StageProgress } from "@/components/stage-progress"
import { IntakeAnalysisPanel } from "@/components/intake-analysis-panel"
import { Sparkles } from "lucide-react"
import Link from "next/link"

interface OpportunitySidePanelProps {
  opportunityId: string | null
  onClose: () => void
}

export function OpportunitySidePanel({ opportunityId, onClose }: OpportunitySidePanelProps) {
  const opportunity = opportunityId ? getOpportunityById(opportunityId) : null
  const [activeTab, setActiveTab] = useState("details")

  if (!opportunity) return null

  return (
    <Sheet open={!!opportunityId} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-[600px] overflow-y-auto sm:max-w-[600px]">
        <SheetHeader>
          <SheetTitle className="flex items-start justify-between">
            <div>
              <div className="text-xl font-semibold">{opportunity.name}</div>
              <div className="text-sm text-muted-foreground">{opportunity.id}</div>
            </div>
          </SheetTitle>
        </SheetHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="analysis" className="gap-2">
              <Sparkles className="h-3.5 w-3.5" />
              AI Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <div>
              <h3 className="mb-3 text-sm font-medium text-muted-foreground">Progress</h3>
              <StageProgress currentStage={opportunity.currentStage} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Status</div>
                <div className="mt-1">
                  <StatusBadge status={opportunity.status} />
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Function</div>
                <div className="mt-1 font-medium">{opportunity.function}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Owner</div>
                <div className="mt-1 font-medium">{opportunity.owner}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Time in Stage</div>
                <div className="mt-1 font-mono text-sm">{opportunity.timeInStage}</div>
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-medium text-muted-foreground">Problem Statement</h3>
              <p className="text-sm leading-relaxed">{opportunity.problemStatement}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Business Sponsor</div>
                <div className="mt-1 text-sm font-medium">{opportunity.businessSponsor}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Business Team</div>
                <div className="mt-1 text-sm font-medium">{opportunity.businessTeam}</div>
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-medium text-muted-foreground">Business Value</h3>
              <p className="text-sm leading-relaxed">{opportunity.businessValue}</p>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-medium text-muted-foreground">Quality Value</h3>
              <p className="text-sm leading-relaxed">{opportunity.qualityValue}</p>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-medium text-muted-foreground">Assigned Users</h3>
              <div className="flex flex-wrap gap-2">
                {opportunity.assignedUsers.map((user) => (
                  <div
                    key={user}
                    className="rounded-md bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground"
                  >
                    {user}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 border-t border-border pt-4">
              <Button asChild className="flex-1">
                <Link href={`/${opportunity.currentStage}?id=${opportunity.id}`}>
                  Open in {opportunity.currentStage.charAt(0).toUpperCase() + opportunity.currentStage.slice(1)}
                </Link>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="mt-6">
            <IntakeAnalysisPanel opportunity={opportunity} />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
