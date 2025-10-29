"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import type { WorkItem } from "@/lib/analytics-dummy-data"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface RightDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  items: WorkItem[]
}

export function RightDrawer({ open, onOpenChange, title, items }: RightDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[500px] sm:w-[600px]">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <ScrollArea className="mt-6 h-[calc(100vh-8rem)]">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="rounded-lg border border-border p-4">
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.id}</p>
                  </div>
                  <Badge variant="outline">{item.type}</Badge>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span>Assignee: {item.assignee}</span>
                  <span>•</span>
                  <span>Team: {item.team}</span>
                  <span>•</span>
                  <span>Status: {item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
