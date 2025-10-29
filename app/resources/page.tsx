"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { teamMembers, mockOpportunities, type TeamType, type TeamMember } from "@/lib/mock-data"
import { Users, AlertTriangle, CheckCircle2, TrendingUp, TrendingDown, Download, X } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CapacityCharts } from "@/components/resources/capacity-charts"
import { DiscoverabilityBar } from "@/components/resources/discoverability-bar"
import { MemberDetailDrawer } from "@/components/resources/member-detail-drawer"
import { getCapacityBand, getCapacityColor, getStatusBadgeVariant } from "@/lib/capacity-forecast"

type KPIFilter = "total" | "overallocated" | "available" | null

export default function ResourcesPage() {
  const [search, setSearch] = useState("")
  const [selectedTeams, setSelectedTeams] = useState<TeamType[]>([])
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [capacityBand, setCapacityBand] = useState<"all" | "under" | "balanced" | "high" | "over">("all")
  const [sortBy, setSortBy] = useState("name-asc")
  const [kpiFilter, setKpiFilter] = useState<KPIFilter>(null)
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)

  // Get unique roles
  const availableRoles = Array.from(new Set(teamMembers.map((m) => m.role)))

  const getCapacityStatus = (capacity: number) => {
    if (capacity > 110) return "Overallocated"
    if (capacity > 100) return "High"
    if (capacity < 70) return "Available"
    return "Optimal"
  }

  const filteredMembers = teamMembers.filter((member) => {
    // Search filter
    if (search) {
      const searchLower = search.toLowerCase()
      const matchesSearch =
        member.name.toLowerCase().includes(searchLower) ||
        member.role.toLowerCase().includes(searchLower) ||
        member.team.toLowerCase().includes(searchLower) ||
        member.projectIds.some((id) => id.toLowerCase().includes(searchLower))
      if (!matchesSearch) return false
    }

    // Team filter
    if (selectedTeams.length > 0 && !selectedTeams.includes(member.team)) {
      return false
    }

    // Role filter
    if (selectedRoles.length > 0 && !selectedRoles.includes(member.role)) {
      return false
    }

    // Status filter
    if (selectedStatuses.length > 0) {
      const status = getCapacityStatus(member.capacity)
      if (!selectedStatuses.includes(status)) return false
    }

    // Capacity band filter
    if (capacityBand !== "all") {
      const band = getCapacityBand(member.capacity)
      if (band !== capacityBand) return false
    }

    // KPI filter
    if (kpiFilter === "overallocated" && member.capacity <= 100) return false
    if (kpiFilter === "available" && member.capacity >= 70) return false

    return true
  })

  const sortedMembers = [...filteredMembers].sort((a, b) => {
    switch (sortBy) {
      case "name-asc":
        return a.name.localeCompare(b.name)
      case "name-desc":
        return b.name.localeCompare(a.name)
      case "capacity-asc":
        return a.capacity - b.capacity
      case "capacity-desc":
        return b.capacity - a.capacity
      case "projects-asc":
        return a.projectIds.length - b.projectIds.length
      case "projects-desc":
        return b.projectIds.length - a.projectIds.length
      default:
        return 0
    }
  })

  const totalMembers = teamMembers.length
  const avgCapacity = Math.round(teamMembers.reduce((sum, m) => sum + m.capacity, 0) / totalMembers)
  const overallocated = teamMembers.filter((m) => m.capacity > 100).length
  const available = teamMembers.filter((m) => m.capacity < 70).length

  // Calculate trend for avg capacity (simplified - comparing current to historical average)
  const historicalAvg = teamMembers[0]?.history
    ? Math.round(
        teamMembers.reduce((sum, m) => {
          const memberHistAvg = m.history ? m.history.reduce((s, h) => s + h.value, 0) / m.history.length : m.capacity
          return sum + memberHistAvg
        }, 0) / totalMembers,
      )
    : avgCapacity
  const capacityTrend = avgCapacity > historicalAvg ? "up" : avgCapacity < historicalAvg ? "down" : "neutral"

  const handleKPIClick = (filter: KPIFilter) => {
    setKpiFilter(kpiFilter === filter ? null : filter)
  }

  const handleReset = () => {
    setSearch("")
    setSelectedTeams([])
    setSelectedRoles([])
    setSelectedStatuses([])
    setCapacityBand("all")
    setSortBy("name-asc")
    setKpiFilter(null)
  }

  const handleExport = () => {
    // TODO: Implement actual export functionality
    console.log("[v0] Export to Excel - filtered dataset:", sortedMembers)
    alert("Export functionality would generate an Excel file with the filtered data")
  }

  const handleFilterByBand = (band: "under" | "balanced" | "high" | "over" | null) => {
    setCapacityBand(band || "all")
  }

  const handleFilterByTeam = (team: string | null) => {
    if (team) {
      setSelectedTeams([team as TeamType])
    } else {
      setSelectedTeams([])
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-sans text-2xl font-semibold text-card-foreground">Resources</h1>
            <p className="text-sm text-muted-foreground">Track team capacity and project assignments</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Card
              className={`kpi-card-glow border-border/50 bg-gradient-to-br from-card to-card/80 relative overflow-hidden cursor-pointer transition-all duration-300 ${
                kpiFilter === "total"
                  ? "ring-2 ring-[var(--kpi-total)] shadow-lg"
                  : "hover:shadow-md hover:-translate-y-0.5"
              }`}
              onClick={() => handleKPIClick("total")}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--kpi-total)]/5 to-transparent" />
              <CardContent className="relative p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-muted-foreground">Total Resources</p>
                    <p className="mt-1 text-3xl font-bold text-foreground">{filteredMembers.length}</p>
                    <div className="mt-1.5 flex items-center gap-1 text-sm">
                      <Users className="h-3 w-3 text-[var(--kpi-total)] flex-shrink-0" />
                      <span className="text-muted-foreground truncate">
                        {filteredMembers.length === totalMembers ? "Active team members" : `of ${totalMembers} total`}
                      </span>
                    </div>
                  </div>
                  <div className="rounded-full bg-[var(--kpi-total-bg)] p-2.5 ring-1 ring-[var(--kpi-total)]/20 flex-shrink-0">
                    <Users className="h-5 w-5 text-[var(--kpi-total)]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="kpi-card-glow border-border/50 bg-gradient-to-br from-card to-card/80 relative overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--kpi-progress)]/5 to-transparent" />
              <CardContent className="relative p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-muted-foreground">Avg Capacity</p>
                    <p className="mt-1 text-3xl font-bold text-foreground">{avgCapacity}%</p>
                    <div className="mt-1.5 flex items-center gap-1 text-sm">
                      {capacityTrend === "up" && (
                        <>
                          <TrendingUp className="h-3 w-3 text-[var(--kpi-progress)] flex-shrink-0" />
                          <span className="font-medium text-[var(--kpi-progress)]">
                            +{Math.abs(avgCapacity - historicalAvg)}%
                          </span>
                        </>
                      )}
                      {capacityTrend === "down" && (
                        <>
                          <TrendingDown className="h-3 w-3 text-[var(--kpi-time)] flex-shrink-0" />
                          <span className="font-medium text-[var(--kpi-time)]">
                            {Math.abs(avgCapacity - historicalAvg)}%
                          </span>
                        </>
                      )}
                      <span className="text-muted-foreground truncate">team utilization</span>
                    </div>
                  </div>
                  <div className="rounded-full bg-[var(--kpi-progress-bg)] p-2.5 ring-1 ring-[var(--kpi-progress)]/20 flex-shrink-0">
                    {capacityTrend === "up" && <TrendingUp className="h-5 w-5 text-[var(--kpi-progress)]" />}
                    {capacityTrend === "down" && <TrendingDown className="h-5 w-5 text-[var(--kpi-time)]" />}
                    {capacityTrend === "neutral" && <TrendingUp className="h-5 w-5 text-[var(--kpi-progress)]" />}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className={`kpi-card-glow border-border/50 bg-gradient-to-br from-card to-card/80 relative overflow-hidden cursor-pointer transition-all duration-300 ${
                kpiFilter === "overallocated"
                  ? "ring-2 ring-[var(--kpi-risk)] shadow-lg"
                  : "hover:shadow-md hover:-translate-y-0.5"
              }`}
              onClick={() => handleKPIClick("overallocated")}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--kpi-risk)]/5 to-transparent" />
              <CardContent className="relative p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-muted-foreground">Overallocated</p>
                    <p className="mt-1 text-3xl font-bold text-foreground">{overallocated}</p>
                    <div className="mt-1.5 flex items-center gap-1 text-sm">
                      <AlertTriangle className="h-3 w-3 text-[var(--kpi-risk)] flex-shrink-0" />
                      <span className="text-muted-foreground truncate">above 100% capacity</span>
                    </div>
                  </div>
                  <div className="rounded-full bg-[var(--kpi-risk-bg)] p-2.5 ring-1 ring-[var(--kpi-risk)]/20 flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-[var(--kpi-risk)]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className={`kpi-card-glow border-border/50 bg-gradient-to-br from-card to-card/80 relative overflow-hidden cursor-pointer transition-all duration-300 ${
                kpiFilter === "available"
                  ? "ring-2 ring-[var(--success)] shadow-lg"
                  : "hover:shadow-md hover:-translate-y-0.5"
              }`}
              onClick={() => handleKPIClick("available")}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--success)]/5 to-transparent" />
              <CardContent className="relative p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-muted-foreground">Available</p>
                    <p className="mt-1 text-3xl font-bold text-foreground">{available}</p>
                    <div className="mt-1.5 flex items-center gap-1 text-sm">
                      <CheckCircle2 className="h-3 w-3 text-[var(--success)] flex-shrink-0" />
                      <span className="text-muted-foreground truncate">below 70% capacity</span>
                    </div>
                  </div>
                  <div className="rounded-full bg-[var(--success-bg)] p-2.5 ring-1 ring-[var(--success)]/20 flex-shrink-0">
                    <CheckCircle2 className="h-5 w-5 text-[var(--success)]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {(kpiFilter || capacityBand !== "all" || selectedTeams.length > 0) && (
            <div className="flex items-center gap-2 flex-wrap">
              {kpiFilter && (
                <Badge variant="secondary" className="gap-1">
                  Filter: {kpiFilter === "overallocated" ? "Overallocated" : "Available"}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setKpiFilter(null)} />
                </Badge>
              )}
              {capacityBand !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Capacity: {capacityBand.charAt(0).toUpperCase() + capacityBand.slice(1)}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setCapacityBand("all")} />
                </Badge>
              )}
              {selectedTeams.length > 0 && (
                <Badge variant="secondary" className="gap-1">
                  Team: {selectedTeams.map((t) => t.charAt(0).toUpperCase() + t.slice(1)).join(", ")}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedTeams([])} />
                </Badge>
              )}
            </div>
          )}

          <CapacityCharts
            members={filteredMembers}
            onFilterByBand={handleFilterByBand}
            onFilterByTeam={handleFilterByTeam}
            activeCapacityBand={capacityBand}
            activeTeam={selectedTeams[0] || null}
          />

          <DiscoverabilityBar
            search={search}
            onSearchChange={setSearch}
            selectedTeams={selectedTeams}
            onTeamsChange={setSelectedTeams}
            selectedRoles={selectedRoles}
            onRolesChange={setSelectedRoles}
            selectedStatuses={selectedStatuses}
            onStatusesChange={setSelectedStatuses}
            capacityBand={capacityBand}
            onCapacityBandChange={setCapacityBand}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onReset={handleReset}
            availableRoles={availableRoles}
          />

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Team Members</CardTitle>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export to Excel
              </Button>
            </CardHeader>
            <CardContent>
              {sortedMembers.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-card">
                      <TableRow>
                        <TableHead
                          className="cursor-pointer"
                          onClick={() => setSortBy(sortBy === "name-asc" ? "name-desc" : "name-asc")}
                        >
                          Name {sortBy.startsWith("name") && (sortBy === "name-asc" ? "↑" : "↓")}
                        </TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Team</TableHead>
                        <TableHead
                          className="cursor-pointer"
                          onClick={() => setSortBy(sortBy === "capacity-asc" ? "capacity-desc" : "capacity-asc")}
                        >
                          Capacity {sortBy.startsWith("capacity") && (sortBy === "capacity-asc" ? "↑" : "↓")}
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead
                          className="cursor-pointer"
                          onClick={() => setSortBy(sortBy === "projects-asc" ? "projects-desc" : "projects-asc")}
                        >
                          Projects {sortBy.startsWith("projects") && (sortBy === "projects-asc" ? "↑" : "↓")}
                        </TableHead>
                        <TableHead>Assignments</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedMembers.map((member) => {
                        const projects = mockOpportunities.filter((opp) => member.projectIds.includes(opp.id))
                        const capacityColor = getCapacityColor(member.capacity)
                        return (
                          <TableRow
                            key={member.id}
                            className="cursor-pointer hover:bg-accent"
                            onClick={() => setSelectedMember(member)}
                          >
                            <TableCell className="font-medium">{member.name}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{member.role}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize">
                                {member.team}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1 min-w-[120px]">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium" style={{ color: capacityColor }}>
                                    {member.capacity}%
                                  </span>
                                </div>
                                <Progress
                                  value={Math.min(member.capacity, 100)}
                                  className="h-2"
                                  style={{
                                    backgroundColor: "hsl(var(--muted))",
                                  }}
                                />
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={getStatusBadgeVariant(member.capacity)}>
                                {getCapacityStatus(member.capacity)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm font-medium">{member.projectIds.length}</span>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                {projects.slice(0, 2).map((project) => (
                                  <span key={project.id} className="text-xs text-muted-foreground">
                                    {project.id}
                                  </span>
                                ))}
                                {projects.length > 2 && (
                                  <span className="text-xs text-muted-foreground">+{projects.length - 2} more</span>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No members match your filters</h3>
                  <p className="text-sm text-muted-foreground mb-4">Try adjusting your search or filter criteria</p>
                  <Button variant="outline" onClick={handleReset}>
                    Clear filters
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {selectedMember && (
        <MemberDetailDrawer
          member={selectedMember}
          projects={mockOpportunities.filter((opp) => selectedMember.projectIds.includes(opp.id))}
          onClose={() => setSelectedMember(null)}
        />
      )}
    </div>
  )
}
