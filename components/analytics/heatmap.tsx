"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Info } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import type { WorkItem } from "@/lib/analytics-dummy-data"

interface HeatmapCell {
  x: string
  y: string
  value: number
  itemCount?: number
  items?: WorkItem[]
}

interface HeatmapProps {
  title: string
  subtitle?: string
  helpText?: string
  data: HeatmapCell[]
  xLabels: string[]
  yLabels: string[]
  xAxisLabel?: string
  yAxisLabel?: string
  valueLabel?: string
  slaThreshold?: number
  colorScale?: (value: number) => string
  onCellClick?: (data: HeatmapCell) => void
}

const defaultColorScale = (value: number) => {
  if (value === 0) return "bg-gray-200/50 dark:bg-gray-800/50"
  if (value >= 80) return "bg-red-500"
  if (value >= 60) return "bg-orange-500"
  if (value >= 40) return "bg-yellow-500"
  if (value >= 20) return "bg-blue-500"
  return "bg-green-500"
}

export function Heatmap({
  title,
  subtitle,
  helpText,
  data,
  xLabels,
  yLabels,
  xAxisLabel = "Week Starting",
  yAxisLabel = "Workflow Stage",
  valueLabel = "Avg hours in stage",
  slaThreshold,
  colorScale = defaultColorScale,
  onCellClick,
}: HeatmapProps) {
  const [showDataLabels, setShowDataLabels] = useState(true)
  const [hoveredCell, setHoveredCell] = useState<HeatmapCell | null>(null)

  const getValue = (x: string, y: string) => {
    return data.find((d) => d.x === x && d.y === y)
  }

  const hasData = data.some((d) => d.value > 0)
  const lastUpdated = new Date().toLocaleString()

  // Calculate min/median/max for legend
  const values = data.map((d) => d.value).filter((v) => v > 0)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const median = values.sort((a, b) => a - b)[Math.floor(values.length / 2)] || 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle>{title}</CardTitle>
              {helpText && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-5 w-5">
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <p className="text-sm text-muted-foreground">{helpText}</p>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="data-labels" checked={showDataLabels} onCheckedChange={setShowDataLabels} />
            <Label htmlFor="data-labels" className="text-xs">
              Labels
            </Label>
          </div>
        </div>
        {slaThreshold && (
          <div className="mt-2 text-xs text-muted-foreground">SLA for stage time: {slaThreshold} hours</div>
        )}
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="flex h-[200px] flex-col items-center justify-center gap-2 text-muted-foreground">
            <p>No data in selected range</p>
            <Button variant="outline" size="sm">
              Use demo data
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Legend */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium">{valueLabel}</span>
              <div className="flex items-center gap-4">
                <span>Min: {min}h</span>
                <span>Median: {median}h</span>
                <span>Max: {max}h</span>
              </div>
            </div>

            {/* Heatmap */}
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full">
                <div className="flex gap-2">
                  {/* Y-axis label (rotated) */}
                  <div className="flex items-center justify-center">
                    <div
                      className="text-xs font-medium whitespace-nowrap"
                      style={{
                        writingMode: "vertical-rl",
                        transform: "rotate(180deg)",
                        minWidth: "20px",
                      }}
                    >
                      {yAxisLabel}
                    </div>
                  </div>

                  {/* Main grid */}
                  <div className="flex-1">
                    <div className="mb-2 text-xs font-medium text-center">{xAxisLabel}</div>
                    <div
                      className="grid gap-0.5"
                      style={{ gridTemplateColumns: `140px repeat(${xLabels.length}, 85px)` }}
                    >
                      <div className="pb-1"></div>
                      {xLabels.map((label) => (
                        <div key={label} className="text-xs font-medium text-center p-1 truncate" title={label}>
                          {label}
                        </div>
                      ))}
                      {yLabels.map((yLabel) => (
                        <>
                          <div
                            key={`label-${yLabel}`}
                            className="text-xs font-medium flex items-center justify-start pr-3"
                          >
                            {yLabel}
                          </div>
                          {xLabels.map((xLabel) => {
                            const cellData = getValue(xLabel, yLabel)
                            const value = cellData?.value || 0
                            const exceedsSLA = slaThreshold && value > slaThreshold
                            return (
                              <div
                                key={`${xLabel}-${yLabel}`}
                                className={cn(
                                  "relative h-10 w-full rounded flex items-center justify-center text-xs font-medium transition-all",
                                  value > 0 ? "cursor-pointer hover:ring-2 hover:ring-primary" : "",
                                  colorScale(value),
                                  value > 50 ? "text-white" : "text-foreground",
                                )}
                                onClick={() => cellData && value > 0 && onCellClick?.(cellData)}
                                onMouseEnter={() => cellData && setHoveredCell(cellData)}
                                onMouseLeave={() => setHoveredCell(null)}
                              >
                                {showDataLabels && value > 0 && <span>{value}</span>}
                                {exceedsSLA && (
                                  <span className="absolute top-0 right-0 text-[8px] bg-red-600 text-white px-1 rounded-bl">
                                    &gt;SLA
                                  </span>
                                )}
                              </div>
                            )
                          })}
                        </>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tooltip */}
                {hoveredCell && hoveredCell.value > 0 && (
                  <div className="mt-4 p-3 bg-popover border rounded-lg text-sm">
                    <div className="font-medium">{hoveredCell.y}</div>
                    <div className="text-muted-foreground">Week: {hoveredCell.x}</div>
                    <div className="mt-2 space-y-1">
                      <div>
                        Avg time in stage: <span className="font-medium">{hoveredCell.value} hours</span>
                      </div>
                      {hoveredCell.itemCount !== undefined && (
                        <div>
                          # of items: <span className="font-medium">{hoveredCell.itemCount}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">Last updated: {lastUpdated}</CardFooter>
    </Card>
  )
}
