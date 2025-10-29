"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StageBottleneck {
  stage: string
  avgDays: number
  projectCount: number
  color: string
}

interface StageBottlenecksListProps {
  title: string
  description?: string
  data: StageBottleneck[]
}

export function StageBottlenecksList({ title, description, data }: StageBottlenecksListProps) {
  const maxDays = Math.max(...data.map((d) => d.avgDays))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index} className="group relative">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={cn("h-2 w-2 rounded-full flex-shrink-0")} style={{ backgroundColor: item.color }} />
                  <span className="font-medium text-sm truncate">{item.stage}</span>
                </div>
                <div className="flex items-center gap-6 flex-shrink-0">
                  <span className="font-semibold text-sm">{item.avgDays} days</span>
                  <span className="text-sm text-muted-foreground w-20 text-right">
                    {item.projectCount} project{item.projectCount !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
              {/* Progress bar background */}
              <div className="mt-2 h-1 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${(item.avgDays / maxDays) * 100}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
