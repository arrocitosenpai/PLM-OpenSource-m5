import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface KpiTileProps {
  title: string
  value: string | number
  delta?: number
  trend?: "up" | "down" | "neutral"
  caption?: string
  icon?: React.ReactNode
  trendLabel?: string
  className?: string
}

export function KpiTile({ title, value, delta, trend, caption, icon, trendLabel, className }: KpiTileProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {delta !== undefined && trend && (
          <div className="mt-1 flex items-center gap-1 text-xs">
            {trend === "up" && <TrendingUp className="h-3 w-3 text-success" />}
            {trend === "down" && <TrendingDown className="h-3 w-3 text-destructive" />}
            <span
              className={cn(
                "font-medium",
                trend === "up" && "text-success",
                trend === "down" && "text-destructive",
                trend === "neutral" && "text-muted-foreground",
              )}
            >
              {delta > 0 ? "+" : ""}
              {delta}%
            </span>
            <span className="text-muted-foreground">{trendLabel || "vs prior period"}</span>
          </div>
        )}
        {caption && <p className="mt-1 text-xs text-muted-foreground">{caption}</p>}
      </CardContent>
    </Card>
  )
}
