import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { type Stage, getStageLabel } from "@/lib/mock-data"

const stages: Stage[] = ["intake", "product", "engineering", "platform", "implementation", "support"]

interface StageProgressProps {
  currentStage: Stage
}

export function StageProgress({ currentStage }: StageProgressProps) {
  const currentIndex = stages.indexOf(currentStage)

  return (
    <div className="flex items-center gap-2">
      {stages.map((stage, index) => {
        const isCompleted = index < currentIndex
        const isCurrent = index === currentIndex
        const isUpcoming = index > currentIndex

        return (
          <div key={stage} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-semibold transition-all duration-300",
                  isCompleted && "border-success bg-success text-white shadow-sm",
                  isCurrent && "border-primary bg-primary text-white shadow-md ring-2 ring-primary/20",
                  isUpcoming && "border-muted-foreground/30 bg-muted text-muted-foreground",
                )}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              {/* </CHANGE> */}
              <span
                className={cn(
                  "text-xs font-medium",
                  isCurrent && "text-foreground",
                  !isCurrent && "text-muted-foreground",
                )}
              >
                {getStageLabel(stage)}
              </span>
            </div>
            {index < stages.length - 1 && (
              <div
                className={cn(
                  "mx-2 h-0.5 w-12 transition-all duration-300",
                  index < currentIndex ? "bg-success" : "bg-muted",
                )}
              />
            )}
            {/* </CHANGE> */}
          </div>
        )
      })}
    </div>
  )
}
