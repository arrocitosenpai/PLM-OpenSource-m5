"use client"

import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import type { TeamType } from "@/lib/mock-data"

interface DiscoverabilityBarProps {
  search: string
  onSearchChange: (value: string) => void
  selectedTeams: TeamType[]
  onTeamsChange: (teams: TeamType[]) => void
  selectedRoles: string[]
  onRolesChange: (roles: string[]) => void
  selectedStatuses: string[]
  onStatusesChange: (statuses: string[]) => void
  capacityBand: "all" | "under" | "balanced" | "high" | "over"
  onCapacityBandChange: (band: "all" | "under" | "balanced" | "high" | "over") => void
  sortBy: string
  onSortChange: (sort: string) => void
  onReset: () => void
  availableRoles: string[]
}

export function DiscoverabilityBar({
  search,
  onSearchChange,
  selectedTeams,
  onTeamsChange,
  selectedRoles,
  onRolesChange,
  selectedStatuses,
  onStatusesChange,
  capacityBand,
  onCapacityBandChange,
  sortBy,
  onSortChange,
  onReset,
  availableRoles,
}: DiscoverabilityBarProps) {
  const teams: TeamType[] = ["product", "engineering", "platform"]
  const statuses = ["Available", "Optimal", "High", "Overallocated"]

  const toggleTeam = (team: TeamType) => {
    if (selectedTeams.includes(team)) {
      onTeamsChange(selectedTeams.filter((t) => t !== team))
    } else {
      onTeamsChange([...selectedTeams, team])
    }
  }

  const toggleRole = (role: string) => {
    if (selectedRoles.includes(role)) {
      onRolesChange(selectedRoles.filter((r) => r !== role))
    } else {
      onRolesChange([...selectedRoles, role])
    }
  }

  const toggleStatus = (status: string) => {
    if (selectedStatuses.includes(status)) {
      onStatusesChange(selectedStatuses.filter((s) => s !== status))
    } else {
      onStatusesChange([...selectedStatuses, status])
    }
  }

  const hasActiveFilters =
    search ||
    selectedTeams.length > 0 ||
    selectedRoles.length > 0 ||
    selectedStatuses.length > 0 ||
    capacityBand !== "all" ||
    sortBy !== "name-asc"

  return (
    <div className="space-y-4 rounded-lg border border-border bg-card p-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, role, team, or assignment..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
            aria-label="Search members"
          />
        </div>

        {/* Sort */}
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-[180px]" aria-label="Sort by">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name-asc">Name (A-Z)</SelectItem>
            <SelectItem value="name-desc">Name (Z-A)</SelectItem>
            <SelectItem value="capacity-asc">Capacity (Low-High)</SelectItem>
            <SelectItem value="capacity-desc">Capacity (High-Low)</SelectItem>
            <SelectItem value="projects-asc">Projects (Low-High)</SelectItem>
            <SelectItem value="projects-desc">Projects (High-Low)</SelectItem>
          </SelectContent>
        </Select>

        {/* Reset */}
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={onReset}>
            <X className="mr-1 h-4 w-4" />
            Reset
          </Button>
        )}
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-4">
        {/* Team Filter */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Team</Label>
          <div className="flex flex-wrap gap-2">
            {teams.map((team) => (
              <Badge
                key={team}
                variant={selectedTeams.includes(team) ? "default" : "outline"}
                className="cursor-pointer capitalize"
                onClick={() => toggleTeam(team)}
              >
                {team}
              </Badge>
            ))}
          </div>
        </div>

        {/* Role Filter */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Role</Label>
          <div className="flex flex-wrap gap-2">
            {availableRoles.map((role) => (
              <Badge
                key={role}
                variant={selectedRoles.includes(role) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleRole(role)}
              >
                {role}
              </Badge>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Status</Label>
          <div className="flex flex-wrap gap-2">
            {statuses.map((status) => (
              <Badge
                key={status}
                variant={selectedStatuses.includes(status) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleStatus(status)}
              >
                {status}
              </Badge>
            ))}
          </div>
        </div>

        {/* Capacity Band Filter */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Capacity Band</Label>
          <Select value={capacityBand} onValueChange={(v) => onCapacityBandChange(v as any)}>
            <SelectTrigger className="w-[180px]" aria-label="Filter by capacity band">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="under">Under (&lt;70%)</SelectItem>
              <SelectItem value="balanced">Balanced (70-100%)</SelectItem>
              <SelectItem value="high">High (100-110%)</SelectItem>
              <SelectItem value="over">Over (&gt;110%)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
