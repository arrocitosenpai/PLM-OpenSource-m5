import { Badge } from "@/components/ui/badge"
import { type Priority, getPriorityLabel } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { AlertCircle, AlertTriangle, Info } from "lucide-react"

interface PriorityBadgeProps {
  priority: Priority
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const getIcon = () => {
    switch (priority) {
      case "high":
        return <AlertCircle className="mr-1 h-3 w-3" />
      case "medium":
        return <AlertTriangle className="mr-1 h-3 w-3" />
      case "low":
        return <Info className="mr-1 h-3 w-3" />
    }
  }

  const getStyles = () => {
    switch (priority) {
      case "high":
        return "border-destructive/50 bg-[var(--danger-bg)] text-destructive font-semibold ring-1 ring-destructive/20"
      case "medium":
        return "border-warning/50 bg-[var(--warning-bg)] text-warning font-medium ring-1 ring-warning/20"
      case "low":
        return "border-success/50 bg-[var(--success-bg)] text-success ring-1 ring-success/20"
    }
  }

  return (
    <Badge variant="outline" className={cn("flex items-center gap-1 transition-smooth", getStyles())}>
      {getIcon()}
      {getPriorityLabel(priority)}
    </Badge>
  )
}
