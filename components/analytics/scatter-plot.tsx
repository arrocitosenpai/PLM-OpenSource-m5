"use client"

import { Scatter, ScatterChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis, Cell } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ScatterPlotProps {
  title: string
  description?: string
  data: any[]
  xKey: string
  yKey: string
  zKey?: string
  xLabel?: string
  yLabel?: string
  colorKey?: string
  colors?: string[]
  onPointClick?: (data: any) => void
}

export function ScatterPlot({
  title,
  description,
  data,
  xKey,
  yKey,
  zKey,
  xLabel,
  yLabel,
  colorKey,
  colors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"],
  onPointClick,
}: ScatterPlotProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={380}>
          <ScatterChart onClick={onPointClick} margin={{ top: 20, right: 20, bottom: 60, left: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              type="number"
              dataKey={xKey}
              name={xLabel || xKey}
              label={{
                value: xLabel || xKey,
                position: "insideBottom",
                offset: -10,
                style: {
                  textAnchor: "middle",
                  fontSize: "14px",
                  fontWeight: "normal",
                  fill: "currentColor",
                },
              }}
              className="text-xs"
              tick={{ fill: "currentColor", fontWeight: "normal" }}
              axisLine={{ stroke: "currentColor", strokeWidth: 2 }}
              tickLine={{ stroke: "currentColor", strokeWidth: 1 }}
            />
            <YAxis
              type="number"
              dataKey={yKey}
              name={yLabel || yKey}
              label={{
                value: yLabel || yKey,
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
              className="text-xs"
              tick={{ fill: "currentColor", fontWeight: "normal" }}
              axisLine={{ stroke: "currentColor", strokeWidth: 2 }}
              tickLine={{ stroke: "currentColor", strokeWidth: 1 }}
            />
            {zKey && <ZAxis type="number" dataKey={zKey} range={[50, 400]} />}
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
              }}
            />
            <Scatter data={data} fill="#3b82f6">
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colorKey && entry[colorKey] ? colors[index % colors.length] : "#3b82f6"}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
