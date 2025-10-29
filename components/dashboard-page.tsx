"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Search, ArrowUpDown, ArrowUp, ArrowDown, HelpCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getOpportunities, type FunctionType, type Stage, type Priority, getStageLabel } from "@/lib/mock-data"
import { StatusBadge } from "@/components/status-badge"
import { PriorityBadge } from "@/components/priority-badge"
import { OpportunitySidePanel } from "@/components/opportunity-side-panel"
import { DashboardMetrics } from "@/components/dashboard-metrics"
import { TableSkeleton } from "@/components/table-skeleton"
import { useAuth, getRoleStageFilter } from "@/lib/auth-context"

type SortField = "name" | "function" | "currentStage" | "status" | "priority" | "owner" | "timeInStage"
type SortDirection = "asc" | "desc" | null

export function DashboardPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [year, setYear] = useState("all")
  const [functionFilter, setFunctionFilter] = useState<FunctionType | "all">("all")
  const roleStageFilter = getRoleStageFilter(user?.role || null)
  const [stageFilter, setStageFilter] = useState<Stage | "all">((roleStageFilter as Stage) || "all")
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all")
  const [search, setSearch] = useState("")
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string | null>(null)
  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)
  const [isLoading, setIsLoading] = useState(false)

  const opportunities = getOpportunities({
    year: year === "all" ? undefined : year,
    function: functionFilter === "all" ? undefined : functionFilter,
    stage: stageFilter === "all" ? undefined : stageFilter,
    priority: priorityFilter === "all" ? undefined : priorityFilter,
    search: search || undefined,
  })

  const sortedOpportunities = useMemo(() => {
    if (!sortField || !sortDirection) return opportunities

    return [...opportunities].sort((a, b) => {
      let aValue: string | number = ""
      let bValue: string | number = ""

      switch (sortField) {
        case "name":
          aValue = a.name
          bValue = b.name
          break
        case "function":
          aValue = a.function
          bValue = b.function
          break
        case "currentStage":
          aValue = a.currentStage
          bValue = b.currentStage
          break
        case "status":
          aValue = a.status
          bValue = b.status
          break
        case "priority":
          const priorityWeight = { high: 3, medium: 2, low: 1 }
          aValue = priorityWeight[a.priority]
          bValue = priorityWeight[b.priority]
          break
        case "owner":
          aValue = a.owner
          bValue = b.owner
          break
        case "timeInStage":
          aValue = a.timeInStage
          bValue = b.timeInStage
          break
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      return sortDirection === "asc" ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number)
    })
  }, [opportunities, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === "asc") {
        setSortDirection("desc")
      } else if (sortDirection === "desc") {
        setSortField(null)
        setSortDirection(null)
      }
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />
    }
    if (sortDirection === "asc") {
      return <ArrowUp className="ml-2 h-4 w-4" />
    }
    return <ArrowDown className="ml-2 h-4 w-4" />
  }

  const handleRowClick = (opportunityId: string, stage: string) => {
    router.push(`/${stage}?id=${opportunityId}`)
  }

  const isAdmin = user?.role === "Admin"

  return (
    <TooltipProvider>
      <div className="flex h-full flex-col">
        <div className="border-b border-border bg-card px-6 py-4">
          <h1 className="mb-4 font-sans text-2xl font-semibold text-card-foreground">Dashboard</h1>
          <div className="flex flex-wrap gap-4">
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
              </SelectContent>
            </Select>

            <Select value={functionFilter} onValueChange={(v) => setFunctionFilter(v as FunctionType | "all")}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select function" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Functions</SelectItem>
                <SelectItem value="Supply Chain">Supply Chain</SelectItem>
                <SelectItem value="TS">TS</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Operations">Operations</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="HR">HR</SelectItem>
              </SelectContent>
            </Select>

            {isAdmin && (
              <Select value={stageFilter} onValueChange={(v) => setStageFilter(v as Stage | "all")}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Current stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stages</SelectItem>
                  <SelectItem value="intake">{getStageLabel("intake")}</SelectItem>
                  <SelectItem value="product">{getStageLabel("product")}</SelectItem>
                  <SelectItem value="engineering">{getStageLabel("engineering")}</SelectItem>
                  <SelectItem value="platform">{getStageLabel("platform")}</SelectItem>
                  <SelectItem value="implementation">{getStageLabel("implementation")}</SelectItem>
                  <SelectItem value="support">{getStageLabel("support")}</SelectItem>
                </SelectContent>
              </Select>
            )}

            <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as Priority | "all")}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by opportunity name or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-6 overflow-auto p-6">
          <DashboardMetrics opportunities={sortedOpportunities} />

          {isLoading ? (
            <TableSkeleton />
          ) : (
            <div className="rounded-lg border border-border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="-ml-3 h-8 font-medium"
                        onClick={() => handleSort("name")}
                      >
                        Opportunity
                        {getSortIcon("name")}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="-ml-3 h-8 font-medium"
                          onClick={() => handleSort("function")}
                        >
                          Function
                          {getSortIcon("function")}
                        </Button>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>The business function or department this opportunity belongs to</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="-ml-3 h-8 font-medium"
                        onClick={() => handleSort("currentStage")}
                      >
                        Current Stage
                        {getSortIcon("currentStage")}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="-ml-3 h-8 font-medium"
                        onClick={() => handleSort("priority")}
                      >
                        Priority
                        {getSortIcon("priority")}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="-ml-3 h-8 font-medium"
                        onClick={() => handleSort("status")}
                      >
                        Status
                        {getSortIcon("status")}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="-ml-3 h-8 font-medium"
                        onClick={() => handleSort("owner")}
                      >
                        Owner
                        {getSortIcon("owner")}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="-ml-3 h-8 font-medium"
                          onClick={() => handleSort("timeInStage")}
                        >
                          Time in Stage
                          {getSortIcon("timeInStage")}
                        </Button>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>How long the opportunity has been in its current stage</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedOpportunities.map((opp) => (
                    <TableRow
                      key={opp.id}
                      className="cursor-pointer transition-colors hover:bg-muted/50"
                      onClick={() => handleRowClick(opp.id, opp.currentStage)}
                    >
                      <TableCell className="font-medium">
                        <div>
                          <div className="text-foreground">{opp.name}</div>
                          <div className="text-xs text-muted-foreground">{opp.id}</div>
                        </div>
                      </TableCell>
                      <TableCell>{opp.function}</TableCell>
                      <TableCell className="capitalize">{opp.currentStage}</TableCell>
                      <TableCell>
                        <PriorityBadge priority={opp.priority} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={opp.status} />
                      </TableCell>
                      <TableCell>{opp.owner}</TableCell>
                      <TableCell className="font-mono text-sm">{opp.timeInStage}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="transition-colors hover:bg-primary/10 hover:text-primary"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedOpportunityId(opp.id)
                          }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        <OpportunitySidePanel opportunityId={selectedOpportunityId} onClose={() => setSelectedOpportunityId(null)} />
      </div>
    </TooltipProvider>
  )
}
