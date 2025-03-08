import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "@/lib/utils"

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root ref={ref} className={cn("relative overflow-hidden", className)} {...props}>
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">{children}</ScrollAreaPrimitive.Viewport>
    <ScrollAreaPrimitive.Scrollbar
      className="flex h-full select-none space-x-1 border-l border-l-primary-orange p-[1px] data-[orientation=vertical]:flex-col data-[orientation=vertical]:space-y-1 data-[orientation=horizontal]:h-2.5 data-[orientation=horizontal]:w-full"
      orientation="vertical"
    >
      <ScrollAreaPrimitive.Thumb className="relative flex-1 rounded-full bg-primary-orange" />
    </ScrollAreaPrimitive.Scrollbar>
    <ScrollAreaPrimitive.Corner className="h-2.5 w-2.5 bg-background" />
  </ScrollAreaPrimitive.Root>
))
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

export { ScrollArea }

