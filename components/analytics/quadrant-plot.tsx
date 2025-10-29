"use client"

import {
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface QuadrantPlotProps {
  title: string
  description?: string
  data: any[]
  xKey: string
  yKey: string
  nameKey: string
  xLabel?: string
  yLabel?: string
  xThreshold?: number
  yThreshold?: number
  quadrantLabels?: {
    topLeft: string
    topRight: string
    bottomLeft: string
    bottomRight: string
  }
  onPointClick?: (data: any) => void
}

export function QuadrantPlot({
  title,
  description,
  data,
  xKey,
  yKey,
  nameKey,
  xLabel,
  yLabel,
  xThreshold,
  yThreshold,
  quadrantLabels = {
    topLeft: "High Impact, Low Effort",
    topRight: "High Impact, High Effort",
    bottomLeft: "Low Impact, Low Effort",
    bottomRight: "Low Impact, High Effort",
  },
  onPointClick,
}: QuadrantPlotProps) {
  // Calculate thresholds if not provided
  const xValues = data.map((d) => d[xKey])
  const yValues = data.map((d) => d[yKey])
  const xMid = xThreshold ?? xValues.reduce((a, b) => a + b, 0) / xValues.length
  const yMid = yThreshold ?? yValues.reduce((a, b) => a + b, 0) / yValues.length

  const getQuadrantColor = (x: number, y: number) => {
    if (x < xMid && y >= yMid) return "#10b981" // Top left - green
    if (x >= xMid && y >= yMid) return "#f59e0b" // Top right - orange
    if (x < xMid && y < yMid) return "#6b7280" // Bottom left - gray
    return "#ef4444" // Bottom right - red
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart onClick={onPointClick}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              type="number"
              dataKey={xKey}
              name={xLabel || xKey}
              label={{ value: xLabel || xKey, position: "insideBottom", offset: -5 }}
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              type="number"
              dataKey={yKey}
              name={yLabel || yKey}
              label={{ value: yLabel || yKey, angle: -90, position: "insideLeft" }}
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload
                  return (
                    <div className="bg-popover border border-border rounded-md p-2 text-sm">
                      <p className="font-medium">{data[nameKey]}</p>
                      <p className="text-muted-foreground">
                        {xLabel}: {data[xKey]}
                      </p>
                      <p className="text-muted-foreground">
                        {yLabel}: {data[yKey]}
                      </p>
                    </div>
                  )
                }
                return null
              }}
            />
            <ReferenceLine x={xMid} stroke="hsl(var(--border))" strokeDasharray="3 3" />
            <ReferenceLine y={yMid} stroke="hsl(var(--border))" strokeDasharray="3 3" />
            <Scatter data={data} fill="#3b82f6">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getQuadrantColor(entry[xKey], entry[yKey])} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>{quadrantLabels.topLeft}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span>{quadrantLabels.topRight}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-500"></div>
            <span>{quadrantLabels.bottomLeft}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>{quadrantLabels.bottomRight}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
