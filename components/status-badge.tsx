import { Badge } from "@/components/ui/badge"
import { type OpportunityStatus, getStatusLabel } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { CheckCircle2, Clock, AlertCircle, XCircle, Circle } from "lucide-react"

interface StatusBadgeProps {
  status: OpportunityStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getIcon = () => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="mr-1 h-3 w-3" />
      case "in-progress":
        return <Clock className="mr-1 h-3 w-3" />
      case "need-clarification":
        return <AlertCircle className="mr-1 h-3 w-3" />
      case "cancelled":
        return <XCircle className="mr-1 h-3 w-3" />
      case "not-started":
        return <Circle className="mr-1 h-3 w-3" />
    }
  }

  const getStyles = () => {
    switch (status) {
      case "completed":
        return "border-success/50 bg-[var(--success-bg)] text-success ring-1 ring-success/20"
      case "in-progress":
        return "border-primary/50 bg-[var(--kpi-total-bg)] text-primary ring-1 ring-primary/20"
      case "need-clarification":
        return "border-warning/50 bg-[var(--warning-bg)] text-warning ring-1 ring-warning/20"
      case "cancelled":
        return "border-destructive/50 bg-[var(--danger-bg)] text-destructive ring-1 ring-destructive/20"
      case "not-started":
        return "border-muted-foreground/50 bg-muted text-muted-foreground ring-1 ring-muted-foreground/20"
    }
  }

  return (
    <Badge variant="outline" className={cn("flex items-center gap-1 transition-smooth", getStyles())}>
      {getIcon()}
      {getStatusLabel(status)}
    </Badge>
  )
}
