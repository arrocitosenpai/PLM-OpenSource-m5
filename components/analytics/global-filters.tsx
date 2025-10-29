"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, X } from "lucide-react"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"

interface GlobalFiltersProps {
  dateRange?: DateRange
  onDateRangeChange: (range: DateRange | undefined) => void
  teams: string[]
  selectedTeams: string[]
  onTeamsChange: (teams: string[]) => void
  projects: string[]
  selectedProjects: string[]
  onProjectsChange: (projects: string[]) => void
  onReset: () => void
}

export function GlobalFilters({
  dateRange,
  onDateRangeChange,
  teams,
  selectedTeams,
  onTeamsChange,
  projects,
  selectedProjects,
  onProjectsChange,
  onReset,
}: GlobalFiltersProps) {
  return (
    <div className="sticky top-0 z-10 border-b border-border bg-card px-6 py-4">
      <div className="flex flex-wrap items-center gap-3">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="justify-start text-left font-normal bg-transparent">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(dateRange.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="range" selected={dateRange} onSelect={onDateRangeChange} numberOfMonths={2} />
          </PopoverContent>
        </Popover>

        <Select
          value={selectedTeams.length === 1 ? selectedTeams[0] : "all"}
          onValueChange={(value) => onTeamsChange(value === "all" ? [] : [value])}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Teams" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Teams</SelectItem>
            {teams.map((team) => (
              <SelectItem key={team} value={team}>
                {team}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedProjects.length === 1 ? selectedProjects[0] : "all"}
          onValueChange={(value) => onProjectsChange(value === "all" ? [] : [value])}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Projects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {projects.map((project) => (
              <SelectItem key={project} value={project}>
                {project}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="ghost" size="sm" onClick={onReset} className="gap-1">
          <X className="h-4 w-4" />
          Reset filters
        </Button>
      </div>
    </div>
  )
}
