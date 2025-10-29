"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface SimpleBarChartProps {
  title: string
  description?: string
  data: Array<{
    name: string
    value: number
    fill: string // renamed color to fill
  }>
  yAxisLabel?: string
  valueUnit?: string
}

export function SimpleBarChart({ title, description, data, yAxisLabel, valueUnit = "" }: SimpleBarChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="name"
              fontSize={12}
              tickLine={{ stroke: "currentColor", strokeWidth: 1 }}
              axisLine={{ stroke: "currentColor", strokeWidth: 2 }}
              angle={0}
              textAnchor="middle"
              tick={{ fill: "currentColor", fontWeight: "normal" }}
            />
            <YAxis
              fontSize={12}
              tickLine={{ stroke: "currentColor", strokeWidth: 1 }}
              axisLine={{ stroke: "currentColor", strokeWidth: 2 }}
              tick={{ fill: "currentColor", fontWeight: "normal" }}
              label={{
                value: yAxisLabel,
                angle: -90,
                position: "insideLeft",
                style: {
                  textAnchor: "middle",
                  fill: "currentColor",
                  fontSize: 14,
                  fontWeight: "normal",
                },
                offset: 10,
              }}
            />
            <Tooltip
              cursor={{ fill: "hsl(var(--muted))" }}
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null
                const data = payload[0].payload
                return (
                  <div className="rounded-lg border bg-background p-3 shadow-lg">
                    <div className="font-medium">{data.name}</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {data.value}
                      {valueUnit}
                    </div>
                  </div>
                )
              }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
