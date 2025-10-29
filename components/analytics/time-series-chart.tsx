"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface TimeSeriesChartProps {
  title: string
  description?: string
  data: any[]
  lines: {
    dataKey: string
    name: string
    color: string
  }[]
  xAxisKey?: string
  yAxisLabel?: string
  onPointClick?: (data: any) => void
}

export function TimeSeriesChart({
  title,
  description,
  data,
  lines,
  xAxisKey = "week",
  yAxisLabel,
  onPointClick,
}: TimeSeriesChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} onClick={onPointClick}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey={xAxisKey}
              className="text-xs"
              tick={{ fill: "currentColor", fontWeight: "normal" }}
              axisLine={{ stroke: "currentColor", strokeWidth: 2 }}
              tickLine={{ stroke: "currentColor", strokeWidth: 1 }}
            />
            <YAxis
              label={
                yAxisLabel
                  ? {
                      value: yAxisLabel,
                      angle: -90,
                      position: "insideLeft",
                      style: {
                        textAnchor: "middle",
                        fontSize: "14px",
                        fontWeight: "normal",
                        fill: "currentColor",
                      },
                      offset: 10,
                    }
                  : undefined
              }
              className="text-xs"
              tick={{ fill: "currentColor", fontWeight: "normal" }}
              axisLine={{ stroke: "currentColor", strokeWidth: 2 }}
              tickLine={{ stroke: "currentColor", strokeWidth: 1 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
              }}
            />
            <Legend />
            {lines.map((line) => (
              <Line
                key={line.dataKey}
                type="monotone"
                dataKey={line.dataKey}
                name={line.name}
                stroke={line.color}
                strokeWidth={2}
                dot={{ r: 5, strokeWidth: 2, fill: line.color, stroke: line.color }}
                activeDot={{ r: 7, fill: line.color, stroke: line.color }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
