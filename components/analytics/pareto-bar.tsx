"use client"

import { useState } from "react"
import {
  Bar,
  Line,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  LabelList,
} from "recharts"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Info } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import type { WorkItem } from "@/lib/analytics-dummy-data"

type MetricType = "blockedHours" | "blockedItems" | "avgBlockDuration"

interface ParetoDataPoint {
  name: string
  blockedHours: number
  blockedItems: number
  avgBlockDuration: number
  medianBlockDuration?: number
  items?: WorkItem[]
}

interface ParetoBarProps {
  title: string
  subtitle?: string
  helpText?: string
  data: ParetoDataPoint[]
  onBarClick?: (data: ParetoDataPoint) => void
}

export function ParetoBar({ title, subtitle, helpText, data, onBarClick }: ParetoBarProps) {
  const [metric, setMetric] = useState<MetricType>("blockedHours")
  const [showDataLabels, setShowDataLabels] = useState(false)

  const metricConfig = {
    blockedHours: {
      label: "Blocked Hours",
      yAxisLabel: "Total Blocked Hours",
      dataKey: "blockedHours",
    },
    blockedItems: {
      label: "Blocked Items",
      yAxisLabel: "Blocked Items (count)",
      dataKey: "blockedItems",
    },
    avgBlockDuration: {
      label: "Avg Duration",
      yAxisLabel: "Avg Block Duration (hrs)",
      dataKey: "avgBlockDuration",
    },
  }

  const currentConfig = metricConfig[metric]

  // Calculate cumulative percentage based on selected metric
  const total = data.reduce((sum, item) => sum + item[currentConfig.dataKey], 0)
  let cumulative = 0
  const enrichedData = data.map((item) => {
    cumulative += item[currentConfig.dataKey]
    return {
      ...item,
      cumulativePercent: total > 0 ? (cumulative / total) * 100 : 0,
    }
  })

  const hasData = data.length > 0 && total > 0
  const lastUpdated = new Date().toLocaleString()

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload[0]) return null

    const data = payload[0].payload as ParetoDataPoint & { cumulativePercent: number }

    return (
      <div className="bg-popover border rounded-lg p-3 shadow-lg">
        <div className="font-medium mb-2">{data.name}</div>
        <div className="space-y-1 text-sm">
          <div>
            Total blocked hours: <span className="font-medium">{data.blockedHours}</span>
          </div>
          <div>
            Blocked items (count): <span className="font-medium">{data.blockedItems}</span>
          </div>
          <div>
            Median block duration: <span className="font-medium">{data.medianBlockDuration || 0} hrs</span>
          </div>
          <div>
            % of all blocked hours:{" "}
            <span className="font-medium">{((data.blockedHours / total) * 100).toFixed(1)}%</span>
          </div>
        </div>
      </div>
    )
  }

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
            <Switch id="data-labels-pareto" checked={showDataLabels} onCheckedChange={setShowDataLabels} />
            <Label htmlFor="data-labels-pareto" className="text-xs">
              Labels
            </Label>
          </div>
        </div>

        {/* Metric Toggle */}
        <div className="flex gap-2 mt-4">
          {(Object.keys(metricConfig) as MetricType[]).map((key) => (
            <Button
              key={key}
              variant={metric === key ? "default" : "outline"}
              size="sm"
              onClick={() => setMetric(key)}
              className="text-xs"
            >
              {metricConfig[key].label}
            </Button>
          ))}
        </div>
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
            <div className="flex items-center justify-center gap-6 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded" />
                <span>{currentConfig.label} (bars)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-red-500" />
                <span>Cumulative % (line)</span>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={240}>
              <ComposedChart
                data={enrichedData}
                onClick={(e) => e?.activePayload?.[0] && onBarClick?.(e.activePayload[0].payload)}
                margin={{ top: 10, right: 80, bottom: 20, left: 80 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="name"
                  className="text-xs"
                  tick={{ fill: "currentColor", fontSize: 11, fontWeight: "normal" }}
                  axisLine={{ stroke: "currentColor", strokeWidth: 2 }}
                  tickLine={{ stroke: "currentColor", strokeWidth: 1 }}
                  angle={0}
                  textAnchor="middle"
                  height={60}
                />
                <YAxis
                  yAxisId="left"
                  className="text-xs"
                  tick={{ fill: "currentColor", fontWeight: "normal" }}
                  axisLine={{ stroke: "currentColor", strokeWidth: 2 }}
                  tickLine={{ stroke: "currentColor", strokeWidth: 1 }}
                  label={{
                    value: currentConfig.yAxisLabel,
                    angle: -90,
                    position: "insideLeft",
                    style: {
                      textAnchor: "middle",
                      fontSize: "14px",
                      fontWeight: "normal",
                      fill: "currentColor",
                    },
                    offset: 15,
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[0, 100]}
                  className="text-xs"
                  tick={{ fill: "currentColor", fontWeight: "normal" }}
                  axisLine={{ stroke: "currentColor", strokeWidth: 2 }}
                  tickLine={{ stroke: "currentColor", strokeWidth: 1 }}
                  label={{
                    value: "Cumulative Share of Blocked Time (%)",
                    angle: 90,
                    position: "insideRight",
                    style: {
                      textAnchor: "middle",
                      fontSize: "14px",
                      fontWeight: "normal",
                      fill: "currentColor",
                    },
                    offset: 15,
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine yAxisId="right" y={80} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3">
                  <Label
                    value="Typical Pareto threshold (80/20)"
                    position="top"
                    style={{ fontSize: 10, fill: "hsl(var(--foreground))" }}
                  />
                </ReferenceLine>
                <Bar yAxisId="left" dataKey={currentConfig.dataKey} fill="#3b82f6" cursor="pointer">
                  {showDataLabels && (
                    <LabelList
                      dataKey={currentConfig.dataKey}
                      position="top"
                      style={{ fontSize: 10, fill: "hsl(var(--foreground))" }}
                    />
                  )}
                </Bar>
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="cumulativePercent"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#ef4444" }}
                />
              </ComposedChart>
            </ResponsiveContainer>

            {/* Glossary Link */}
            <div className="text-xs text-muted-foreground">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="link" className="h-auto p-0 text-xs">
                    View glossary
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-96">
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="font-medium">Blocked</div>
                      <div className="text-muted-foreground">
                        An item cannot progress due to an external dependency, unresolved review, environment issue, or
                        similar impediment.
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">Blocked Hours</div>
                      <div className="text-muted-foreground">Total elapsed time while an item is marked blocked.</div>
                    </div>
                    <div>
                      <div className="font-medium">Pareto</div>
                      <div className="text-muted-foreground">
                        Ranks causes by impact; the cumulative line shows how quickly the top few causes add up (often
                        ~80% from the top 20%).
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">Last updated: {lastUpdated}</CardFooter>
    </Card>
  )
}
