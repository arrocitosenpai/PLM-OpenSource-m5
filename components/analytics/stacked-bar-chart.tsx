"use client"

import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface StackedBarChartProps {
  title: string
  description?: string
  data: any[]
  bars: {
    dataKey: string
    name: string
    color: string
  }[]
  xAxisKey?: string
  yAxisLabel?: string
  stacked?: boolean
  onBarClick?: (data: any) => void
}

export function StackedBarChart({
  title,
  description,
  data,
  bars,
  xAxisKey = "name",
  yAxisLabel,
  stacked = true,
  onBarClick,
}: StackedBarChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} onClick={onBarClick}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey={xAxisKey} className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
            <YAxis
              label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: "insideLeft" } : undefined}
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
              }}
            />
            <Legend />
            {bars.map((bar) => (
              <Bar
                key={bar.dataKey}
                dataKey={bar.dataKey}
                name={bar.name}
                fill={bar.color}
                stackId={stacked ? "stack" : undefined}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
